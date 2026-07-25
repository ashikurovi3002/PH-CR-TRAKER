"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard } from "lucide-react";
import api from "@/lib/axios";

export function Navber() {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data?.data) {
          setUser(res.data.data);
        }
      } catch (error) {
        // Not logged in, that's fine for the landing page
      }
    };
    fetchUser();
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: "Stats", id: "stats" },
    { name: "Campus Heroes", id: "heroes" },
    { name: "Testimonials", id: "feedbacks" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/40 backdrop-blur-md border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
            <span>PH Campus Hero</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={`#${item.id}`}
              onClick={(e) => handleScroll(e, item.id)}
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {item.name}
            </a>
          ))}

          <a
            href="#register"
            onClick={(e) => handleScroll(e, "register")}
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Register
          </a>

          <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-white/30">
            {user ? (
              <Link
                href={user.role === 'admin' ? '/admin/dashboard' : '/ambassador/dashboard'}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  Sign In
                </Link>
                <a
                  href="#register"
                  onClick={(e) => handleScroll(e, "register")}
                  className="px-4 py-2 rounded-full bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors shadow-sm cursor-pointer"
                >
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-600 hover:text-indigo-600 focus:outline-none p-2 rounded-md hover:bg-white/50 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 shadow-lg absolute w-full left-0 top-16">
          <div className="px-4 pt-2 pb-4 space-y-1 shadow-inner">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={`#${item.id}`}
                onClick={(e) => handleScroll(e, item.id)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                {item.name}
              </a>
            ))}
            <a
              href="#register"
              onClick={(e) => handleScroll(e, "register")}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Register
            </a>

            <div className="pt-4 pb-2 border-t border-slate-200/50 mt-4">
              {user ? (
                <Link
                  href={user.role === 'admin' ? '/admin/dashboard' : '/ambassador/dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
              ) : (
                <div className="flex flex-col space-y-2 px-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center px-4 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors border border-slate-200"
                  >
                    Sign In
                  </Link>
                  <a
                    href="#register"
                    onClick={(e) => handleScroll(e, "register")}
                    className="block text-center px-4 py-2 rounded-md text-base font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-colors shadow-sm"
                  >
                    Get Started
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
