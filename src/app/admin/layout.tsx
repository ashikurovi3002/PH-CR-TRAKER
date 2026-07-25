"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutDashboard, Users, Activity, Gift, LogOut, Loader2, Calculator, ShoppingBag, MessageSquare, Search, ChevronsUpDown, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Ambassador", href: "/admin/users", icon: Users },
  { name: "Prev Heroes", href: "/admin/prev-heroes", icon: Users },
  { name: "Activities", href: "/admin/activities", icon: Activity },
  { name: "Grant Points", href: "/admin/points/distribute", icon: Calculator },
  { name: "Redeems & Rewards", href: "/admin/redeems", icon: Gift },
  { name: "Feedbacks", href: "/admin/feedbacks", icon: MessageSquare },
  { name: "Shop", href: "/admin/shop", icon: ShoppingBag },
  { name: "Profile", href: "/admin/profile", icon: Users },
  { name: "Banners", href: "/admin/banners", icon: ImageIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple check if admin
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");
    if (!token || role !== "admin") {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 gap-3">
          <img src="/logo.png" alt="Logo" className=" rounded-md" />

        </div>
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
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut className="w-5 h-5" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto py-4 px-4 md:p-8 pb-24 md:pb-8">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 z-50 px-2 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <nav className="flex justify-around items-center">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex flex-col items-center justify-center p-2 min-w-[3.5rem] rounded-xl transition-all duration-300 ${isActive
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                    : "text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                >
                  <Icon className={`w-5 h-5 mb-1 ${isActive ? "scale-110 drop-shadow-sm" : ""}`} />
                  <span className={`text-[10px] font-medium leading-none ${isActive ? "font-bold" : ""}`}>
                    {link.name.split(" ")[0]}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </main>
    </div>
  );
}
