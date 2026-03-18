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
            transition={{ delay: index * 0.05 }}
            className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{location.country}</p>
                    <h4 className="text-xl font-bold">{location.city}</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/60 font-bold">
                    {location.city[0]}
                </div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <p className="text-white/60 text-sm">{location?.weather?.[0]?.main ?? "N/A"}</p>
                <Link href={`/forecast?city=${location.city}`}>
                    <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20">
                        <ArrowRight size={18} />
                    </button>
                </Link>
            </div>
        </motion.div>
    );
}
