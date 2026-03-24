"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { weatherService } from "@/lib/apiClient";
import { MainLayout } from "@/components/layout/MainLayout";
import WeatherBackground from "@/components/weather/WeatherBackground";
import { CurrentWeatherSkeleton } from "@/components/weather/WeatherSkeleton";
import { DashboardHeader } from "@/components/weather/DashboardHeader";
import PrimaryWeatherCard from "@/components/weather/PrimaryWeatherCard";
import WeatherSidebarCards from "@/components/weather/WeatherSidebarCards";
import { LocationCard } from "@/components/weather/LocationCard";
import { DashboardEmptyState } from "@/components/weather/DashboardEmptyState";

const REFRESH_INTERVAL = 2 * 60 * 1000; // 2 minutes

export default function DashboardPage() {
  const [weatherList, setWeatherList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"loading" | "granted" | "denied">("loading");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const savedPositionRef = useRef<{ lat: number; lon: number } | null>(null);

  const getData = useCallback(async (lat?: number, lon?: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getWeatherData(lat, lon);
      setWeatherList(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to synchronize with weather network.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      setGpsStatus("loading");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsStatus("granted");
          savedPositionRef.current = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          getData(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setGpsStatus("denied");
          getData();
        },
        { timeout: 10000 }
      );
    } else {
      setGpsStatus("denied");
      getData();
    }
  }, [getData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && savedPositionRef.current) {
      intervalRef.current = setInterval(() => {
        getData(savedPositionRef.current!.lat, savedPositionRef.current!.lon);
      }, REFRESH_INTERVAL);
    } else if (autoRefresh && !savedPositionRef.current) {
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

  const handleRefresh = useCallback(() => {
    if (savedPositionRef.current) {
      getData(savedPositionRef.current.lat, savedPositionRef.current.lon);
    } else if (navigator.geolocation && gpsStatus === "granted") {
      navigator.geolocation.getCurrentPosition(
        pos => {
          savedPositionRef.current = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          };
          getData(pos.coords.latitude, pos.coords.longitude);
        },
        () => getData()
      );
    } else {
      getData();
    }
  }, [gpsStatus, getData]);

  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);

  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour <= 6;

  if (loading && weatherList.length === 0) {
    const loadingMessage = gpsStatus === "loading"
      ? "Detecting Local Weather..."
      : "Loading Weather Data...";
    return (
      <MainLayout pageTitle={loadingMessage}>
        <WeatherBackground condition="Clear" isNight={isNight} />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <CurrentWeatherSkeleton />
        </div>
      </MainLayout>
    );
  }

  const primaryWeather = weatherList.length > 0 ? weatherList[0] : null;

  return (
    <MainLayout pageTitle="Dashboard">
      <div className="font-sans text-white overflow-x-hidden bg-gray-900 min-h-screen">

        <WeatherBackground condition={primaryWeather?.weather?.[0]?.main || "Clear"} isNight={isNight} />

        <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">

          <DashboardHeader
            loading={loading}
            gpsStatus={gpsStatus}
            onRefresh={handleRefresh}
            autoRefresh={autoRefresh}
            onToggleAutoRefresh={toggleAutoRefresh}
            lastUpdated={lastUpdated}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {weatherList.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* Primary Weather and Sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div className="lg:col-span-2" whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                  <PrimaryWeatherCard weather={primaryWeather} />
                </motion.div>
                <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                  <WeatherSidebarCards weather={primaryWeather} />
                </motion.div>
              </div>

              {/* Secondary Locations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {weatherList.slice(1).map((loc, idx) => (
                  <LocationCard key={loc._id} location={loc} index={idx} />
                ))}
              </div>

            </motion.div>
          ) : (
            <DashboardEmptyState />
          )}

        </main>
      </div>
    </MainLayout>
  );
}
