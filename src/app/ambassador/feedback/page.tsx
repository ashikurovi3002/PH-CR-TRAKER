"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, MessageSquare, Send, Star, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Feedback {
  id: number;
  message: string;
  rating?: number;
  status: string;
  createdAt: string;
}

export default function AmbassadorFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      const res = await api.get('/ambassador/feedback');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return toast.error("Message cannot be empty");

    setSubmitting(true);
    try {
      await api.post('/ambassador/feedback', { message, rating });
      toast.success("Feedback submitted successfully! 🎉");
      setMessage("");
      setRating(0);
      fetchFeedbacks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading feedback history...</p>
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
            <MessageSquareQuote className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Share <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Feedback</span>
          </h1>
          <p className="text-gray-500 mt-2 text-base md:text-lg max-w-xl">Rate your experience and share your thoughts to help us improve.</p>
        </div>
      </motion.div>

      {/* Submit Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-2xl md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 overflow-hidden relative z-10 p-5 md:p-8"
      >
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" /> Submit New Feedback
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">How would you rate your experience?</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating) 
                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
                        : 'text-gray-300 dark:text-gray-600'
                    } transition-colors duration-200`} 
                  />
                </button>
              ))}
              <span className="ml-3 text-sm font-medium text-gray-500">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Great"}
                {rating === 5 && "Excellent!"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your comments</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-shadow text-gray-900 dark:text-gray-100"
              placeholder="Tell us what you liked or how we can improve..."
              required
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={submitting || (rating === 0 && message.length < 5)} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
            >
              {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
              Submit Feedback
            </Button>
          </div>
        </form>
      </motion.div>

      {/* History */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 overflow-hidden relative z-10 p-6 md:p-8"
      >
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Your Feedback History</h2>
        
        {feedbacks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquareQuote className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">You haven't submitted any feedback yet.</p>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((f) => (
              <motion.div 
                key={f.id} 
                variants={item}
                className="p-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {new Date(f.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {f.rating && (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-3.5 h-3.5 ${star <= f.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    f.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' :
                    f.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400' :
                    'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400'
                  }`}>
                    {f.status}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  "{f.message}"
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
