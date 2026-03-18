"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Cloud, Sun, CloudRain, Wind } from "lucide-react";
import axios from "axios";

export function WeatherAdminPanel({ onDataAdded }: { onDataAdded: () => void }) {
    const [city, setCity] = useState("Kathmandu");
    const [weatherCondition, setWeatherCondition] = useState("Clear");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const weatherConditions = [
        { value: "Clear", label: "Clear Sky", icon: "01d" },
        { value: "Clouds", label: "Cloudy", icon: "04d" },
        { value: "Rain", label: "Rainy", icon: "10d" },
        { value: "Drizzle", label: "Drizzle", icon: "09d" },
        { value: "Thunderstorm", label: "Thunderstorm", icon: "11d" },
        { value: "Snow", label: "Snow", icon: "13d" },
        { value: "Mist", label: "Mist", icon: "50d" },
        { value: "Fog", label: "Fog", icon: "50d" },
    ];

    const handleSeedData = async () => {
        setLoading(true);
        setMessage("");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const selectedWeather = weatherConditions.find(w => w.value === weatherCondition) || weatherConditions[0];

        try {
            // Seed Current Weather
            await axios.post(`${baseUrl}/api/weather`, {
                city: city,
                country: "NP",
                coordinates: { lat: 27.7172, lon: 85.324 },
                weather: [{ id: 800, main: weatherCondition, description: selectedWeather.label, icon: selectedWeather.icon }],
                base: "stations",
                main: {
                    temp: 22,
                    feels_like: 24,
                    temp_min: 20,
                    temp_max: 25,
                    pressure: 1015,
                    humidity: 45,
                },
                visibility: 10000,
                wind: { speed: 5.5, deg: 120 },
                clouds: { all: 10 },
                dt: Math.floor(Date.now() / 1000),
                sys: { country: "NP", sunrise: 1629852000, sunset: 1629900000 },
                timezone: 20700,
                id: 1283240,
                cod: 200,
            });

            // Seed Forecast Data (Simple 7 day mock for DB)
            const forecastList = Array.from({ length: 7 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                return {
                    city: city,
                    date: date,
                    temperature: 20 + Math.random() * 5, // Random temp between 20-25
                    weather: weatherCondition,
                    description: selectedWeather.label,
                    icon: selectedWeather.icon,
                };
            });

            for (const day of forecastList) {
                await axios.post(`${baseUrl}/api/forecast`, day);
            }

            // Note: Hourly forecast is now automatically fetched from OpenWeatherMap by the backend

            setMessage("✅ Data Synchronized Successfully!");
            onDataAdded();
        } catch (error: unknown) {
            console.error(error);
            const errorMessage = error instanceof Error ? "❌ System Synchronization Failed: " + error.message : "❌ System Synchronization Failed.";
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-8 border-dashed border-2 border-primary/20 bg-primary/5 backdrop-blur-xl rounded-[2.5rem]">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary text-sm font-black uppercase tracking-[0.3em]">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Cloud className="w-4 h-4" />
                    </div>
                    Infrastructure Controller: Populate Matrix
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-6 items-end mt-4">
                    <div className="w-full sm:w-auto flex-1 group">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-2 px-1">Weather Condition</label>
                        <select
                            value={weatherCondition}
                            onChange={(e) => setWeatherCondition(e.target.value)}
                            className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold appearance-none"
                        >
                            {weatherConditions.map((condition) => (
                                <option key={condition.value} value={condition.value} className="bg-gray-800">
                                    {condition.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full sm:w-auto flex-1 group">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-2 px-1">Target Geographic City</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                            placeholder="Identify city node..."
                        />
                    </div>
                    <button
                        onClick={handleSeedData}
                        disabled={loading}
                        className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-3 shadow-lg shadow-primary/20 uppercase text-[10px] tracking-widest h-[52px]"
                    >
                        {loading ? (
                            "Synchronizing..."
                        ) : (
                            <>
                                <Sun className="w-4 h-4" />
                                Initiate Seeding
                            </>
                        )}
                    </button>
                </div>
                {message && <p className="mt-6 text-[10px] font-black text-accent uppercase tracking-widest bg-white/5 py-2 px-4 rounded-xl w-fit border border-white/5 shadow-inner">{message}</p>}
            </CardContent>
        </Card>
    );
}
