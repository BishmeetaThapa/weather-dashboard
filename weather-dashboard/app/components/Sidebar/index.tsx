"use client";

import { Home, Sun, CloudRain, Thermometer, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: Home },
    { name: "Current Weather", icon: Sun },
    { name: "Forecast", icon: CloudRain },
    { name: "Temperature Stats", icon: Thermometer },
    { name: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`bg-gradient-to-b from-blue-600 via-blue-500 to-purple-600 h-screen p-5 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section: Logo / Collapse */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-white font-bold text-xl">Weather Dash</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300"
          >
            {collapsed ? <ChevronRight className="text-white" /> : <ChevronLeft className="text-white" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-white/20 transition-all duration-300 text-white font-medium"
              >
                <Icon size={22} />
                {!collapsed && <span>{item.name}</span>}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: User Profile */}
      <div className="flex items-center gap-3 p-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 text-white cursor-pointer">
        <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
          <Sun size={20} />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold">Jane Doe</p>
            <p className="text-xs text-white/70">Weather Enthusiast</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;