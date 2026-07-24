"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Reward Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [requiredPoints, setRequiredPoints] = useState("");
  const [stock, setStock] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRewards = async () => {
    try {
      const res = await api.get('/admin/rewards');
      setRewards(res.data.data || []);
    } catch (err) {
      console.log("Failed to load rewards", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleAddReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !requiredPoints) return toast.error("Name and Required Points are required");
    
    setSubmitting(true);
    try {
      await api.post('/admin/rewards', {
        name,
        description,
        requiredPoints: parseInt(requiredPoints, 10),
        stock: stock ? parseInt(stock, 10) : 0,
      });
      toast.success("Reward created successfully!");
      setName("");
      setDescription("");
      setRequiredPoints("");
      setStock("");
      fetchRewards();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create reward");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/admin/rewards/${id}`, { status });
      toast.success(`Reward marked as ${status}`);
      fetchRewards();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Rewards</h1>
          <p className="text-gray-500">Create gifts that ambassadors can redeem with their points.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form to add a reward */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-1 h-fit">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" /> Create Reward
          </h2>
          <form onSubmit={handleAddReward} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Gift Name *</label>
              <Input
                type="text"
                placeholder="e.g. Exclusive T-Shirt"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Points Needed *</label>
                <Input
                  type="number"
                  placeholder="e.g. 500"
                  value={requiredPoints}
                  onChange={(e) => setRequiredPoints(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock Amount</label>
                <Input
                  type="number"
                  placeholder="e.g. 50"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Add Reward"}
            </Button>
          </form>
        </div>

        {/* Rewards List Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-2 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold">Available Rewards</h2>
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
                    <th className="px-6 py-4 font-medium">Reward</th>
                    <th className="px-6 py-4 font-medium">Points Cost</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {rewards.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No rewards created yet.
                      </td>
                    </tr>
                  ) : (
                    rewards.map((reward) => (
                      <tr key={reward.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">{reward.name}</div>
                          {reward.description && <div className="text-xs text-gray-500 mt-1">{reward.description}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-indigo-600">{reward.requiredPoints} pts</span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {reward.stock} left
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${reward.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {reward.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                           {reward.status === 'ACTIVE' ? (
                             <Button size="sm" variant="outline" className="h-8 text-red-600" onClick={() => handleUpdateStatus(reward.id, "INACTIVE")}>
                               Deactivate
                             </Button>
                           ) : (
                             <Button size="sm" variant="outline" className="h-8 text-green-600" onClick={() => handleUpdateStatus(reward.id, "ACTIVE")}>
                               Activate
                             </Button>
                           )}
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
