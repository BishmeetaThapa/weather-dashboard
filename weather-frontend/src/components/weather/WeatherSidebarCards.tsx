"use client";

import { Card } from "@/components/ui/Card";
import { Activity, Navigation, TrendingUp } from "lucide-react";

interface WeatherSidebarCardsProps {
    weather?: any;
}

export default function WeatherSidebarCards({ weather }: WeatherSidebarCardsProps) {
    if (!weather) {
        return (
            <div className="space-y-4 h-full">
                <Card className="bg-[#1e2330] border-none rounded-[2rem] p-6 text-center shadow-xl h-full flex items-center justify-center">
                    <p className="text-white/60 font-bold">No data available</p>
                </Card>
            </div>
        );
    }

    const pressure = weather.main?.pressure ?? "--";
    const visibility = weather.visibility ? (weather.visibility / 1000).toFixed(0) : "--";

    // Format current time for the sync card if no lastUpdated prop is provided
    const syncTime = new Date().toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit' 
    });

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Atmosphere Card */}
            <Card className="bg-[#1e2330] border-none rounded-[2rem] p-6 shadow-xl flex items-center justify-between flex-1">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-white/50 tracking-[0.2em] mb-1">Atmosphere</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">{pressure}</span>
                        <span className="text-sm font-bold text-white/50">hPa</span>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#2a3143] flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-400" />
                </div>
            </Card>

            {/* Visual Range Card */}
            <Card className="bg-[#1e2330] border-none rounded-[2rem] p-6 shadow-xl flex items-center justify-between flex-1">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-white/50 tracking-[0.2em] mb-1">Visual Range</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">{visibility}</span>
                        <span className="text-sm font-bold text-white/50">km</span>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#2a3143] flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-amber-500" />
                </div>
            </Card>

            {/* Matrix Stability Card */}
            <Card className="bg-[#1e2330] border-none rounded-[2rem] p-6 shadow-xl flex flex-col justify-center flex-1">
                <div className="flex justify-between items-start mb-2">
                    <TrendingUp className="w-5 h-5 text-white/70" />
                    <span className="text-[9px] font-black uppercase text-white/30 tracking-[0.2em]">Analytics</span>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Matrix Stability</h3>
                    <p className="text-[11px] text-white/50 font-medium mt-1">
                        Synchronized at {syncTime}
                    </p>
                </div>
            </Card>
        </div>
    );
}
