"use client";

import { useState } from "react";
import { X, MapPin } from "lucide-react";

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string) => void;
}

export function LocationModal({ isOpen, onClose, onAdd }: LocationModalProps) {
    const [cityName, setCityName] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cityName.trim()) {
            onAdd(cityName.trim());
            setCityName("");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-sky-500/10 rounded-2xl border border-sky-500/20">
                            <MapPin className="w-5 h-5 text-sky-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Add City</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 pt-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/40 uppercase tracking-widest px-1">Location Name</label>
                            <input
                                placeholder="e.g. Kathmandu, Pokhara..."
                                value={cityName}
                                onChange={(e) => setCityName(e.target.value)}
                                autoFocus
                                className="w-full h-14 bg-white/5 border border-white/10 focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10 outline-none p-4 text-white font-medium rounded-2xl transition-all"
                            />
                        </div>
                        
                        <div className="flex gap-4 pt-4">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="flex-1 h-12 rounded-2xl font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 h-12 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-black shadow-lg shadow-sky-500/20 transition-all active:scale-95"
                            >
                                Track City
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
