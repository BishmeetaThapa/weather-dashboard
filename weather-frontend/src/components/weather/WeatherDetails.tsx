"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Droplets, Wind, Sun, Cloud, Thermometer, Eye } from "lucide-react";

import { WeatherData } from "@/lib/weatherApi";

interface WeatherDetailsProps {
  weatherData?: WeatherData | null;
}

export default function WeatherDetails({ weatherData }: WeatherDetailsProps) {
  if (!weatherData) {
    return (
      <Card className="bg-gray-800/20 backdrop-blur-xl border border-gray-700/40 rounded-3xl">
        <CardContent className="p-6 text-center">
          <p className="text-white/60 font-bold">No weather details available</p>
        </CardContent>
      </Card>
    );
  }

  const details = [
    {
      title: "Humidity",
      value: weatherData.humidity ?? "--",
      unit: "%",
      icon: Droplets,
      bg: "bg-blue-500/20",
      color: "text-blue-400",
    },
    {
      title: "Wind Speed",
      value: weatherData.wind?.speed ?? "--",
      unit: "km/h",
      icon: Wind,
      bg: "bg-cyan-500/20",
      color: "text-cyan-400",
    },
    {
      title: "Cloud Cover",
      value: weatherData.clouds?.all ?? "--",
      unit: "%",
      icon: Cloud,
      bg: "bg-purple-500/20",
      color: "text-purple-400",
    },
    {
      title: "UV Index",
      value: weatherData.uvIndex ?? "--",
      unit: "",
      icon: Sun,
      bg: "bg-amber-500/20",
      color: "text-amber-400",
    },
    {
      title: "Pressure",
      value: weatherData.pressure ?? "--",
      unit: "hPa",
      icon: Thermometer,
      bg: "bg-rose-500/20",
      color: "text-rose-400",
    },
    {
      title: "Visibility",
      value: weatherData.visibility ? (weatherData.visibility / 1000).toFixed(1) : "--",
      unit: "km",
      icon: Eye,
      bg: "bg-indigo-500/20",
      color: "text-indigo-400",
    },
  ];

  return (
    <Card className="bg-gray-800/20 backdrop-blur-xl border border-gray-700/40 rounded-3xl">
      <CardContent className="p-6">
        <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-6">
          Weather Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {details.map((detail, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className={`p-2 rounded-xl ${detail.bg} w-fit mb-3`}>
                <detail.icon className={`w-4 h-4 ${detail.color}`} />
              </div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-wider">
                {detail.title}
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-white">{detail.value}</span>
                <span className="text-xs font-medium text-white/60">{detail.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
