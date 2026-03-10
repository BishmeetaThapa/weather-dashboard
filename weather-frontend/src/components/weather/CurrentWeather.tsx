'use client';

import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Zap, Wind, Droplets, Thermometer } from 'lucide-react';
import { WeatherData, getWeatherIcon } from '@/lib/weatherApi';

interface CurrentWeatherProps {
  data: WeatherData;
}

const WeatherIcon = ({ condition, size = 64 }: { condition: string; size?: number }) => {
  const icon = getWeatherIcon(condition);
  switch (icon) {
    case 'sun': return <Sun size={size} className="text-yellow-400" />;
    case 'cloud': return <Cloud size={size} className="text-gray-300" />;
    case 'cloud-rain': return <CloudRain size={size} className="text-blue-400" />;
    case 'cloud-snow': return <CloudSnow size={size} className="text-blue-200" />;
    case 'zap': return <Zap size={size} className="text-purple-400" />;
    default: return <Cloud size={size} className="text-gray-300" />;
  }
};

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  return (
    <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 text-white relative overflow-hidden group hover:bg-white/15 transition-all shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-semibold mb-1 opacity-90">{data.city}</h2>
          <p className="text-lg text-white/70 mb-4">{data.description}</p>
          <div className="flex items-end gap-2">
            <span className="text-7xl md:text-8xl font-bold tracking-tighter leading-none">
              {Math.round(data.temperature)}°
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <WeatherIcon condition={data.condition} size={120} />
          <div className="mt-4 flex gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <Thermometer size={18} className="opacity-60" />
              <span>H: {Math.round(data.temp_max)}° L: {Math.round(data.temp_min)}°</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets size={18} className="opacity-60" />
              <span>{data.humidity}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-xl">
            <Wind size={20} className="text-sky-300" />
          </div>
          <div>
            <p className="text-xs text-white/50">Wind Speed</p>
            <p className="font-medium">{data.wind.speed} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-xl">
            <Thermometer size={20} className="text-orange-300" />
          </div>
          <div>
            <p className="text-xs text-white/50">Feels Like</p>
            <p className="font-medium">{Math.round(data.feels_like)}°</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-xl">
            <Droplets size={20} className="text-blue-300" />
          </div>
          <div>
            <p className="text-xs text-white/50">Humidity</p>
            <p className="font-medium">{data.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-xl">
            <Sun size={20} className="text-yellow-300" />
          </div>
          <div>
            <p className="text-xs text-white/50">UV Index</p>
            <p className="font-medium">{data.uvIndex}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
