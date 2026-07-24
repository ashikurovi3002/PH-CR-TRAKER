"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { Trophy, Star, Zap, Gift, Target, ArrowRight } from "lucide-react";

export default function AmbassadorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/ambassador/dashboard");
        setData(response.data.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Ambassador!</span> ✨
          </h1>
          <p className="text-gray-500 mt-2 text-base md:text-lg">Here's what's happening with your activities today.</p>
        </div>
      </motion.div>

      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {/* Total Points */}
        <motion.div variants={item} whileHover={{ y: -5 }} className="relative overflow-hidden p-5 md:p-6 bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Star className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Points</h3>
          </div>
          <p className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white relative z-10">{data?.totalPoints || 0}</p>
        </motion.div>
        
        {/* Current Rank */}
        <motion.div variants={item} whileHover={{ y: -5 }} className="relative overflow-hidden p-5 md:p-6 bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Trophy className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Global Rank</h3>
          </div>
          <p className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white relative z-10">#{data?.rank || '-'}</p>
        </motion.div>

        {/* Activities Completed */}
        <motion.div variants={item} whileHover={{ y: -5 }} className="relative overflow-hidden p-5 md:p-6 bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Zap className="w-5 h-5 md:w-6 md:h-6 fill-current" />
            </div>
            <h3 className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Activities</h3>
          </div>
          <p className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white relative z-10">{data?.totalActivitiesCompleted || 0}</p>
        </motion.div>

        {/* Available Rewards */}
        <motion.div variants={item} whileHover={{ y: -5 }} className="relative overflow-hidden p-5 md:p-6 bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Gift className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rewards</h3>
          </div>
          <p className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white relative z-10">{data?.availableRewards || 0}</p>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4, type: "spring" }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {/* Recent Activities Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-5 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="text-indigo-500 w-5 h-5 md:w-6 md:h-6" /> Recent Activities
            </h2>
            <button className="text-xs md:text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {data?.activities?.length ? data.activities.map((act: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.5 + i * 0.1 }}
                key={act.id} 
                className="group flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4 md:p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800"
              >
                <div className="flex items-start sm:items-center gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors">
                    <Target className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-base md:text-lg group-hover:text-indigo-900 dark:group-hover:text-indigo-300 transition-colors leading-tight">{act.activity?.title || "Activity"}</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">{new Date(act.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="self-end sm:self-auto px-3 py-1.5 md:px-4 md:py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold rounded-full text-xs md:text-sm whitespace-nowrap">
                  +{act.points} pts
                </div>
              </motion.div>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 md:py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                <Target className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mb-3" />
                <p className="text-sm md:text-base text-gray-500 font-medium">No recent activities.</p>
                <p className="text-xs md:text-sm text-gray-400 mt-1">Start completing tasks to earn points!</p>
              </div>
            )}
          </div>
        </div>

        {/* Next Reward Progress */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-6 md:p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400 opacity-20 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                <Gift className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Next Reward Goal</h2>
              <p className="text-indigo-200 text-xs md:text-sm mb-6 md:mb-8 leading-relaxed">You're getting closer to unlocking exclusive ambassador perks!</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-5 md:p-6 rounded-3xl border border-white/20">
               <div className="flex justify-between text-xs md:text-sm font-semibold mb-3">
                 <span>Current: {data?.totalPoints || 0}</span>
                 <span className="text-indigo-200">Goal: 500</span>
               </div>
               <div className="w-full bg-black/20 rounded-full h-2 md:h-3 overflow-hidden p-0.5">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min(((data?.totalPoints || 0) / 500) * 100, 100)}%` }}
                   transition={{ duration: 1.5, delay: 0.8, type: "spring" }}
                   className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                 ></motion.div>
               </div>
               
               <p className="text-center font-medium mt-5 md:mt-6 bg-white/20 py-2 rounded-xl text-xs md:text-sm border border-white/10 shadow-inner">
                 {500 - (data?.totalPoints || 0) > 0 
                   ? `Only ${500 - (data?.totalPoints || 0)} points left!` 
                   : "Goal reached! Time to redeem! 🎉"}
               </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Admin Contact Section */}
      {data?.adminContact && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="bg-indigo-50 dark:bg-indigo-900/10 p-6 md:p-8 rounded-[2rem] border border-indigo-100 dark:border-indigo-800 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Your Admin Contact</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Need help or have questions? Reach out to your admin.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Name</p>
              <p className="font-bold text-gray-900 dark:text-white">{data.adminContact.name || "Admin"}</p>
            </div>
            {(data.adminContact.phone || data.adminContact.email) && (
              <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Contact</p>
                <p className="font-bold text-indigo-600 dark:text-indigo-400">{data.adminContact.phone || data.adminContact.email}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
