"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, MapPin } from "lucide-react";

interface PrimaryWeatherCardProps {
    weather?: any;
}

export default function PrimaryWeatherCard({ weather }: PrimaryWeatherCardProps) {
    if (!weather) {
        return (
            <Card className="bg-gray-800/20 backdrop-blur-xl border border-gray-700/40 rounded-3xl shadow-lg">
                <CardContent className="p-8 text-center">
                    <p className="text-white/60 font-bold">No weather data available</p>
                </CardContent>
            </Card>
        );
    }

    const city = weather.city || "Unknown Location";
    const country = weather.country || "NP";
    const temperature = weather.main?.temp ?? "--";
    const humidity = weather.main?.humidity ?? "--";
    const windSpeed = weather.wind?.speed ?? "--";
    const weatherCondition = weather.weather?.[0]?.main || "Clear";
    const weatherDesc = weather.weather?.[0]?.description || "Clear sky";
    const iconCode = weather.weather?.[0]?.icon || "01d";

    return (
        <Card className="bg-[#1e2330] border-none rounded-[2rem] shadow-xl overflow-hidden relative h-full flex flex-col justify-between p-8">
            <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                {/* Top Section */}
                <div className="flex justify-between items-start">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase font-black tracking-[0.2em]">
                            <MapPin className="w-3 h-3" />
                            {city}, {country}
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white">{city}</h2>
                            <p className="text-sm font-medium text-white/60 capitalize mt-1">{weatherDesc}</p>
                        </div>
                    </div>

                    <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black tracking-widest uppercase text-white">
                        Active
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4">
                        <div className="text-6xl md:text-7xl font-black text-white tracking-tighter">
                            {typeof temperature === 'number' ? Math.round(temperature) : temperature}°
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-white tracking-wide">{weatherCondition}</span>
                            <span className="text-sm italic text-white/60 capitalize">{weatherDesc}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 md:gap-12">
                        <div className="flex flex-col text-left">
                            <span className="text-[9px] font-black uppercase text-white/50 tracking-widest mb-1">Humidity</span>
                            <span className="text-lg font-bold text-white">{humidity}%</span>
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[9px] font-black uppercase text-white/50 tracking-widest mb-1">Wind Speed</span>
                            <span className="text-lg font-bold text-white">{windSpeed} km/h</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
