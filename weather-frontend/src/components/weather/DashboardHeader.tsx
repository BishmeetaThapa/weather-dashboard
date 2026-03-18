"use client";

import { Activity, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface DashboardHeaderProps {
    loading: boolean;
    gpsStatus: "loading" | "granted" | "denied";
    onRefresh: () => void;
}

export function DashboardHeader({ loading, gpsStatus, onRefresh }: DashboardHeaderProps) {
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-4xl font-extrabold tracking-tight text-white">Weather Dashboard</h1>
                <p className="text-white/60 font-medium mt-1">View current weather conditions and forecasts.</p>
            </motion.div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onRefresh}
                    className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all"
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
