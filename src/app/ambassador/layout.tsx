"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutDashboard, Gift, Trophy, List, LogOut, Loader2, User as UserIcon, MessageSquare, Search, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

const sidebarLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/ambassador/dashboard", icon: LayoutDashboard },

  { name: "Leaderboard", href: "/ambassador/leaderboard", icon: Trophy },
  { name: "Redeem Rewards", href: "/ambassador/redeem", icon: Gift },
  { name: "Activities", href: "/ambassador/activities", icon: List },
  { name: "Feedback", href: "/ambassador/feedback", icon: MessageSquare },
  { name: "Profile", href: "/ambassador/profile", icon: UserIcon },
];

export default function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showInactiveModal, setShowInactiveModal] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        if (!token || role !== "ambassador") {
          throw new Error("Unauthorized");
        }
        const res = await api.get("/auth/me");
        const userData = res.data.data;
        setUser(userData);

        if (userData.status !== "ACTIVE") {
          timeoutId = setTimeout(() => {
            setShowInactiveModal(true);
          }, 10000);
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 gap-3">
          <img src="/logo.png" alt="Logo" className=" rounded-md" />

        </div>

        {user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 text-center">
            {user.profileImage ? (
              <img src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5001${user.profileImage}`} alt={user.name} className="w-16 h-16 mx-auto rounded-full object-cover mb-2 border-2 border-indigo-100" />
            ) : (
              <div className="w-16 h-16 mx-auto bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl mb-2">
                {user.name.charAt(0)}
              </div>
            )}
            <h3 className="font-semibold text-gray-800 dark:text-white">{user.name}</h3>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-800 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
              <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
                {user.totalPoints} Points
              </span>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${isActive
                  ? "bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/20"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile header */}
        <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:hidden sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-[150px] rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-800 shadow-sm">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                  {user.totalPoints} pts
                </span>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto py-4 px-0 md:p-8 pb-24 md:pb-8">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
          <nav className="flex justify-between items-center px-2 relative h-16">
            {[
              { name: "Dashboard", href: "/ambassador/dashboard", icon: LayoutDashboard },
              { name: "Leaderboard", href: "/ambassador/leaderboard", icon: Trophy },
              { name: "Profile", href: "/ambassador/profile", icon: UserIcon },
              { name: "Redeem", href: "/ambassador/redeem", icon: Gift },
              { name: "Activities", href: "/ambassador/activities", icon: List }
            ].map((link, index) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);

              // Profile button (Middle FAB)
              if (link.name === "Profile") {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative -top-5 flex flex-col items-center justify-center"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white dark:border-gray-900 transition-transform duration-300 ${isActive
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/40 scale-105"
                      : "bg-gray-800 dark:bg-gray-700 hover:bg-gray-700"
                      }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold mt-1 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}`}>
                      Profile
                    </span>
                  </Link>
                );
              }

              // Other buttons
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 ${isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                    }`}
                >
                  <Icon className={`w-5 h-5 mb-1 transition-transform duration-300 ${isActive ? "scale-110 drop-shadow-md" : ""}`} />
                  <span className={`text-[10px] tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </main>

      {/* Inactive Account Modal */}
      {showInactiveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowInactiveModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Account Not Active</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Your ambassador account is currently <span className="font-semibold text-gray-900 dark:text-gray-200">Pending</span>. Please contact the administrator to activate your account and start earning points.
            </p>
            <a 
              href="mailto:web@programming-hero.com"
              className="w-full inline-flex justify-center items-center py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
            >
              Contact Administrator
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
