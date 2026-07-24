"use client";

import React, { useEffect, useState } from "react";
import { Users, Activity, Gift, MessageSquare, Image as ImageIcon, Star, Trophy } from "lucide-react";
import api from "@/lib/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
    users: 0, 
    pendingRedeems: 0, 
    totalActivities: 0,
    totalFeedbacks: 0,
    pendingFeedbacks: 0,
    totalBanners: 0,
    leaderboard: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Ambassadors", value: stats.users, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Total Activities", value: stats.totalActivities, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "Pending Redeems", value: stats.pendingRedeems, icon: Gift, color: "text-yellow-600", bg: "bg-yellow-100" },
    { label: "Total Feedback", value: stats.totalFeedbacks, icon: MessageSquare, color: "text-green-600", bg: "bg-green-100" },
    { label: "Pending Feedback", value: stats.pendingFeedbacks, icon: Star, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Total Banners", value: stats.totalBanners, icon: ImageIcon, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((s, idx) => (
          <div key={idx} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-6 transition-transform hover:-translate-y-1">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${s.bg}`}>
              <s.icon className={`w-8 h-8 ${s.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">{s.label}</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Top Ambassadors (Leaderboard)</h2>
        </div>

        {stats.leaderboard && stats.leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-4 font-semibold text-gray-500 text-sm">Rank</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-sm">Ambassador</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-sm">Campus</th>
                  <th className="py-4 px-4 font-semibold text-gray-500 text-sm text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {stats.leaderboard.map((amb: any, idx: number) => (
                  <tr key={amb.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                        idx === 1 ? 'bg-gray-200 text-gray-700' :
                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden shrink-0">
                          {amb.profileImage ? (
                            <img src={amb.profileImage.startsWith('http') ? amb.profileImage : `http://localhost:5001${amb.profileImage}`} alt={amb.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-indigo-600 font-bold">{amb.name.charAt(0)}</span>
                          )}
                        </div>
                        <span className="font-semibold text-gray-900">{amb.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{amb.campus || '-'}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                        {amb.totalPoints}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No ambassadors found on the leaderboard yet.
          </div>
        )}
      </div>
    </div>
  );
}
