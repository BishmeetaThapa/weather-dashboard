"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    CloudSun,
    CalendarDays,
    Thermometer,
    MapPin,
    Settings,
    LogOut,
    Cloud
} from "lucide-react";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: CloudSun, label: "Current Weather", href: "/current-weather" },
    { icon: CalendarDays, label: "Forecast", href: "/forecast" },
    { icon: Thermometer, label: "Temperature Stats", href: "/temperature-stats" },
    { icon: MapPin, label: "Locations", href: "/locations" },
];

const secondaryItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: LogOut, label: "Logout", href: "/login" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-gray-100 bg-white h-screen flex flex-col fixed left-0 top-0 z-40">
            <div className="p-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Cloud className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-gray-900">SkyCast</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-4 pb-6 space-y-1">
                {secondaryItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        <item.icon className="w-5 h-5 text-gray-400" />
                        {item.label}
                    </Link>
                ))}
            </div>
        </aside>
    );
}
