"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface LocationData {
    _id: string;
    city: string;
    country: string;
    weather?: Array<{
        main: string;
    }>;
}

interface LocationCardProps {
    location: LocationData;
    index: number;
}

export function LocationCard({ location, index }: LocationCardProps) {
    return (
        <motion.div
            key={location._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ delay: index * 0.05 }}
            className="p-6 bg-[#1e2330] rounded-[2rem] shadow-xl flex flex-col justify-between cursor-pointer border border-transparent hover:border-white/5 transition-colors"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">{location.country}</p>
                    <h4 className="text-xl font-bold text-white">{location.city}</h4>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/50 font-black text-sm uppercase">
                    {location.city[0]}
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <p className="text-[11px] font-medium text-white/40">{location?.weather?.[0]?.main ?? "N/A"}</p>
                <Link href={`/forecast?city=${location.city}`}>
                    <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                        <ArrowRight size={14} className="text-white/50" />
                    </button>
                </Link>
            </div>
        </motion.div>
    );
}
