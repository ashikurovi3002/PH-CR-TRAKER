"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Plus, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Activity Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/admin/activities');
      setActivities(res.data.data || []);
    } catch (err) {
      console.log("Failed to load activities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !points) return toast.error("Title and Points are required");
    
    setSubmitting(true);
    try {
      await api.post('/admin/activities', {
        title,
        description,
        points: parseInt(points, 10),
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined
      });
      toast.success("Activity created successfully!");
      setTitle("");
      setDescription("");
      setPoints("");
      setStartDate("");
      setEndDate("");
      fetchActivities();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create activity");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Activities</h1>
          <p className="text-gray-500">Create and manage point-earning activities for ambassadors.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-indigo-600 hover:bg-indigo-700">
          {showAddForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showAddForm ? "Cancel" : "Create Activity"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form to add an activity */}
        {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-1 h-fit">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" /> Create Activity
          </h2>
          <form onSubmit={handleAddActivity} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Activity Name/Title *</label>
              <Input
                type="text"
                placeholder="e.g. Organized a tech seminar"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                type="text"
                placeholder="Optional details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Points *</label>
              <Input
                type="number"
                placeholder="e.g. 100"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Create Activity"}
            </Button>
          </form>
        </div>
        )}

        {/* Activities List Table */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden ${showAddForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold">Active Activities</h2>
          </div>
          {loading ? (
             <div className="p-12 flex justify-center">
               <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Activity</th>
                    <th className="px-6 py-4 font-medium">Points</th>
                    <th className="px-6 py-4 font-medium">Dates</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No activities created yet.
                      </td>
                    </tr>
                  ) : (
                    activities.map((act) => (
                      <tr key={act.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">{act.title}</div>
                          {act.description && <div className="text-xs text-gray-500 mt-1">{act.description}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-indigo-600">{act.points} pts</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          {act.startDate || act.endDate ? (
                            <div className="flex flex-col gap-1">
                              {act.startDate && <span>Starts: {new Date(act.startDate).toLocaleDateString()}</span>}
                              {act.endDate && <span>Ends: {new Date(act.endDate).toLocaleDateString()}</span>}
                            </div>
                          ) : (
                            <span className="italic">No limit</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${act.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {act.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
