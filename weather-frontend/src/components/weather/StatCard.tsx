"use client";
import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isUp: boolean;
    };
    color?: 'blue' | 'amber' | 'emerald' | 'rose';
}

export function StatCard({
    label,
    value,
    unit,
    icon: Icon,
    trend,
    color = 'blue'
}: StatCardProps) {
    const colors = {
        blue: 'bg-primary/20 text-primary border-primary/20',
        amber: 'bg-amber-500/20 text-amber-400 border-amber-500/20',
        emerald: 'bg-accent/20 text-accent border-accent/20',
        rose: 'bg-rose-500/20 text-rose-400 border-rose-500/20',
    };

    return (
        <Card className="premium-card group hover:border-primary/50">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
                        <div className="flex items-baseline gap-1">
                            <h4 className="text-3xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{value}</h4>
                            {unit && <span className="text-sm font-semibold text-muted-foreground">{unit}</span>}
                        </div>
                        {trend && (
                            <div className={cn(
                                "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest",
                                trend.isUp ? "text-accent" : "text-rose-400"
                            )}>
                                <span className="flex items-center">
                                    {trend.isUp ? '↑' : '↓'} {trend.value}%
                                </span>
                                <span className="text-muted-foreground/60 font-medium lowercase">vs 24h</span>
                            </div>
                        )}
                    </div>
                    <div className={cn("p-3.5 rounded-2xl border backdrop-blur-md transition-transform group-hover:scale-110 duration-300", colors[color])}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
