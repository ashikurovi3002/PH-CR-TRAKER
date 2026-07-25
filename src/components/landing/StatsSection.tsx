"use client";

import React, { useEffect, useState, useRef } from "react";
import { Users, Target, Building, Gift } from "lucide-react";
import { animate, useInView } from "framer-motion";
import api from "@/lib/axios";

// Helper component for animating the numbers
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && ref.current) {
      animate(0, value, {
        duration: 2, // 2 seconds animation
        ease: "easeOut",
        onUpdate: (latest) => {
          if (ref.current) {
            ref.current.textContent = Math.floor(latest).toLocaleString();
          }
        },
      });
    }
  }, [value, isInView]);

  return <span ref={ref}>0</span>;
}

export function StatsSection() {
  const [stats, setStats] = useState({
    totalAmbassadors: 0,
    totalPoints: 0,
    totalInstitutions: 0,
    totalRedeems: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/public/stats");
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    { title: "Active Ambassadors", value: stats.totalAmbassadors, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Points Earned", value: stats.totalPoints, icon: Target, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Institutions Covered", value: stats.totalInstitutions, icon: Building, color: "text-green-600", bg: "bg-green-100" },
    { title: "Rewards Redeemed", value: stats.totalRedeems, icon: Gift, color: "text-pink-600", bg: "bg-pink-100" },
  ];

  return (
    <section id="stats" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Impact</h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">See how our ambassadors are making a difference across different campuses and earning rewards for their hard work.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${item.bg} mb-4`}>
                  <Icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                  <Counter value={item.value} />
                </h3>
                <p className="text-gray-500 font-medium text-center">{item.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
