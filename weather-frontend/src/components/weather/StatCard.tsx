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
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        rose: 'bg-rose-50 text-rose-600',
    };

    return (
        <Card className="hover:border-blue-100 transition-colors">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">{label}</p>
                        <div className="flex items-baseline gap-1">
                            <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
                            {unit && <span className="text-sm font-medium text-gray-400">{unit}</span>}
                        </div>
                        {trend && (
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider",
                                trend.isUp ? "text-emerald-500" : "text-rose-500"
                            )}>
                                <span>{trend.isUp ? '↑' : '↓'} {trend.value}%</span>
                                <span className="text-gray-400 font-medium lowercase">vs last 24h</span>
                            </div>
                        )}
                    </div>
                    <div className={cn("p-3 rounded-xl", colors[color])}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
