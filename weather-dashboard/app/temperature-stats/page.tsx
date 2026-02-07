// app/temperature-stats/page.tsx
"use client";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface ForecastData {
  dt_txt: string;
  main: { temp: number };
}

export default function TemperatureStats({
  city = "Kathmandu",
  units = "metric",
}: {
  city?: string;
  units?: string;
}) {
  // Mock 7-day forecast
  const [forecast] = useState<ForecastData[]>([
    { dt_txt: "2026-02-07 12:00:00", main: { temp: 22 } },
    { dt_txt: "2026-02-08 12:00:00", main: { temp: 24 } },
    { dt_txt: "2026-02-09 12:00:00", main: { temp: 23 } },
    { dt_txt: "2026-02-10 12:00:00", main: { temp: 21 } },
    { dt_txt: "2026-02-11 12:00:00", main: { temp: 25 } },
    { dt_txt: "2026-02-12 12:00:00", main: { temp: 26 } },
    { dt_txt: "2026-02-13 12:00:00", main: { temp: 24 } },
  ]);

  // Prepare chart data
  const chartData = {
    labels: forecast.map((f) =>
      new Date(f.dt_txt).toLocaleDateString("en-GB", { weekday: "short" })
    ),
    datasets: [
      {
        label: `Temperature (${units === "metric" ? "°C" : "°F"})`,
        data: forecast.map((f) => f.main.temp),
        fill: true, // gradient fill
        backgroundColor: "rgba(59, 130, 246, 0.2)", // light blue fill
        borderColor: "#3B82F6",
        tension: 0.4,
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#ffffff",
        pointHoverRadius: 7,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#3B82F6",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 8,
      },
      title: {
        display: true,
        text: `7-Day Temperature Forecast for ${city}`,
        color: "#1e293b",
        font: { size: 20, weight: "600" },
        padding: { top: 10, bottom: 20 },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value: number) {
            return `${value}°`;
          },
          color: "#1e293b",
        },
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
      x: {
        ticks: { color: "#1e293b", font: { weight: "500" } },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/30 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}