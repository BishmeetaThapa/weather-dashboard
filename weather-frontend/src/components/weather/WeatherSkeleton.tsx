'use client';

import React from 'react';

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`} />
);

export const CurrentWeatherSkeleton = () => (
  <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8">
    <div className="flex flex-col md:flex-row justify-between gap-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-40" />
      </div>
      <div className="flex flex-col items-end gap-4">
        <Skeleton className="h-32 w-32 rounded-full" />
        <Skeleton className="h-6 w-48" />
      </div>
    </div>
    <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  </div>
);

export const HourlyForecastSkeleton = () => (
  <div className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 mb-8">
    <Skeleton className="h-4 w-32 mb-6" />
    <div className="flex gap-6 overflow-hidden">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="flex flex-col items-center min-w-[80px] space-y-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-6 w-10" />
        </div>
      ))}
    </div>
  </div>
);

export const WeeklyForecastSkeleton = () => (
  <div className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6">
    <Skeleton className="h-4 w-32 mb-6" />
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <Skeleton key={i} className="h-12 w-full rounded-2xl" />
      ))}
    </div>
  </div>
);

const WeatherSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <Skeleton className="h-12 max-w-md mx-auto mb-8 rounded-2xl" />
    <CurrentWeatherSkeleton />
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-8">
        <HourlyForecastSkeleton />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-32 w-full rounded-3xl" />
          ))}
        </div>
      </div>
      <div className="md:col-span-4">
        <WeeklyForecastSkeleton />
      </div>
    </div>
  </div>
);

export default WeatherSkeleton;
