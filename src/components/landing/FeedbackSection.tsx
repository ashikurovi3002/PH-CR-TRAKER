"use client";

import React, { useEffect, useState } from "react";
import { Star, User } from "lucide-react";
import api from "@/lib/axios";

interface Feedback {
  id: number;
  message: string;
  user: {
    name: string;
    campus: string;
    profileImage: string | null;
  };
}

export function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await api.get("/public/feedbacks");
        setFeedbacks(res.data.data || []);
      } catch (error) {
        console.error("Failed to load feedbacks", error);
      }
    };
    fetchFeedbacks();
  }, []);

  if (feedbacks.length === 0) return null;

  return (
    <section id="feedbacks" className="py-24 relative overflow-hidden bg-slate-50 dark:bg-gray-900">
      {/* Background ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-widest uppercase text-sm mb-3">Don't just take our word for it</p>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            What Our Ambassadors Say
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Check out what our dedicated heroes have to say about their experience in the program.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((feedback, idx) => (
            <div 
              key={feedback.id} 
              className="group bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-500/50 transition-all duration-300 flex flex-col hover:shadow-[0_0_25px_rgba(244,114,182,0.2)] relative overflow-hidden"
            >
              {/* Subtle top gradient glow on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-pink-400 text-pink-400" />
                ))}
              </div>
              
              <p className="text-gray-600 dark:text-slate-300 text-base leading-relaxed mb-8 italic flex-1">
                "{feedback.message}"
              </p>
              
              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-pink-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/10">
                  {feedback.user.profileImage ? (
                    <img src={feedback.user.profileImage.startsWith('http') ? feedback.user.profileImage : `http://localhost:5001${feedback.user.profileImage}`} alt={feedback.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-pink-300" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">{feedback.user.name}</h4>
                  <p className="text-sm text-pink-500 font-medium mt-1">{feedback.user.campus}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
