"use client";

import React, { useState, useEffect } from "react";
import { SignUpForm } from "@/components/auth/signup";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

interface Banner {
  id: number;
  image: string;
  title: string;
}

export default function RegisterPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get('/public/banners');
        setBanners(res.data.data || []);
      } catch (error) {
        console.error("Failed to load banners", error);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left Column: Banner Slider */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        {banners.length > 0 ? (
          <>
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
                <img 
                  src={banner.image.startsWith('http') ? banner.image : `http://localhost:5001${banner.image}`} 
                  alt={banner.title}
                  className="w-full h-full object-cover scale-105 transform animate-slow-pan"
                />
                <div className="absolute bottom-24 left-12 right-12 z-20 text-white animate-in slide-in-from-bottom-8 duration-700">
                  <h2 className="text-4xl font-extrabold mb-4 leading-tight">{banner.title}</h2>
                </div>
              </div>
            ))}
            
            {/* Slide Indicators */}
            <div className="absolute bottom-12 left-12 z-20 flex gap-2">
              {banners.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "w-8 bg-indigo-500" : "w-4 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-white z-10 p-12">
            <h1 className="text-5xl font-extrabold mb-6">Become a Campus Hero</h1>
            <p className="text-xl text-indigo-200 text-center">Join our exclusive ambassador program and lead initiatives on your campus while earning rewards.</p>
          </div>
        )}

        {/* Ambient background fallback */}
        {!banners.length && (
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px]"></div>
          </div>
        )}
      </div>

      {/* Right Column: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-2xl relative">
          
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-indigo-100 dark:shadow-none border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Create Account</h2>
              <p className="text-gray-500 dark:text-gray-400">Join the Campus Ambassador program</p>
            </div>

            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
