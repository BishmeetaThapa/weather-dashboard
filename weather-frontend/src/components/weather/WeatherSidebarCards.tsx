"use client";

import { Activity, Navigation, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";

interface WeatherData {
    main?: {
        pressure: number;
        humidity: number;
    };
    visibility?: number;
    wind?: {
        speed: number;
    };
}

interface WeatherSidebarCardsProps {
    weather: WeatherData;
}

export function WeatherSidebarCards({ weather }: WeatherSidebarCardsProps) {
    return (
        <div className="space-y-6">
            <StatCard
                label="Atmosphere"
                value={weather?.main?.pressure ?? 1013}
                unit="hPa"
                icon={Activity}
                color="blue"
            />
            <StatCard
                label="Visual Range"
                value={(weather?.visibility ?? 10000) / 1000}
                unit="km"
                icon={Navigation}
                color="amber"
            />
            <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl">
                <div className="flex justify-between items-start mb-3">
                    <TrendingUp size={24} className="text-white" />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Analytics</span>
                </div>
                <h4 className="text-lg font-bold">Matrix Stability</h4>
                <p className="text-sm text-white/60">Synchronized at {new Date().toLocaleTimeString()}</p>
            </div>
        </div>
    );
}
