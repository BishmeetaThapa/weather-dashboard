"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TemperatureChart } from "@/components/weather/TemperatureChart";
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

  const avgTemp = Math.round(
    weather.hourly.temperature_2m.reduce((a, b) => a + b, 0) / weather.hourly.temperature_2m.length
  );

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
                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">+Avg</span>
              </div>
              <h4 className="text-sm font-medium text-gray-500">24h Average</h4>
              <p className="text-3xl font-black text-gray-900 mt-1">{avgTemp}°C</p>
              <p className="text-xs text-gray-400 mt-2 font-medium italic">Based on hourly data</p>
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
              <h4 className="text-sm font-medium text-gray-500">Maximum Today</h4>
              <p className="text-3xl font-black text-gray-900 mt-1">{Math.round(weather.daily.temperature_2m_max[0])}°C</p>
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
              <h4 className="text-sm font-medium text-gray-500">Minimum Today</h4>
              <p className="text-3xl font-black text-gray-900 mt-1">{Math.round(weather.daily.temperature_2m_min[0])}°C</p>
              <p className="text-xs text-gray-400 mt-2 font-medium">Daily lowest temperature</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-8">
          <TemperatureChart
            labels={weather.hourly.time.map(t => new Date(t).getHours() + ':00')}
            data={weather.hourly.temperature_2m}
            title="24-Hour Comparison"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <CardTitle>Hourly Fluctuations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {weather.hourly.time.slice(0, 4).map((time, i) => {
                    const hour = new Date(time).getHours();
                    const temp = weather.hourly.temperature_2m[i];
                    return (
                      <div key={time} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-700">{hour}:00</span>
                          <span className="font-bold text-blue-600">{temp}°C</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${(temp / 40) * 100}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forecast Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-[200px] gap-2 pt-4">
                  {weather.daily.temperature_2m_max.slice(0, 7).map((temp, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-blue-100 rounded-t-lg transition-all hover:bg-blue-600"
                        style={{ height: `${(temp / 40) * 100}%` }}
                      ></div>
                      <span className="text-[10px] font-bold text-gray-400">Day {i + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Average High</p>
                    <p className="text-lg font-black text-gray-900">
                      {Math.round(weather.daily.temperature_2m_max.reduce((a, b) => a + b, 0) / 7)}°C
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-bold uppercase">Average Low</p>
                    <p className="text-lg font-black text-gray-400">
                      {Math.round(weather.daily.temperature_2m_min.reduce((a, b) => a + b, 0) / 7)}°C
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}