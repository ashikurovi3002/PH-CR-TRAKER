"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, List, PlusCircle, MinusCircle, History, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get('/ambassador/activities');
        setActivities(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load activities");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading your history...</p>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 relative">
      {/* Decorative Backgrounds */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-1/2 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/4 pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center justify-center p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl mb-3 shadow-inner border border-indigo-200/50">
            <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Activity <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">History</span>
          </h1>
          <p className="text-gray-500 mt-2 text-lg max-w-xl">Track all your earned and spent points over time in one place.</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 overflow-hidden relative z-10"
      >
        <div className="p-2 sm:p-4">
          <div className="flex flex-col gap-3">
            {activities.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <List className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No activity yet</h3>
                <p className="text-gray-500 mt-2 max-w-sm">Complete your first task or redeem a reward to see it here!</p>
              </div>
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-3"
              >
                {activities.map((act) => {
                  const isEarned = act.points > 0;
                  
                  return (
                    <motion.div
                      key={act.id}
                      variants={item}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300 gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border shadow-inner ${
                          isEarned 
                            ? 'bg-green-50 border-green-100 text-green-600 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400' 
                            : 'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400'
                        }`}>
                          {isEarned ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {act.activity?.title || "Points Update"}
                          </h4>
                          <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md text-xs font-medium">
                              {new Date(act.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span>•</span>
                            <span>{new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`flex items-center justify-end gap-2 font-black text-2xl shrink-0 ${
                        isEarned 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {isEarned ? `+${act.points}` : act.points}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
