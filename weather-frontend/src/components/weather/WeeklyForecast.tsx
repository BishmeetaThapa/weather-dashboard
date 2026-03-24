"use client";

import { Card, CardContent } from "@/components/ui/Card";

import { DailyForecast as DailyForecastType } from "@/lib/weatherApi";
import { Cloud, CloudRain, CloudSnow, Sun, Zap } from "lucide-react";

interface WeeklyForecastProps {
  dailyData?: DailyForecastType[];
}

export default function WeeklyForecast({ dailyData }: WeeklyForecastProps) {
  if (!dailyData || dailyData.length === 0) {
    return (
      <Card className="bg-gray-800/20 backdrop-blur-xl border border-gray-700/40 rounded-3xl">
        <CardContent className="p-6 text-center">
          <p className="text-white/60 font-bold">No weekly forecast data available</p>
        </CardContent>
      </Card>
    );
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'sun': return <Sun className="w-6 h-6 text-amber-400" />;
      case 'cloud': return <Cloud className="w-6 h-6 text-white/70" />;
      case 'cloud-rain': return <CloudRain className="w-6 h-6 text-blue-400" />;
      case 'cloud-snow': return <CloudSnow className="w-6 h-6 text-white" />;
      case 'zap': return <Zap className="w-6 h-6 text-yellow-400" />;
      default: return <Sun className="w-6 h-6 text-amber-400" />;
    }
  };

  const dailyForecast = dailyData.slice(0, 7);

  return (
    <Card className="bg-gray-800/20 backdrop-blur-xl border border-gray-700/40 rounded-3xl">
      <CardContent className="p-6">
        <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-6">
          7-Day Forecast
        </h3>
        <div className="space-y-3">
          {dailyForecast.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4 w-32">
                <span className="flex items-center justify-center w-8">{getIconComponent(day.icon)}</span>
                <span className="text-sm font-bold text-white">{day.day}</span>
              </div>
              <div className="flex items-center gap-2 flex-1 justify-center">
                <span className="text-sm font-medium text-white/70">{Math.round(day.temp_min)}°</span>
                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full"
                    style={{
                      width: `${Math.min(100, ((day.temp_max - day.temp_min) / 30) * 100)}%`,
                      marginLeft: `${Math.min(50, ((day.temp_min + 10) / 50) * 100)}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-white">{Math.round(day.temp_max)}°</span>
              </div>
              <div className="w-16 text-right">
                <span className="text-xs font-medium text-white/60">--%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
