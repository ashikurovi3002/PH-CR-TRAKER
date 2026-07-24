"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Gift, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function RedeemPage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await api.get('/ambassador/rewards');
        setRewards(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load rewards");
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const handleRedeem = async (rewardId: number) => {
    setSubmitting(rewardId);
    try {
      await api.post('/ambassador/redeems', { rewardId });
      toast.success("Redeem request submitted successfully! 🎉");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading amazing rewards...</p>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 relative">
      {/* Decorative Backgrounds */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-1/2 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/4 pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center justify-center p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl mb-3 shadow-inner border border-indigo-200/50">
            <Gift className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Rewards <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Store</span>
          </h1>
          <p className="text-gray-500 mt-2 text-lg max-w-xl">Exchange your hard-earned points for awesome swag, exclusive benefits, and more.</p>
        </div>
      </motion.div>

      {rewards.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-16 text-center rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10"
        >
          <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-12 h-12 text-indigo-300 dark:text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No rewards available yet</h3>
          <p className="text-gray-500 text-lg max-w-md mx-auto">We're stocking up the store! Check back later for some exciting new items.</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
        >
          {rewards.map((reward) => (
            <motion.div
              key={reward.id}
              variants={item}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col group transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-800"
            >
              <div className="h-52 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 relative overflow-hidden p-4">
                {reward.image ? (
                  <img src={reward.image.startsWith('http') ? reward.image : `http://localhost:5001${reward.image}`} alt={reward.name} className="w-full h-full object-cover rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-300 dark:text-indigo-700 transition-transform duration-500 group-hover:scale-110">
                    <Gift className="w-20 h-20 opacity-50" />
                  </div>
                )}
                
                {/* Floating Points Badge */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-indigo-700 dark:text-indigo-400 px-4 py-1.5 rounded-full text-sm font-black shadow-lg flex items-center gap-1.5 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  {reward.requiredPoints} pts
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{reward.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-3">
                  {reward.description || "An exclusive reward for our amazing ambassadors!"}
                </p>
                
                <Button 
                  onClick={() => handleRedeem(reward.id)}
                  disabled={submitting === reward.id || reward.stock <= 0}
                  className={`w-full rounded-xl h-12 font-bold shadow-md transition-all active:scale-95 ${
                    reward.stock <= 0 
                      ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 hover:bg-gray-100 cursor-not-allowed shadow-none' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 hover:-translate-y-0.5'
                  }`}
                >
                  {submitting === reward.id ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                  ) : reward.stock <= 0 ? (
                    "Out of Stock"
                  ) : (
                    "Redeem Reward"
                  )}
                </Button>
                
                {/* Stock Indicator */}
                <div className="mt-4 text-center">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    reward.stock > 10 
                      ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                      : reward.stock > 0
                      ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {reward.stock > 0 ? `${reward.stock} remaining in stock` : 'Check back later'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
