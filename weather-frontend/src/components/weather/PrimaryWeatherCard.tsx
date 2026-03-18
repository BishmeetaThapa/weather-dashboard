"use client";

import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherData {
    _id?: string;
    city: string;
    country: string;
    main?: {
        temp: number;
        humidity: number;
    };
    weather?: Array<{
        main: string;
        description: string;
    }>;
    wind?: {
        speed: number;
    };
}

interface PrimaryWeatherCardProps {
    weather: WeatherData;
}

export function PrimaryWeatherCard({ weather }: PrimaryWeatherCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 text-white/60 mb-2">
                        <MapPin size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{weather.city}, {weather.country}</span>
                    </div>
                    <h3 className="text-5xl font-bold">{weather.city}</h3>
                    <p className="text-white/60">{weather?.weather?.[0]?.description ?? "No description"}</p>
                </div>
                <div className="text-right">
                    <span className="px-3 py-1 bg-white/20 text-[10px] font-black uppercase tracking-widest border border-white/20 rounded-full">Active</span>
                </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="flex items-center gap-6">
                    <span className="text-6xl font-black">{Math.round(weather?.main?.temp ?? 0)}°</span>
                    <div>
                        <p className="text-2xl font-bold">{weather?.weather?.[0]?.main ?? "N/A"}</p>
                        <p className="text-white/60 italic">{weather?.weather?.[0]?.description ?? "No description"}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6 min-w-[240px]">
                    <div>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Humidity</p>
                        <p className="text-xl font-bold">{weather?.main?.humidity ?? 0}%</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Wind Speed</p>
                        <p className="text-xl font-bold">{weather?.wind?.speed ?? 0} km/h</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
