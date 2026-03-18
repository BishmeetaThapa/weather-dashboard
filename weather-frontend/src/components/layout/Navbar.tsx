"use client";

import Link from "next/link";
import { User, Bell, Settings } from "lucide-react";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="h-20 border-b border-white/20 bg-gray-800/30 backdrop-blur-xl sticky top-0 z-30 px-8 flex items-center justify-between shadow-sm">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-white/10 transition">
          <Bell className="w-5 h-5 text-white/80" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-gray-800" />
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-3 p-1.5 pr-3 rounded-xl border border-white/20 hover:bg-white/10 transition-all">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-white/80 leading-none">Account</p>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Observer Mode</p>
          </div>
        </button>

        {/* Settings Link */}
        <Link href="/settings" className="p-2 rounded-xl hover:bg-white/10 transition">
          <Settings className="w-5 h-5 text-white/80" />
        </Link>
      </div>
    </header>
  );
}