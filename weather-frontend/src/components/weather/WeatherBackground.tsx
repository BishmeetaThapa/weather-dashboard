'use client';

import React from 'react';

interface WeatherBackgroundProps {
  condition: string;
  isNight?: boolean;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ condition, isNight }) => {
  const getGradient = () => {
    if (isNight) return 'from-slate-900 via-blue-950 to-indigo-950';
    
    const cond = condition.toLowerCase();
    if (cond.includes('clear') || cond.includes('sun')) {
      return 'from-sky-400 via-blue-500 to-indigo-600';
    }
    if (cond.includes('cloud')) {
      return 'from-slate-400 via-gray-500 to-slate-600';
    }
    if (cond.includes('rain') || cond.includes('drizzle')) {
      return 'from-slate-700 via-blue-900 to-slate-900';
    }
    if (cond.includes('snow')) {
      return 'from-blue-100 via-slate-300 to-blue-200';
    }
    if (cond.includes('storm')) {
      return 'from-slate-800 via-purple-900 to-slate-950';
    }
    
    return 'from-sky-400 via-blue-500 to-indigo-600'; // Default
  };

  return (
    <div 
      className={`fixed inset-0 -z-10 bg-gradient-to-br ${getGradient()} transition-colors duration-1000`} 
    />
  );
};

export default WeatherBackground;
