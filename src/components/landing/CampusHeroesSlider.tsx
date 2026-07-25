"use client";

import React, { useEffect, useState, useRef } from "react";
import { Award, User, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/axios";

interface Hero {
  id: number;
  name: string;
  campus: string;
  profileImage: string | null;
  totalPoints: number;
}

export function CampusHeroesSlider() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const res = await api.get("/public/heroes");
        setHeroes(res.data.data || []);
      } catch (error) {
        console.error("Failed to load heroes", error);
      }
    };
    fetchHeroes();
  }, []);

  useEffect(() => {
    if (heroes.length <= 1) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // Check if we reached the end (with a small buffer for precision)
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 324, behavior: "smooth" }); // 300px width + 24px gap
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [heroes.length]);

  if (heroes.length === 0) return null;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section id="heroes" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-0 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 flex items-center gap-3">
              <Award className="w-10 h-10 text-indigo-600" />
              Meet Our Heroes
            </h2>
            <p className="text-slate-600 max-w-2xl text-lg">
              The creative strategists, leaders, and visionaries making an impact across institutions.
            </p>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <button 
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={scrollRight}
              className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Cards Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-12 pt-4 hide-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {heroes.map((hero, idx) => {
            // Highlight the first card as active by default for demo, or based on some condition
            // Since it's a slider, we can apply hover states to make them all interactive.
            return (
              <div 
                key={hero.id} 
                className="group relative flex-none w-[300px] h-[420px] rounded-[2rem] overflow-hidden bg-white dark:bg-gray-800 snap-center cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(244,114,182,0.3)] hover:border-pink-500 border-2 border-transparent shadow-sm"
              >
                {/* Image Section */}
                <div className="absolute inset-0 h-[75%]">
                  {hero.profileImage ? (
                    <img 
                      src={hero.profileImage} 
                      alt={hero.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100" 
                    />
                  ) : (
                    <div className="w-full h-full bg-pink-50 dark:bg-slate-800 flex items-center justify-center">
                      <User className="w-20 h-20 text-pink-200 dark:text-slate-600" />
                    </div>
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-white/20 dark:via-slate-900/40 to-transparent group-hover:from-pink-900 group-hover:via-pink-900/60 transition-colors duration-500"></div>
                  
                  {/* Inner Overlay Content */}
                  <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 z-10">
                    <h4 className="text-white font-bold text-xl uppercase tracking-wider">{hero.name.split(' ')[0]}</h4>
                    <p className="text-pink-200 text-sm mb-3">{hero.campus}</p>
                    <div className="px-4 py-1.5 border border-pink-400/50 rounded-full bg-pink-500/30 backdrop-blur-sm">
                      <span className="text-pink-100 text-xs tracking-widest uppercase">-- {hero.totalPoints} Points --</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-white/10 p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-slate-600 group-hover:bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,0)] group-hover:shadow-[0_0_10px_rgba(244,114,182,0.8)] transition-all"></div>
                    <h3 className="text-gray-900 dark:text-white font-semibold truncate pr-2 text-lg">{hero.name}</h3>
                  </div>
                  <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 pl-5 truncate">{hero.campus}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
