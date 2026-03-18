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
    Radar
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
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white/5 backdrop-blur-2xl border-r border-white/10 h-screen flex flex-col fixed left-0 top-0 z-40">
            <div className="p-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="bg-primary/30 p-1.5 rounded-lg shadow-lg shadow-primary/30">
                        <Radar className="text-primary-foreground w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-white/90">Weather</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-6">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-white/10 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-sky-400" : "text-white/60")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-4 pb-6 mt-auto space-y-2">
                {secondaryItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-all duration-200"
                    >
                        <item.icon className="w-5 h-5 text-white/60" />
                        {item.label}
                    </Link>
                ))}
            </div>
        </aside>
    );
}