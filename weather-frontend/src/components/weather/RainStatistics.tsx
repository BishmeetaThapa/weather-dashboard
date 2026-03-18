"use client";

import { CloudRain, Wind, Droplets, Thermometer, Sun, Cloud, CloudLightning, Snowflake, CloudFog, Eye, Gauge } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherData {
    temperature: number;
    feels_like: number;
    temp_max: number;
    temp_min: number;
    humidity: number;
    pressure: number;
    wind: {
        speed: number;
        deg?: number;
    };
    clouds: {
        all: number;
    };
    visibility: number;
    condition: string;
    description: string;
    uvIndex: number;
}

interface HourlyForecast {
    time: string;
    temp: number;
    condition: string;
    icon: string;
}

interface DailyForecast {
    day: string;
    temp_max: number;
    temp_min: number;
    condition: string;
}

interface RainStatisticsProps {
    weather: WeatherData;
    hourly?: HourlyForecast[];
    daily?: DailyForecast[];
}

const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("clear") || c.includes("sunny")) return Sun;
    if (c.includes("cloud")) return Cloud;
    if (c.includes("rain") || c.includes("drizzle")) return CloudRain;
    if (c.includes("thunder")) return CloudLightning;
    if (c.includes("snow")) return Snowflake;
    if (c.includes("fog") || c.includes("mist")) return CloudFog;
    return Cloud;
};

export function RainStatistics({ weather, hourly = [], daily = [] }: RainStatisticsProps) {
    const WeatherIcon = getWeatherIcon(weather.condition);

    // Calculate precipitation chance based on humidity and cloud cover
    const precipChance = Math.min(100, Math.round((weather.humidity * 0.6) + (weather.clouds.all * 0.4)));

    return (
        <div className="space-y-8">
            {/* Current Conditions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8"
            >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-primary/20 rounded-3xl">
                            <WeatherIcon size={48} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-white/60 text-sm font-medium">Current Conditions</p>
                            <h3 className="text-5xl font-black text-white">{Math.round(weather.temperature)}°</h3>
                            <p className="text-white/60 font-medium">{weather.description}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-white/5 rounded-2xl">
                            <Droplets size={20} className="text-blue-400 mx-auto mb-2" />
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Humidity</p>
                            <p className="text-xl font-bold text-white">{weather.humidity}%</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-2xl">
                            <Wind size={20} className="text-sky-300 mx-auto mb-2" />
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Wind</p>
                            <p className="text-xl font-bold text-white">{weather.wind.speed} km/h</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-2xl">
                            <Eye size={20} className="text-emerald-400 mx-auto mb-2" />
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Visibility</p>
                            <p className="text-xl font-bold text-white">{(weather.visibility / 1000).toFixed(1)} km</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-2xl">
                            <Thermometer size={20} className="text-orange-400 mx-auto mb-2" />
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Feels Like</p>
                            <p className="text-xl font-bold text-white">{Math.round(weather.feels_like)}°</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Hourly Forecast - Using Real API Data */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-white uppercase tracking-wider">Hourly Forecast</h3>
                    <div className="flex items-center gap-2 text-white/40">
                        <CloudRain size={16} />
                        <span className="text-xs font-medium">Precipitation</span>
                    </div>
                </div>

                {hourly.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {hourly.slice(0, 24).map((hour, idx) => {
                            const HourIcon = getWeatherIcon(hour.condition);
                            return (
                                <div
                                    key={idx}
                                    className={`flex-shrink-0 w-20 p-4 rounded-2xl text-center transition-all hover:bg-white/10 ${idx === 0 ? 'bg-primary/20 border border-primary/30' : 'bg-white/5'}`}
                                >
                                    <p className="text-[10px] text-white/50 font-bold mb-2">{hour.time}</p>
                                    <HourIcon size={24} className="mx-auto mb-2 text-white/80" />
                                    <p className="text-lg font-black text-white">{Math.round(hour.temp)}°</p>
                                    <div className="mt-2 flex items-center justify-center gap-1">
                                        <CloudRain size={10} className={precipChance > 30 ? "text-blue-400" : "text-white/20"} />
                                        <span className="text-[10px] text-white/50">{precipChance}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-white/40 text-center py-4">No hourly data available</p>
                )}
            </motion.div>

            {/* Daily Forecast & Rain Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Forecast - Using Real API Data */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8"
                >
                    <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6">7-Day Forecast</h3>

                    {daily.length > 0 ? (
                        <div className="space-y-4">
                            {daily.map((day, idx) => {
                                const DayIcon = getWeatherIcon(day.condition);
                                return (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                                        <div className="flex items-center gap-4">
                                            <span className={`text-sm font-bold w-20 ${idx === 0 ? 'text-primary' : 'text-white/60'}`}>{day.day}</span>
                                            <DayIcon size={20} className="text-white/60" />
                                            <div className="flex items-center gap-2">
                                                <CloudRain size={12} className={precipChance > 30 ? "text-blue-400" : "text-white/20"} />
                                                <span className="text-xs text-white/50">{precipChance}%</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-white/40 text-sm">{day.temp_min}°</span>
                                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"
                                                    style={{
                                                        marginLeft: `${((day.temp_min - 10) / 30) * 100}%`,
                                                        width: `${((day.temp_max - day.temp_min) / 30) * 100}%`
                                                    }}
                                                />
                                            </div>
                                            <span className="text-white text-sm font-bold">{day.temp_max}°</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-white/40 text-center py-4">No daily data available</p>
                    )}
                </motion.div>

                {/* Rain Statistics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8"
                >
                    <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6">Rain & Air Quality</h3>

                    <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl border border-blue-500/20">
                            <div className="flex items-center gap-4 mb-4">
                                <CloudRain size={24} className="text-blue-400" />
                                <div>
                                    <p className="text-white/60 text-sm">Precipitation Chance</p>
                                    <p className="text-3xl font-black text-white">{precipChance}%</p>
                                </div>
                            </div>
                            <p className="text-white/50 text-xs">Based on humidity and cloud cover</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-white/5 rounded-2xl">
                                <Droplets size={20} className="text-blue-400 mb-2" />
                                <p className="text-white/60 text-xs mb-1">Humidity</p>
                                <p className="text-2xl font-bold text-white">{weather.humidity}%</p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl">
                                <Gauge size={20} className="text-purple-400 mb-2" />
                                <p className="text-white/60 text-xs mb-1">Pressure</p>
                                <p className="text-2xl font-bold text-white">{weather.pressure} hPa</p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl">
                                <Cloud size={20} className="text-white/60 mb-2" />
                                <p className="text-white/60 text-xs mb-1">Cloud Cover</p>
                                <p className="text-2xl font-bold text-white">{weather.clouds.all}%</p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl">
                                <Wind size={20} className="text-sky-300 mb-2" />
                                <p className="text-white/60 text-xs mb-1">Wind Speed</p>
                                <p className="text-2xl font-bold text-white">{weather.wind.speed} km/h</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
