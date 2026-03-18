'use client';

import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Zap, CloudSun } from 'lucide-react';
import { HourlyForecast as HourlyType } from '@/lib/weatherApi';

interface HourlyForecastProps {
  hourly: HourlyType[];
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

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly }) => {
  return (
    <div className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 mb-8 overflow-hidden">
      <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-6 ml-2">Hourly Forecast</h3>
      <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide snap-x">
        {hourly.map((hour) => (
          <div
            key={hour.id}
            className="flex flex-col items-center min-w-[80px] snap-center group"
          >
            <span className="text-sm font-medium text-white/70 mb-4 group-hover:text-white transition-colors">
              {hour.time}
            </span>
            <div className="mb-4 p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-all transform group-hover:scale-110">
              <WeatherIcon icon={hour.icon} size={28} />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              {Math.round(hour.temp)}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
