'use client';

import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Zap, CloudSun } from 'lucide-react';
import { DailyForecast as DailyType } from '@/lib/weatherApi';

interface WeeklyForecastProps {
  daily: DailyType[];
}

const WeatherIcon = ({ icon, size = 24 }: { icon: string; size?: number }) => {
  switch (icon) {
    case 'sun': return <Sun size={size} className="text-yellow-400" />;
    case 'cloud': return <Cloud size={size} className="text-gray-300" />;
    case 'cloud-sun': return <CloudSun size={size} className="text-yellow-200" />;
    case 'cloud-rain': return <CloudRain size={size} className="text-blue-400" />;
    case 'cloud-snow': return <CloudSnow size={size} className="text-blue-200" />;
    case 'zap': return <Zap size={size} className="text-purple-400" />;
    default: return <Cloud size={size} className="text-gray-300" />;
  }
};

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ daily }) => {
  return (
    <div className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 h-full shadow-lg">
      <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-6 ml-2 text-center md:text-left">7-Day Forecast</h3>
      <div className="flex flex-col gap-1">
        {daily.map((day) => (
          <div 
            key={day.id} 
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group"
          >
            <span className="w-12 text-sm font-semibold text-white/90 group-hover:text-white">
              {day.day}
            </span>
            <div className="flex items-center gap-3">
              <WeatherIcon icon={day.icon} size={22} />
              <span className="text-sm text-white/60 hidden sm:inline-block w-24 truncate text-center capitalize">
                {day.condition}
              </span>
            </div>
            <div className="flex items-center gap-4 w-20 justify-end">
              <span className="text-sm font-bold text-white">{Math.round(day.temp_max)}°</span>
              <span className="text-sm font-medium text-white/40">{Math.round(day.temp_min)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyForecast;
