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
        <Card className="text-center p-12">
          <CardContent className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Forecast Data Coming Soon</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              The 7-day forecast will be available when your backend API provides daily weather data. 
              Currently, your backend only provides current weather information.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                <strong>Backend endpoint:</strong> http://localhost:5000/api/weather
              </p>
              <p className="text-sm text-blue-600 mt-2">
                To enable forecasts, extend your backend to return daily weather data arrays.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}