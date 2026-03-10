'use client';

import React from 'react';
import { Wind, Droplets, ArrowUp, Compass, Eye, Gauge, Sun } from 'lucide-react';
import { WeatherData } from '@/lib/weatherApi';

interface WeatherDetailsProps {
  data: WeatherData;
}

interface DetailCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  description?: string;
  colorClass?: string;
}

const DetailCard = ({ icon: Icon, label, value, description, colorClass }: DetailCardProps) => (
  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-5 flex flex-col justify-between hover:bg-white/15 transition-all group shadow-md shrink-0 sm:shrink">
    <div className="flex items-center gap-2 mb-4">
      <div className={`p-2 rounded-xl bg-white/5 ${colorClass}`}>
        <Icon size={18} />
      </div>
      <span className="text-xs font-semibold text-white/50 uppercase tracking-tighter">{label}</span>
    </div>
    <div>
      <p className="text-2xl font-bold text-white mb-1 tracking-tight">{value}</p>
      {description && <p className="text-xs text-white/40">{description}</p>}
    </div>
  </div>
);

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <DetailCard 
        icon={Sun} 
        label="UV Index" 
        value={data.uvIndex} 
        description={data.uvIndex > 5 ? "Use sun protection" : "Low risk"}
        colorClass="text-yellow-400"
      />
      <DetailCard 
        icon={Wind} 
        label="Wind" 
        value={`${data.wind.speed} km/h`} 
        description={`Direction: ${data.wind.deg}°`}
        colorClass="text-sky-400"
      />
      <DetailCard 
        icon={Droplets} 
        label="Humidity" 
        value={`${data.humidity}%`} 
        description={`Dew point is ${Math.round(data.temperature - 2)}° right now`}
        colorClass="text-blue-400"
      />
      <DetailCard 
        icon={Eye} 
        label="Visibility" 
        value={`${(data.visibility / 1000).toFixed(1)} km`} 
        description={data.visibility > 5000 ? "Clear view" : "Reduced visibility"}
        colorClass="text-emerald-400"
      />
      <DetailCard 
        icon={Gauge} 
        label="Pressure" 
        value={`${data.pressure} hPa`} 
        description="Atmospheric pressure"
        colorClass="text-purple-400"
      />
      <DetailCard 
        icon={Compass} 
        label="Feels Like" 
        value={`${Math.round(data.feels_like)}°`} 
        description="Similar to actual temperature"
        colorClass="text-orange-400"
      />
    </div>
  );
};

export default WeatherDetails;
