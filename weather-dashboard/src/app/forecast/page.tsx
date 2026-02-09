"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { fetchWeather, WeatherData } from "@/lib/weatherApi";
import { Sun, CloudRain, CloudLightning, Cloud, Wind, Droplets } from "lucide-react";

export default function ForecastPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchWeather();
        setWeather(data);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const getDayIcon = (code: number) => {
    if (code === 0) return Sun;
    if (code <= 3) return Cloud;
    if (code <= 67) return CloudRain;
    if (code <= 99) return CloudLightning;
    return Cloud;
  };

  const getConditionName = (code: number) => {
    if (code === 0) return 'Sunny';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 67) return 'Rainy';
    if (code <= 99) return 'Thunderstorm';
    return 'Cloudy';
  };

  if (loading) {
    return (
      <MainLayout pageTitle="Loading Forecast...">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!weather) return null;

  return (
    <MainLayout pageTitle="7-Day Forecast">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {weather.daily.time.map((date, i) => {
            const Icon = getDayIcon(weather.daily.weather_code[i]);
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
            const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return (
              <Card key={date} className="hover:border-blue-100 transition-all group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                    <div className="flex items-center gap-6 min-w-[240px]">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{dayName}</h3>
                        <p className="text-sm text-gray-500 font-medium">{formattedDate}</p>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center justify-around gap-8">
                      <div className="text-center">
                        <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-1">Temp</p>
                        <p className="text-xl font-bold text-gray-900">
                          {Math.round(weather.daily.temperature_2m_max[i])}° / {Math.round(weather.daily.temperature_2m_min[i])}°
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-1">Condition</p>
                        <p className="text-xl font-bold text-gray-900">{getConditionName(weather.daily.weather_code[i])}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Wind className="w-4 h-4" />
                          <span className="text-sm font-semibold">12 km/h</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Droplets className="w-4 h-4" />
                          <span className="text-sm font-semibold">45%</span>
                        </div>
                      </div>
                    </div>

                    <button className="h-10 px-6 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      Details
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}