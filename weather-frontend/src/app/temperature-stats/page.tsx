"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { fetchWeather, WeatherData } from "@/lib/weatherApi";
import { StatCard } from "@/components/weather/StatCard";
import WeatherBackground from "@/components/weather/WeatherBackground";
import { RefreshCw, Clock, Thermometer, ArrowUp, ArrowDown, Activity, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const REFRESH_INTERVAL = 2 * 60 * 1000; // 2 minutes

export default function TemperatureStatsPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getData = useCallback(async () => {
    try {
      const data = await fetchWeather();
      setWeather(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        getData();
      }, REFRESH_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, getData]);

  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour <= 6;

  if (loading) {
    return (
      <MainLayout pageTitle="Analyzing Temperature Data">
        <WeatherBackground condition={weather?.condition || "Clear"} isNight={isNight} />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  // Auto-refresh toggle and last updated
  const renderAutoRefreshControls = () => (
    <div className="flex items-center justify-between mb-6">
      {lastUpdated && (
        <span className="flex items-center gap-2 text-sm text-white/40">
          <Clock size={14} />
          Updated: {formatLastUpdated(lastUpdated)}
        </span>
      )}
      <button
        onClick={toggleAutoRefresh}
        className={`p-2 rounded-xl transition-all ${autoRefresh
          ? "bg-emerald-500/20 text-emerald-400"
          : "bg-white/10 text-white/40"
          }`}
        title={autoRefresh ? "Auto-refresh ON (2 min)" : "Auto-refresh OFF"}
      >
        <RefreshCw size={16} className={autoRefresh ? "animate-pulse" : ""} />
      </button>
    </div>
  );

  if (!weather) return null;

  const currentTemp = weather.temperature;
  const tempMax = weather.temp_max || weather.temperature;
  const tempMin = weather.temp_min || weather.temperature;

  return (
    <MainLayout pageTitle="Temperature Analytics">
      <WeatherBackground
        condition={weather.condition}
        isNight={isNight}
      />

      <div className="relative z-10 space-y-8">
        {renderAutoRefreshControls()}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Current Heat"
            value={Math.round(currentTemp)}
            unit="°C"
            icon={Thermometer}
            color="rose"
            trend={{ isUp: true, value: 24 }}
          />
          <StatCard
            label="Max Vector"
            value={Math.round(tempMax)}
            unit="°C"
            icon={ArrowUp}
            color="amber"
          />
          <StatCard
            label="Min Baseline"
            value={Math.round(tempMin)}
            unit="°C"
            icon={ArrowDown}
            color="blue"
          />
        </div>

        {/* Detailed Analysis Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="premium-card overflow-hidden">
            <CardHeader className="border-b border-white/10 pb-6 px-8 py-8 flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-2xl">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight text-white">Meteorological Matrix</CardTitle>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Real-time data synchronization</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Backend Connected</span>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <div className="flex justify-between items-end border-b border-white/5 pb-4 group">
                    <span className="text-xs font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Surface Temp</span>
                    <span className="text-3xl font-black text-white tracking-tighter">{Math.round(currentTemp)}°C</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-4 group">
                    <span className="text-xs font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-rose-400 transition-colors">Perceived Impact</span>
                    <span className="text-3xl font-black text-white tracking-tighter">{Math.round(weather.feels_like)}°C</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-4 group">
                    <span className="text-xs font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-sky-400 transition-colors">Dew Saturation</span>
                    <span className="text-3xl font-black text-white tracking-tighter">{weather.humidity}%</span>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex justify-between items-end border-b border-white/5 pb-4 group">
                    <span className="text-xs font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-amber-400 transition-colors">Wind Velocity</span>
                    <span className="text-3xl font-black text-white tracking-tighter">{weather.wind.speed} <span className="text-xs text-white/40">KM/H</span></span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-4 group">
                    <span className="text-xs font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-white transition-colors">Nebulosity</span>
                    <span className="text-3xl font-black text-white tracking-tighter">{weather.clouds.all}%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-4 group">
                    <span className="text-xs font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Vector Condition</span>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-primary/20 rounded-lg text-[10px] font-black text-primary uppercase border border-primary/20">{weather.condition}</span>
                      <span className="text-xl font-black text-white uppercase italic tracking-tighter">{weather.description}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform duration-700">
                  <Activity size={120} />
                </div>
                <div className="relative z-10 flex items-center gap-4 mb-4">
                  <Activity size={18} className="text-primary" />
                  <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Infrastructure Insights</h4>
                </div>
                <p className="text-sm text-white/50 font-medium leading-relaxed italic max-w-3xl">
                  Analytical node is actively monitoring the backend cluster. High-frequency time-series data is being ingested for long-term climate trajectory modeling.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}