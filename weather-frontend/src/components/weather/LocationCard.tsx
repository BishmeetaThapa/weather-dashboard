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
            className="p-5 bg-[#1f2430] rounded-3xl flex flex-col justify-between cursor-pointer border border-[#2b3040] hover:border-[#3b4255] transition-colors shadow-xl"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-[10px] font-black text-white/90 uppercase tracking-[0.05em] mb-1">{location.country}</p>
                    <h4 className="text-xl font-bold text-white tracking-tight">{location.city}</h4>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#313745] flex items-center justify-center text-white/90 font-bold text-sm uppercase shadow-sm">
                    {location.city[0]}
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <p className="text-xs font-medium text-white/50">{location?.weather?.[0]?.main ?? "N/A"}</p>
                <Link href={`/forecast?city=${location.city}`}>
                    <button className="w-10 h-10 rounded-xl bg-[#313745] hover:bg-[#3d4454] flex items-center justify-center transition-colors shadow-sm cursor-pointer">
                        <ArrowRight size={16} className="text-white/80" />
                    </button>
                </Link>
            </div>
        </motion.div>
    );
}
