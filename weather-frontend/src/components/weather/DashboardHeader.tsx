"use client";

import { Activity, Navigation, Clock, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface DashboardHeaderProps {
    loading: boolean;
    gpsStatus: "loading" | "granted" | "denied";
    onRefresh: () => void;
    autoRefresh?: boolean;
    onToggleAutoRefresh?: () => void;
    lastUpdated?: Date | null;
}

export function DashboardHeader({
    loading,
    gpsStatus,
    onRefresh,
    autoRefresh = true,
    onToggleAutoRefresh,
    lastUpdated
}: DashboardHeaderProps) {

    const formatLastUpdated = (date: Date | null | undefined) => {
        if (!date) return "";
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-4xl font-extrabold tracking-tight text-white">Weather Dashboard</h1>
                <div className="flex items-center gap-3 mt-1">
                    <p className="text-white/60 font-medium">View current weather conditions and forecasts.</p>
                    {lastUpdated && (
                        <span className="flex items-center gap-1 text-xs text-white/40">
                            <Clock size={12} />
                            Updated: {formatLastUpdated(lastUpdated)}
                        </span>
                    )}
                </div>
            </motion.div>

            <div className="flex items-center gap-3">
                {onToggleAutoRefresh && (
                    <button
                        onClick={onToggleAutoRefresh}
                        className={`p-3 border rounded-2xl transition-all ${autoRefresh
                                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                                : "bg-white/10 border-white/20 text-white/40"
                            }`}
                        title={autoRefresh ? "Auto-refresh ON (5 min)" : "Auto-refresh OFF"}
                    >
                        <RefreshCw size={18} className={autoRefresh ? "animate-pulse" : ""} />
                    </button>
                )}

                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all disabled:opacity-50"
                >
                    <Activity size={20} className={loading ? "animate-spin text-white" : "text-white/60"} />
                </button>

                <Link href="/forecast">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-white/10 text-white rounded-2xl flex items-center gap-2 font-bold transition-all shadow-md"
                    >
                        <Navigation size={18} />
                        Main Forecast
                    </motion.button>
                </Link>
            </div>
        </header>
    );
}
