"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MapPin, Navigation, Loader2, AlertCircle, RefreshCw, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { weatherService } from "@/lib/apiClient";

const REFRESH_INTERVAL = 2 * 60 * 1000; // 2 minutes

export default function LocationsPage() {
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const loadLocations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await weatherService.getWeatherData();
            setLocations(data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to load locations:", error);
            setError("Unable to connect to the weather network.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLocations();
    }, [loadLocations]);

    // Auto-refresh functionality
    useEffect(() => {
        if (autoRefresh) {
            intervalRef.current = setInterval(() => {
                loadLocations();
            }, REFRESH_INTERVAL);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [autoRefresh, loadLocations]);

    const toggleAutoRefresh = () => {
        setAutoRefresh(prev => !prev);
    };

    const formatLastUpdated = (date: Date | null) => {
        if (!date) return "";
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <MainLayout pageTitle="Global Nodes">
            <div className="font-sans overflow-x-hidden bg-gray-900 min-h-screen text-white">

                <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">

                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-2"
                        >
                            <h1 className="text-4xl font-extrabold tracking-tight">
                                Weather Locations
                            </h1>

                            <p className="text-white/60 font-medium">
                                View tracked cities and regions across your global network.
                            </p>
                        </motion.div>

                        <div className="flex items-center gap-4">
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

                    </header>

                    {/* Error */}
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-red-500/10 border border-red-500/20 backdrop-blur-xl rounded-3xl p-6 mb-8 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <AlertCircle className="text-red-400" />
                                    <p className="text-red-400 font-medium">{error}</p>
                                </div>

                                <button
                                    onClick={loadLocations}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all"
                                >
                                    Retry Sync
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <Loader2 className="w-12 h-12 text-sky-400 animate-spin" />
                            <p className="text-white/40 font-medium tracking-widest uppercase text-xs">
                                Synchronizing Nodes
                            </p>
                        </div>
                    ) : (

                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >

                            {locations.length === 0 ? (

                                <div className="col-span-full py-32 flex flex-col items-center text-center space-y-6 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 border-dashed">

                                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                                        <MapPin size={40} className="text-white/20" />
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold">No locations tracked</h3>
                                        <p className="text-white/40 italic">
                                            Initialize your first data nodes from the administrative control panel.
                                        </p>
                                    </div>

                                </div>

                            ) : (

                                <AnimatePresence>
                                    {locations.map((node, index) => (
                                        <motion.div
                                            key={node._id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 hover:bg-white/15 transition-all shadow-lg hover:shadow-2xl"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sky-400 mb-2">
                                                        <MapPin size={14} />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{node.country}</span>
                                                    </div>
                                                    <h3 className="text-3xl font-bold tracking-tight">{node.city}</h3>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-4xl font-black text-white group-hover:text-sky-400 transition-colors duration-300">
                                                        {Math.round(node?.main?.temp ?? 0)}°
                                                    </p>
                                                    <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mt-1">
                                                        {node?.weather?.[0]?.main ?? "N/A"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                                <div className="flex items-center gap-4">
                                                    <Link href={`/forecast?city=${node.city}`}>
                                                        <button
                                                            className="p-3 bg-white/5 rounded-2xl hover:bg-sky-500/10 hover:text-sky-400 transition-all text-white/40"
                                                            title="View Detailed Forecast"
                                                        >
                                                            <Navigation size={18} />
                                                        </button>
                                                    </Link>
                                                </div>
                                                <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">
                                                        {node?.weather?.[0]?.description ?? "No description"}
                                                    </span>
                                                </div>
                                            </div>

                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                            )}

                        </motion.div>

                    )}

                </main>

            </div>
        </MainLayout>
    );
}