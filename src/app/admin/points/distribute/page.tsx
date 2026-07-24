"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Calculator, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DistributePointsPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actRes, userRes] = await Promise.all([
          api.get('/admin/activities'),
          api.get('/admin/users')
        ]);
        // Only show active activities
        setActivities(actRes.data.data.filter((a: any) => a.status === 'ACTIVE') || []);
        // Only show active ambassadors
        setUsers(userRes.data.data.filter((u: any) => u.status === 'ACTIVE') || []);
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentActivityObj = activities.find(a => a.id.toString() === selectedActivity);

  const toggleUser = (userId: number) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const selectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set()); // Deselect all
    } else {
      setSelectedUsers(new Set(users.map(u => u.id))); // Select all
    }
  };

  const handleGrantPoints = async () => {
    if (!selectedActivity) return toast.error("Please select an activity");
    if (selectedUsers.size === 0) return toast.error("Please select at least one user");
    if (!currentActivityObj) return toast.error("Invalid activity selected");

    setSubmitting(true);
    try {
      const res = await api.post('/admin/points/bulk', {
        userIds: Array.from(selectedUsers),
        activityId: currentActivityObj.id,
        points: currentActivityObj.points,
        note
      });
      toast.success(res.data.message || `Granted ${currentActivityObj.points} points to ${selectedUsers.size} users!`);
      setSelectedUsers(new Set());
      setNote("");
      setSelectedActivity("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to grant points");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Points Calculator</h1>
          <p className="text-gray-500">Quickly select an activity and grant points to multiple ambassadors at once.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Step 1: Select Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-1 h-fit space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" /> Grant Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">1. Select Activity</label>
                <select 
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                >
                  <option value="" disabled>-- Choose an Activity --</option>
                  {activities.map(act => (
                    <option key={act.id} value={act.id}>{act.title} ({act.points} pts)</option>
                  ))}
                </select>
              </div>

              {currentActivityObj && (
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800 text-center">
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Points to be granted</p>
                  <p className="text-4xl font-black text-indigo-700 dark:text-indigo-300 my-2">+{currentActivityObj.points}</p>
                  <p className="text-xs text-indigo-500 dark:text-indigo-400">per selected user</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Note (Optional)</label>
                <Input
                  type="text"
                  placeholder="e.g. For amazing performance"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleGrantPoints} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 text-lg shadow-lg"
                  disabled={submitting || !selectedActivity || selectedUsers.size === 0}
                >
                  {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : `Grant to ${selectedUsers.size} Users`}
                </Button>
              </div>
            </div>
          </div>

          {/* Step 2: Select Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-indigo-600" /> 2. Select Ambassadors
              </h2>
              <Button variant="outline" size="sm" onClick={selectAll}>
                {selectedUsers.size === users.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
            
            <div className="overflow-y-auto max-h-[600px] p-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
                {users.length === 0 ? (
                  <p className="text-center text-gray-500 col-span-2 py-8">No active ambassadors found.</p>
                ) : (
                  users.map((user) => {
                    const isSelected = selectedUsers.has(user.id);
                    return (
                      <div 
                        key={user.id}
                        onClick={() => toggleUser(user.id)}
                        className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all duration-200 ${
                          isSelected 
                            ? 'bg-indigo-50 border-indigo-500 shadow-sm dark:bg-indigo-900/40 dark:border-indigo-400' 
                            : 'bg-white border-gray-200 hover:border-indigo-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-indigo-600'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-md border flex flex-shrink-0 items-center justify-center ${
                          isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                        }`}>
                          {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`font-semibold truncate ${isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-gray-100'}`}>
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.campus || user.email}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-medium text-gray-500">Current</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{user.totalPoints} pts</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            {/* Footer sticky summary */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 mt-auto flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">{selectedUsers.size} selected</span>
              <span className="text-sm font-medium text-gray-500">Total ambassadors: {users.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
