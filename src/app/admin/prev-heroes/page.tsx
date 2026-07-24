"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Search, X, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  campus: string;
  totalPoints: number;
  status: string;
  institutionType?: string;
  createdAt: string;
}

export default function AdminPrevHeroesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // View Details Modal State
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user? All their activities, redeems, and points will also be deleted. This action cannot be undone.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleViewDetails = async (id: number) => {
    setViewModalOpen(true);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/admin/users/${id}`);
      setSelectedUser(res.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load user details");
      setViewModalOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const isPrevHero = (dateString: string) => {
    const createdAt = new Date(dateString);
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);
    return createdAt < sevenMonthsAgo;
  };

  const searchFilteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const prevHeroes = searchFilteredUsers.filter((u) => isPrevHero(u.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Previous Heroes</h1>
          <p className="text-gray-500">View and manage ambassadors from previous terms.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="pl-9 bg-white dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Campus</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Final Points</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {prevHeroes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No previous heroes found.
                    </td>
                  </tr>
                ) : (
                  prevHeroes.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                        {user.phone && <div className="text-gray-500 text-xs flex items-center gap-1 mt-0.5"><span role="img" aria-label="phone">📞</span> {user.phone}</div>}
                        <div className="text-gray-400 text-xs mt-1">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {user.campus || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {user.institutionType || "-"}
                      </td>
                      <td className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">
                        {user.totalPoints}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                          INACTIVE (Prev Hero)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleViewDetails(user.id)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      {viewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-xl font-bold">User Details</h3>
              <button onClick={() => setViewModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {loadingDetails ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
              ) : selectedUser ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold uppercase shrink-0">
                      {selectedUser.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold">{selectedUser.name}</h4>
                      <p className="text-gray-500">{selectedUser.email}</p>
                      {selectedUser.phone && (
                        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                          <span role="img" aria-label="phone">📞</span> {selectedUser.phone}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold uppercase">{selectedUser.role}</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">{selectedUser.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-500 mb-1">Campus/University</p>
                      <p className="font-medium">{selectedUser.campus || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-500 mb-1">Institution Type</p>
                      <p className="font-medium">{selectedUser.institutionType || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-500 mb-1">Department</p>
                      <p className="font-medium">{selectedUser.department || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-500 mb-1">Club Name</p>
                      <p className="font-medium">{selectedUser.clubName || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-500 mb-1">Total Points</p>
                      <p className="font-bold text-indigo-600 text-xl">{selectedUser.totalPoints}</p>
                    </div>
                  </div>

                  {/* Joined Date */}
                  <div className="text-sm text-gray-500">
                    Joined on {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </div>
                  
                  {/* Point Transactions Snippet */}
                  {selectedUser.pointTransactions?.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-bold mb-2 border-b pb-2">Recent Activities</h5>
                      <ul className="space-y-2 text-sm">
                        {selectedUser.pointTransactions.slice(0, 5).map((pt: any) => (
                          <li key={pt.id} className="flex justify-between p-2 bg-gray-50 rounded">
                            <span>{pt.activity?.title || "Activity"}</span>
                            <span className="font-medium text-green-600">+{pt.points}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-red-500">Could not load user details.</p>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
