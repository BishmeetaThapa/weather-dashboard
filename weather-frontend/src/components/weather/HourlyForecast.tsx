"use client";

import { Card, CardContent } from "@/components/ui/Card";

import { HourlyForecast as HourlyForecastType } from "@/lib/weatherApi";
import { Cloud, CloudRain, CloudSnow, Sun, Zap } from "lucide-react";

interface HourlyForecastProps {
  hourlyData?: HourlyForecastType[];
}

export default function HourlyForecast({ hourlyData }: HourlyForecastProps) {
  if (!hourlyData || hourlyData.length === 0) {
    return (
      <Card className="bg-gray-800/20 backdrop-blur-xl border border-gray-700/40 rounded-3xl">
        <CardContent className="p-6 text-center">
          <p className="text-white/60 font-bold">No hourly forecast data available</p>
        </CardContent>
      </Card>
    );
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'sun': return <Sun className="w-8 h-8 text-amber-400" />;
      case 'cloud': return <Cloud className="w-8 h-8 text-white/70" />;
      case 'cloud-rain': return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'cloud-snow': return <CloudSnow className="w-8 h-8 text-white" />;
      case 'zap': return <Zap className="w-8 h-8 text-yellow-400" />;
      default: return <Sun className="w-8 h-8 text-amber-400" />;
    }
  };

  // Get up to 24 hours
  const hourlyForecast = hourlyData.slice(0, 24);

  const formatHour = (timeStr: string): string => {
    return timeStr; // time is already formatted in mapping
  };

  return (
    <Card className="bg-gray-800/20 backdrop-blur-xl border border-gray-700/40 rounded-3xl">
      <CardContent className="p-6">
        <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-6">
          Hourly Forecast
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {hourlyForecast.map((hour, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-16 text-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <p className="text-[10px] font-medium text-white/70">
                {index === 0 ? "Now" : formatHour(hour.time)}
              </p>
              <div className="flex justify-center my-3">{getIconComponent(hour.icon)}</div>
              <p className="text-sm font-bold text-white">{Math.round(hour.temp)}°</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
