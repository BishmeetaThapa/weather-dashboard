"use client";

import { AlertCircle } from "lucide-react";

export function DashboardEmptyState() {
    return (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/5 border border-white/20 rounded-3xl">
            <AlertCircle size={64} className="text-white/40" />
            <h3 className="text-2xl font-bold text-white">No active weather nodes</h3>
            <p className="text-white/60 max-w-sm">Use the infrastructure admin to initialize your first global data node.</p>
        </div>
    );
}
