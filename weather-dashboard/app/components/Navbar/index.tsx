"use client";

import { Search, Bell, User, CloudSun, MapPin } from "lucide-react";

const Navbar = ({ city, setCity, onSearch }) => {
  return (
    <nav className="w-full h-20 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 flex items-center justify-between px-8 shadow-lg relative overflow-hidden">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full flex items-center justify-between">
        {/* Left: Logo & App Name */}
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl shadow-lg hover:bg-white/30 transition-all duration-300">
            <CloudSun className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Weather Dashboard
            </h1>
            <p className="text-xs text-white/80 flex items-center gap-1">
              <MapPin size={12} />
              Real-time weather updates
            </p>
          </div>
        </div>

        {/* Center: Enhanced Search Bar */}
        <div className="flex items-center bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3 w-[400px] shadow-lg border border-white/30 hover:bg-white/25 transition-all duration-300">
          <Search size={20} className="text-white/90" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Search for a city..."
            className="bg-transparent outline-none px-3 text-white placeholder-white/70 text-sm w-full font-medium"
          />
          <button
            onClick={onSearch}
            className="bg-white/30 hover:bg-white/40 text-white px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Search
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl cursor-pointer hover:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg">
              <Bell className="text-white" size={22} />
            </div>
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
              4
            </span>
          </div>

          <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl cursor-pointer hover:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg">
            <User className="text-white" size={22} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;