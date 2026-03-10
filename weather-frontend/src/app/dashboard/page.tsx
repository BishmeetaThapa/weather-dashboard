"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  MapPin, 
  Activity, 
  Navigation, 
  Sun, 
  TrendingUp, 
  AlertCircle,
  ArrowRight,
  Wind,
  Droplets,
  CloudRain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { weatherService } from "@/lib/apiClient";
import { MainLayout } from "@/components/layout/MainLayout";
import WeatherBackground from "@/components/weather/WeatherBackground";
import { StatCard } from "@/components/weather/StatCard";
import { CurrentWeatherSkeleton } from "@/components/weather/WeatherSkeleton";

export default function DashboardPage() {
  const [weatherList, setWeatherList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [gpsStatus, setGpsStatus] = useState<"loading" | "granted" | "denied">("loading");

  const getData = useCallback(async (lat?: number, lon?: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getWeatherData(lat, lon);
      setWeatherList(data);
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to synchronize with weather network.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      setGpsStatus("loading");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsStatus("granted");
          getData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation denied or failed:", error);
          setGpsStatus("denied");
          getData(); // Fallback to default (no coordinates)
        },
        { timeout: 10000 }
      );
    } else {
      setGpsStatus("denied");
      getData();
    }
  }, [getData]);

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

  // Use the first node as primary if available
  const primaryWeather = weatherList.length > 0 ? weatherList[0] : null;

  return (
    <MainLayout pageTitle="Dashboard | Skycast">
      <div className="font-sans overflow-x-hidden">
        <WeatherBackground condition={primaryWeather?.weather?.[0]?.main || "Clear"} isNight={isNight} />
        
        <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-white">Weather Dashboard</h1>
              <p className="text-white/60 font-medium mt-1">View current weather conditions and forecasts.</p>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                   if (navigator.geolocation && gpsStatus === "granted") {
                       navigator.geolocation.getCurrentPosition(
                           pos => getData(pos.coords.latitude, pos.coords.longitude),
                           () => getData()
                       );
                   } else {
                       getData();
                   }
                }}
                className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all"
              >
                <Activity size={20} className={loading ? "animate-spin text-primary" : "text-white/60"} />
              </button>
              <Link href="/forecast">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl flex items-center gap-2 font-black transition-all shadow-lg shadow-primary/20 text-xs uppercase tracking-widest"
                >
                  <Navigation size={18} />
                  Main Forecast
                </motion.button>
              </Link>
            </div>
          </header>

          {weatherList.length > 0 ? (
            <div className="space-y-12">
              {/* Primary Node Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Main Detail Card */}
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="lg:col-span-2 bg-sky-500 border border-sky-400 shadow-2xl shadow-sky-500/30 rounded-[3.5rem] p-12 relative overflow-hidden group"
                 >
                   <div className="absolute -top-10 -right-10 opacity-20 transform group-hover:scale-110 transition-transform duration-1000">
                     <Sun size={320} className="text-white" />
                   </div>
                   
                   <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start">
                       <div>
                         <div className="flex items-center gap-2 mb-3">
                           <MapPin size={16} className="text-white/70" />
                           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Current Location: {primaryWeather.city}</span>
                         </div>
                         <h2 className="text-6xl font-black tracking-tighter mb-2">{primaryWeather.city}</h2>
                         <p className="text-sky-100/60 font-medium uppercase tracking-widest text-xs">{primaryWeather.country}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-1">Status</p>
                         <span className="px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">Active</span>
                       </div>
                     </div>

                     <div className="mt-20 flex flex-col md:flex-row md:items-end justify-between gap-12">
                       <div className="flex items-center gap-8 text-white">
                         <span className="text-[10rem] font-black tracking-tighter leading-none">{Math.round(primaryWeather?.main?.temp ?? 0)}°</span>
                         <div className="space-y-2">
                           <p className="text-4xl font-bold uppercase tracking-tight">{primaryWeather?.weather?.[0]?.main ?? "N/A"}</p>
                           <p className="text-sky-100/60 font-medium flex items-center gap-2 italic">
                              {primaryWeather?.weather?.[0]?.description ?? "No detailed description"}
                           </p>
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-8 min-w-[240px] pt-8 border-t border-white/20 md:border-t-0 md:pt-0">
                         <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Humidity</p>
                           <p className="text-2xl font-black text-white">{primaryWeather?.main?.humidity ?? 0}%</p>
                         </div>
                         <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Wind Speed</p>
                           <p className="text-2xl font-black text-white">{primaryWeather?.wind?.speed ?? 0} km/h</p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </motion.div>

                 {/* Side Stats */}
                 <div className="space-y-6">
                    <StatCard
                      label="Atmosphere"
                      value={primaryWeather?.main?.pressure ?? 1013}
                      unit="hPa"
                      icon={Activity}
                      color="amber"
                    />
                    <StatCard
                      label="Visual Range"
                      value={(primaryWeather?.visibility ?? 10000) / 1000}
                      unit="km"
                      icon={Navigation}
                      color="blue"
                    />
                    <div className="premium-card p-8 flex flex-col justify-between h-48 bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                      <div className="flex justify-between items-start">
                        <TrendingUp size={24} className="text-primary" />
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Analytics</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-1">Matrix Stability</h4>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Synchronized at {new Date().toLocaleTimeString()}</p>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Secondary Nodes Grid */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-[2px] w-8 bg-primary"></div>
                  <h3 className="text-xs font-black uppercase tracking-[0.6em] text-white/30">Secondary Network Nodes</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {weatherList.slice(1).map((loc, idx) => (
                    <motion.div
                      key={loc._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="premium-card p-8 group hover:bg-white/10 transition-all border border-white/10"
                    >
                      <div className="flex justify-between items-start mb-10">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{loc.country}</p>
                          <h4 className="text-2xl font-black tracking-tight text-white">{loc.city}</h4>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                           {loc.city[0]}
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-5xl font-black tracking-tighter text-white">{Math.round(loc?.main?.temp ?? 0)}°</span>
                          <div>
                            <p className="text-xs font-bold text-white uppercase">{loc?.weather?.[0]?.main ?? "N/A"}</p>
                            <p className="text-[10px] font-medium text-white/40 italic">{loc?.weather?.[0]?.description ?? "N/A"}</p>
                          </div>
                        </div>
                        <Link href={`/forecast?city=${loc.city}`}>
                          <button className="p-3 rounded-xl bg-white/5 text-white/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                             <ArrowRight size={18} />
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/5 border-2 border-dashed border-white/10 rounded-[4rem]">
              <div className="p-8 bg-white/5 rounded-full text-white/10">
                <AlertCircle size={64} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">No active weather nodes</h3>
                <p className="text-white/40 max-w-sm">Use the infrastructure admin to initialize your first global data node.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </MainLayout>
  );
}
