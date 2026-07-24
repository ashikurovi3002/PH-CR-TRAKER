"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";

interface Banner {
  id: number;
  title: string;
  image: string;
  order: number;
}

export function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/public/banners");
        setBanners(res.data.data || []);
      } catch (error) {
        console.error("Failed to load banners", error);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden bg-slate-900 mt-16">
      <AnimatePresence initial={false} custom={currentIndex}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={banners[currentIndex].image}
            alt={banners[currentIndex].title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end justify-center pb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center px-4">
              {banners[currentIndex].title}
            </h2>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentIndex ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
