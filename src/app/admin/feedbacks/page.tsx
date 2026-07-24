"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, MessageSquare, Check, X, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  name: string;
  email: string;
  institutionType?: string;
  campus?: string;
}

interface Feedback {
  id: number;
  userId: number;
  message: string;
  status: string;
  createdAt: string;
  user: User;
}

export default function AdminFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      const res = await api.get('/admin/feedbacks');
      setFeedbacks(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/admin/feedbacks/${id}`, { status });
      toast.success(`Feedback ${status.toLowerCase()} successfully`);
      fetchFeedbacks();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSaveEdit = async (id: number) => {
    if (!editMessage.trim()) return toast.error("Message cannot be empty");
    setSubmitting(true);
    try {
      await api.patch(`/admin/feedbacks/${id}`, { message: editMessage });
      toast.success("Feedback updated successfully");
      setEditingId(null);
      fetchFeedbacks();
    } catch (error) {
      toast.error("Failed to update feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ambassador Feedbacks</h1>
          <p className="text-gray-500">Review, approve, and manage feedback from ambassadors.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No feedback found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 font-medium w-1/4">User Info</th>
                  <th className="px-6 py-4 font-medium w-1/2">Message</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {feedbacks.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium text-gray-900 dark:text-white">{f.user.name}</div>
                      <div className="text-gray-500 text-xs">{f.user.email}</div>
                      <div className="text-gray-400 text-xs mt-1">{f.user.institutionType} • {f.user.campus}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      {editingId === f.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                            className="w-full h-24 rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                            <Button size="sm" onClick={() => handleSaveEdit(f.id)} disabled={submitting}>
                              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{f.message}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        f.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        f.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      {editingId !== f.id && (
                        <div className="flex flex-col gap-2 items-end">
                          <div className="flex gap-2">
                            {f.status !== 'APPROVED' && (
                              <Button size="sm" variant="outline" className="h-8 text-green-600 hover:text-green-700" onClick={() => handleUpdateStatus(f.id, "APPROVED")}>
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            {f.status !== 'REJECTED' && (
                              <Button size="sm" variant="outline" className="h-8 text-red-600 hover:text-red-700" onClick={() => handleUpdateStatus(f.id, "REJECTED")}>
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 text-indigo-600 hover:text-indigo-700" onClick={() => {
                            setEditingId(f.id);
                            setEditMessage(f.message);
                          }}>
                            <Edit3 className="w-4 h-4 mr-1" /> Edit
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
