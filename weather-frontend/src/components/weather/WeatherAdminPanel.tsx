"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Cloud, Sun, CloudRain, Wind } from "lucide-react";
import axios from "axios";

export function WeatherAdminPanel({ onDataAdded }: { onDataAdded: () => void }) {
    const [city, setCity] = useState("Kathmandu");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSeedData = async () => {
        setLoading(true);
        setMessage("");
        try {
            // Seed Current Weather
            await axios.post("http://localhost:5000/api/weather", {
                city: city,
                country: "NP",
                coordinates: { lat: 27.7172, lon: 85.324 },
                weather: [{ id: 800, main: "Clear", description: "Clear Sky", icon: "01d" }],
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
                    weather: "Clear",
                    description: i % 2 === 0 ? "Sunny" : "Partly Cloudy",
                    icon: i % 2 === 0 ? "sun" : "cloud-sun",
                };
            });

            // We need to loop or create a bulk endpoint. 
            // For now, let's just create one entry to avoid complexity or loop if backend supports it.
            // Our backend forecast model is single day entry? 
            // Checking models/forecast.js... it looks like single entry.
            // Let's loop.
            for (const day of forecastList) {
                await axios.post("http://localhost:5000/api/forecast", day);
            }

            setMessage("✅ Weather data seeded successfully!");
            onDataAdded();
        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to seed data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-8 border-dashed border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Cloud className="w-5 h-5" />
                    Admin: Populate Database
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="w-full sm:w-auto flex-1">
                        <label className="text-sm font-medium text-blue-900 block mb-2">City Name</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter city..."
                        />
                    </div>
                    <button
                        onClick={handleSeedData}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        {loading ? (
                            "Seeding..."
                        ) : (
                            <>
                                <Sun className="w-4 h-4" />
                                Seed Data
                            </>
                        )}
                    </button>
                </div>
                {message && <p className="mt-4 text-sm font-bold text-gray-700">{message}</p>}
            </CardContent>
        </Card>
    );
}
