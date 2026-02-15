"use client";

import { useEffect, useState, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { fetchForecast, ForecastData, getWeatherIcon } from "@/lib/weatherApi";
import { WeatherAdminPanel } from "@/components/weather/WeatherAdminPanel";
import { Sun, CloudRain, CloudLightning, Cloud, Wind, MapPin, Calendar, AlertCircle } from "lucide-react";

export default function ForecastPage() {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchForecast("Kathmandu"); // Defaulting to Kathmandu
      setForecast(data);
    } catch (err: any) {
      console.error("Failed to fetch forecast:", err);
      if (err.message.includes("No weather data found")) {
        setError("No forecast data found. Please add data using the admin panel.");
      } else {
        setError("Unable to connect to the backend. Please ensure the server is running.");
      }
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const getLucideIcon = (description: string) => {
    const iconName = getWeatherIcon(description);
    if (iconName === 'sun') return Sun;
    if (iconName === 'cloud-rain') return CloudRain;
    if (iconName === 'zap') return CloudLightning;
    if (iconName === 'cloud') return Cloud;
    if (iconName === 'wind') return Wind;
    if (iconName === 'cloud-sun') return Sun;
    return Cloud;
  };

  if (loading && !forecast && !error) {
    return (
      <MainLayout pageTitle="Loading Forecast...">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="7-Day Forecast">
      <div className="space-y-8">

        {/* Error / Empty State Handling */}
        {error && !forecast && (
          <div className="space-y-6">
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-6 flex items-center gap-4 text-amber-800">
                <AlertCircle className="w-8 h-8" />
                <div>
                  <h3 className="font-bold text-lg">No Data Available</h3>
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
            <WeatherAdminPanel onDataAdded={getData} />
          </div>
        )}

        {forecast && (
          <>
            {/* Header Info */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">Showing Forecast For</p>
                  <h2 className="text-3xl font-black text-gray-900">{forecast.city}</h2>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-gray-500 font-medium">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Forecast Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {forecast.list.map((day, index) => {
                const Icon = getLucideIcon(day.description);
                const isToday = index === 0;

                return (
                  <Card
                    key={day.date}
                    className={`overflow-hidden transition-all hover:translate-y-[-4px] hover:shadow-lg ${isToday ? 'border-blue-200 bg-blue-50/50' : 'border-gray-100'}`}
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {isToday ? 'Today' : new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                      </p>

                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-600'}`}>
                        <Icon className="w-8 h-8" />
                      </div>

                      <div className="space-y-1">
                        <p className="text-2xl font-black text-gray-900">{Math.round(day.temp_max)}°</p>
                        <p className="text-sm font-bold text-gray-400">{Math.round(day.temp_min)}°</p>
                      </div>

                      <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter truncate w-full">
                        {day.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Info Card */}
            <Card className="bg-gray-900 border-none text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Wind className="w-40 h-40" />
              </div>
              <CardContent className="p-8 space-y-4 relative z-10">
                <div className="flex bg-white/10 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-blue-300">
                  Pro Tip
                </div>
                <h3 className="text-2xl font-bold">Weather Insights</h3>
                <p className="text-gray-400 max-w-xl">
                  Our 7-day forecast combines multiple data points to give you the most accurate prediction for {forecast.city}.
                  Stay ahead of the weather and plan your week with confidence.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
}
