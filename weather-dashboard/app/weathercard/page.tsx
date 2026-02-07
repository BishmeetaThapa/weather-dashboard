import { Sun } from "lucide-react";

export default function WeatherCard({
  city = "Kathmandu",
  temperature = 21,
  condition = "Partly Cloudy",
}) {
  const weatherData = {
    location: city,
    date: "Monday, 7 Feb, 2026",
    temperature,
    high: 23,
    low: 15,
    condition,
    feelsLike: 22,
    unit: "°C",
  };

  return (
    <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-2xl text-slate-100">
      
      {/* Location & Date */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {weatherData.location}
          </h2>
          <p className="text-sm text-slate-400">
            {weatherData.date}
          </p>
        </div>

        <div className="flex items-center bg-slate-800 rounded-full p-1 text-sm">
          <span className="px-2 font-semibold text-white">°C</span>
          <span className="px-2 text-slate-500">°F</span>
        </div>
      </div>

      {/* Temperature */}
      <div className="flex items-center justify-between my-6">
        <div>
          <p className="text-5xl font-extrabold text-blue-400">
            {weatherData.temperature}{weatherData.unit}
          </p>
          <p className="text-slate-300 mt-1">
            {weatherData.condition}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Feels like {weatherData.feelsLike}{weatherData.unit}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            H: {weatherData.high}{weatherData.unit} · L: {weatherData.low}{weatherData.unit}
          </p>
        </div>

        <div className="text-yellow-400 w-24 h-24 drop-shadow-lg">
          <Sun className="w-24 h-24" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-slate-400 text-sm mt-4">
        <div>
          <p className="uppercase tracking-wide text-xs">Wind</p>
          <p className="text-slate-200">12 km/h</p>
        </div>
        <div>
          <p className="uppercase tracking-wide text-xs">Humidity</p>
          <p className="text-slate-200">65%</p>
        </div>
        <div>
          <p className="uppercase tracking-wide text-xs">UV Index</p>
          <p className="text-slate-200">3</p>
        </div>
      </div>
    </div>
  );
}
