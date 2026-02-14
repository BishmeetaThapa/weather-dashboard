"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { fetchWeather, WeatherData } from "@/lib/weatherApi";
import { Thermometer, ArrowUp, ArrowDown, Activity } from "lucide-react";

export default function TemperatureStatsPage() {
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

  if (loading) {
    return (
      <MainLayout pageTitle="Loading Stats...">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!weather) return null;

  const currentTemp = weather.temperature;
  const feelsLike = weather.feels_like || weather.temperature;
  const tempMax = weather.temp_max || weather.temperature;
  const tempMin = weather.temp_min || weather.temperature;

  return (
    <MainLayout pageTitle="Temperature Statistics">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
                  <Thermometer className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">Current</span>
              </div>
              <h4 className="text-sm font-medium text-gray-500">Current Temperature</h4>
              <p className="text-3xl font-black text-gray-900 mt-1">{Math.round(currentTemp)}°C</p>
              <p className="text-xs text-gray-400 mt-2 font-medium italic">Real-time measurement</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                  <ArrowUp className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">High</span>
              </div>
              <h4 className="text-sm font-medium text-gray-500">Maximum Temperature</h4>
              <p className="text-3xl font-black text-gray-900 mt-1">{Math.round(tempMax)}°C</p>
              <p className="text-xs text-gray-400 mt-2 font-medium">Daily peak temperature</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <ArrowDown className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Low</span>
              </div>
              <h4 className="text-sm font-medium text-gray-500">Minimum Temperature</h4>
              <p className="text-3xl font-black text-gray-900 mt-1">{Math.round(tempMin)}°C</p>
              <p className="text-xs text-gray-400 mt-2 font-medium">Daily lowest temperature</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Weather Details */}
        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <CardTitle>Current Weather Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Temperature</span>
                      <span className="text-lg font-bold text-blue-600">{Math.round(currentTemp)}°C</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Feels Like</span>
                      <span className="text-lg font-bold text-gray-600">{Math.round(feelsLike)}°C</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Humidity</span>
                      <span className="text-lg font-bold text-blue-500">{weather.humidity}%</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Wind Speed</span>
                      <span className="text-lg font-bold text-green-600">{weather.wind.speed} km/h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Cloudiness</span>
                      <span className="text-lg font-bold text-gray-600">{weather.clouds.all}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Condition</span>
                      <span className="text-lg font-bold text-purple-600">{weather.description}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Detailed hourly and historical temperature charts will be available 
                    when your backend API provides time-series weather data.
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    <strong>Backend endpoint:</strong> http://localhost:5000/api/weather
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}