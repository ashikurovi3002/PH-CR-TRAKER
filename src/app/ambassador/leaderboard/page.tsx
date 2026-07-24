"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Trophy, Medal, Crown, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalAmbassadors: 0, userRank: null, userPoints: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/ambassador/leaderboard');
        setLeaders(res.data.data.leaders || []);
        setStats({
          totalAmbassadors: res.data.data.totalAmbassadors || 0,
          userRank: res.data.data.userRank,
          userPoints: res.data.data.userPoints || 0
        });
      } catch (err) {
        toast.error("Failed to fetch leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 relative">
      {/* Decorative Backgrounds */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl translate-y-1/4 pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center relative z-10 space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-2 shadow-inner border border-indigo-200/50">
          <Trophy className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Hall of Fame</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-lg mx-auto">See how you rank against other ambassadors and strive for the top spot!</p>
      </motion.div>

      {/* Personal Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Ambassadors</div>
          <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalAmbassadors}</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 border border-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-none flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="text-sm font-semibold text-indigo-200 uppercase tracking-wider mb-1 relative z-10">Your Current Rank</div>
          <div className="text-4xl font-black relative z-10">{stats.userRank ? `#${stats.userRank}` : '-'}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Your Total Points</div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{stats.userPoints}</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 overflow-hidden relative z-10"
      >
        <div className="p-2 sm:p-4">
          <div className="flex flex-col gap-2">
            {leaders.map((leader, index) => {
              const isTop3 = index < 3;
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;

              let cardClasses = "flex items-center p-4 rounded-2xl transition-all duration-300 border ";
              let rankClasses = "w-14 font-black text-xl flex justify-center ";
              let pointsClasses = "text-xl font-bold ";
              let avatarBorder = "";

              if (isFirst) {
                cardClasses += "bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-700/50 shadow-sm scale-[1.02] z-10 my-2";
                rankClasses += "text-indigo-500";
                pointsClasses += "text-indigo-600 dark:text-indigo-400";
                avatarBorder = "border-4 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]";
              } else if (isSecond) {
                cardClasses += "bg-gradient-to-r from-gray-50 to-slate-100 dark:from-gray-800 dark:to-slate-800 border-gray-200 dark:border-gray-600 shadow-sm";
                rankClasses += "text-gray-400";
                pointsClasses += "text-gray-600 dark:text-gray-300";
                avatarBorder = "border-2 border-gray-300";
              } else if (isThird) {
                cardClasses += "bg-gradient-to-r from-indigo-50/50 to-slate-50/50 dark:from-indigo-900/10 dark:to-slate-900/10 border-indigo-200/50 dark:border-indigo-700/30 shadow-sm";
                rankClasses += "text-indigo-400";
                pointsClasses += "text-indigo-500 dark:text-indigo-400";
                avatarBorder = "border-2 border-indigo-300/50";
              } else {
                cardClasses += "bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-100";
                rankClasses += "text-gray-400 text-lg";
                pointsClasses += "text-gray-700 dark:text-gray-300";
                avatarBorder = "border border-gray-100 dark:border-gray-700";
              }

              return (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={cardClasses}
                >
                  <div className={rankClasses}>
                    {isFirst && <Crown className="w-8 h-8 text-indigo-500 drop-shadow-md" />}
                    {isSecond && <Medal className="w-7 h-7 text-gray-400 drop-shadow-md" />}
                    {isThird && <Medal className="w-7 h-7 text-indigo-400 drop-shadow-md" />}
                    {!isTop3 && `#${index + 1}`}
                  </div>

                  <div className={`w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 flex items-center justify-center font-bold text-xl mx-4 shrink-0 overflow-hidden relative ${avatarBorder}`}>
                    {leader.profileImage ? (
                      <img src={leader.profileImage.startsWith('http') ? leader.profileImage : `http://localhost:5001${leader.profileImage}`} alt={leader.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{leader.name.charAt(0)}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold truncate text-lg ${isFirst ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                      {leader.name} {isFirst && <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Top #1</span>}
                    </h3>
                    <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                      {leader.campus || "No Campus"}
                    </p>
                  </div>

                  <div className="text-right ml-4 px-4 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-2">
                    <Star className={`w-4 h-4 ${isTop3 ? 'text-indigo-500 fill-indigo-500' : 'text-gray-400'}`} />
                    <div>
                      <div className={pointsClasses}>{leader.totalPoints}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {leaders.length === 0 && (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Trophy className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">No one has scored yet</h3>
                <p className="text-gray-500 mt-1 max-w-sm">Complete your first activity to claim the number one spot on the leaderboard!</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
