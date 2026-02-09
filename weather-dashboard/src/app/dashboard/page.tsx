"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/weather/StatCard";
import { TemperatureChart } from "@/components/weather/TemperatureChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { fetchWeather, WeatherData, DEFAULT_LOCATION } from "@/lib/weatherApi";
import {
  CloudRain,
  Wind,
  Droplets,
  Sun,
  MapPin,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
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

    // Real-time updates: Poll every 5 minutes
    const interval = setInterval(getData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <MainLayout pageTitle="Loading Weather Overview...">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!weather) return null;

  return (
    <MainLayout pageTitle="Weather Overview">
      <div className="space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Temperature"
            value={Math.round(weather.current.temp)}
            unit="°C"
            icon={Sun}
            trend={{ value: 2, isUp: true }}
            color="amber"
          />
          <StatCard
            label="Humidity"
            value={weather.current.humidity}
            unit="%"
            icon={Droplets}
            trend={{ value: 5, isUp: false }}
            color="blue"
          />
          <StatCard
            label="Wind Speed"
            value={weather.current.windSpeed}
            unit="km/h"
            icon={Wind}
            trend={{ value: 1, isUp: true }}
            color="emerald"
          />
          <StatCard
            label="Precipitation"
            value={weather.current.precipitation}
            unit="mm"
            icon={CloudRain}
            color="rose"
          />
        </div>

        {/* Charts and Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <TemperatureChart
            labels={weather.hourly.time.map(t => new Date(t).getHours() + ':00')}
            data={weather.hourly.temperature_2m}
            title="Hourly Temperature Trends"
          />

          <Card className="bg-blue-600 border-none shadow-xl shadow-blue-200 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sun className="w-40 h-40" />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-200" />
                <span className="text-sm font-medium text-blue-100 uppercase tracking-wider">{DEFAULT_LOCATION.name}</span>
              </div>
              <CardTitle className="text-white text-3xl font-bold mt-2">Kathmandu, Nepal</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="flex items-center gap-4">
                <span className="text-6xl font-black">{Math.round(weather.current.temp)}°</span>
                <div className="space-y-1">
                  <p className="text-lg font-semibold">{weather.current.condition}</p>
                  <p className="text-blue-100 text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-blue-500/50 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-200">Feels Like</span>
                  <span className="font-semibold text-white">{Math.round(weather.current.temp)}°C</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-200">Weather Code</span>
                  <span className="font-semibold text-white">{weather.daily.weather_code[0]}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Forecast Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">7-Day Forecast</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {weather.daily.time.map((date, i) => {
              const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
              return (
                <Card key={date} className="text-center hover:border-blue-100 transition-all cursor-pointer">
                  <CardContent className="pt-6 space-y-4">
                    <p className="text-sm font-semibold text-gray-500">{day}</p>
                    <div className="mx-auto bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center">
                      <Sun className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="space-x-2">
                      <span className="text-sm font-bold text-gray-900">{Math.round(weather.daily.temperature_2m_max[i])}°</span>
                      <span className="text-sm font-medium text-gray-400">{Math.round(weather.daily.temperature_2m_min[i])}°</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}