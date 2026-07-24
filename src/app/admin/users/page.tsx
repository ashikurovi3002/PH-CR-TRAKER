"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Search, Check, X, Plus, UserPlus, Eye, Trash2, Building2, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Add User Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [campus, setCampus] = useState("");
  const [institutionType, setInstitutionType] = useState("POLYTECHNIC");
  const [submitting, setSubmitting] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

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

  const handleUpdateStatus = async (userId: number, newStatus: string) => {
    try {
      await api.patch(`/admin/users/${userId}`, { status: newStatus });
      toast.success(`User status updated to ${newStatus}`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error("Name, Email, and Password are required");
    
    setSubmitting(true);
    try {
      let profileImageUrl = "";

      // 1. Upload image if provided
      if (profileImageFile) {
        const formData = new FormData();
        formData.append("file", profileImageFile);
        const uploadRes = await api.post('/upload/single', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        profileImageUrl = uploadRes.data.data.url;
      }

      // 2. Create the user
      await api.post('/admin/users', {
        name,
        email,
        phone,
        password,
        campus,
        role: "ambassador",
        institutionType,
        status: "ACTIVE", // Auto approve when admin creates
        profileImage: profileImageUrl || undefined
      });
      
      toast.success("User added successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setCampus("");
      setProfileImageFile(null);
      
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add user");
    } finally {
      setSubmitting(false);
    }
  };

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

  const activeUsers = searchFilteredUsers.filter((u) => !isPrevHero(u.createdAt));

  return (
    <div className="space-y-10">
      
      {/* SECTION 1: ADD USER FORM */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Ambassadors</h1>
            <p className="text-gray-500">Manage your ambassadors or manually register new ones.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm max-w-4xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600" /> Manually Add Ambassador
          </h2>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <Input
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <Input
                type="email"
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <Input
                type="tel"
                placeholder="e.g. 017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <Input
                type="text"
                placeholder="Initial password for the user"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Campus/University</label>
              <Input
                type="text"
                placeholder="e.g. Dhaka University"
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Profile Picture (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Institution Type</label>
              <select
                value={institutionType}
                onChange={(e) => setInstitutionType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="POLYTECHNIC">Polytechnic</option>
                <option value="UNIVERSITY">University</option>
              </select>
            </div>
            <div className="md:col-span-2 pt-2">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Register Ambassador"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* SECTION 2: ACTIVE USERS LIST */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold tracking-tight">Active Ambassadors</h2>
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
                    <th className="px-6 py-4 font-medium">Points</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {activeUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No active ambassadors found.
                      </td>
                    </tr>
                  ) : (
                    activeUsers.map((user) => (
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === "ACTIVE" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                            user.status === "BLOCKED" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleViewDetails(user.id)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {user.status !== "ACTIVE" && (
                              <Button size="sm" variant="outline" className="h-8 text-green-600 hover:text-green-700" onClick={() => handleUpdateStatus(user.id, "ACTIVE")}>
                                <Check className="w-4 h-4 mr-1" /> Approve
                              </Button>
                            )}
                            {user.status !== "BLOCKED" && (
                              <Button size="sm" variant="outline" className="h-8 text-yellow-600 hover:text-yellow-700" onClick={() => handleUpdateStatus(user.id, "BLOCKED")}>
                                <X className="w-4 h-4 mr-1" /> Block
                              </Button>
                            )}
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
      </section>



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
