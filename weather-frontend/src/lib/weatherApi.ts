import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Default location (Kathmandu)
export const DEFAULT_LOCATION = {
    name: 'Kathmandu',
    lat: 27.7172,
    lon: 85.3240
};

export interface WeatherData {
    city: string;
    country: string;
    temperature: number;
    description: string;
    condition: 'Clear' | 'Clouds' | 'Rain' | 'Snow' | 'Thunderstorm' | 'Drizzle' | 'Mist' | string;
    wind: {
        speed: number;
        deg?: number;
    };
    clouds: {
        all: number;
    };
    humidity: number;
    pressure: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    visibility: number;
    uvIndex: number;
    sunrise: string;
    sunset: string;
}

export interface HourlyForecast {
    time: string;
    temp: number;
    condition: string;
    icon: string;
}

export interface DailyForecast {
    id: string; // Using ID for better React keys
    day: string;
    temp_min: number;
    temp_max: number;
    condition: string;
    icon: string;
}

export interface FullWeatherData extends WeatherData {
    hourly: HourlyForecast[];
    daily: DailyForecast[];
}

// Utility to format time from Unix timestamp or Date string
const formatTime = (timestamp: number | string | undefined): string => {
    if (!timestamp) return 'N/A';
    const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

interface BackendWeatherData {
    city: string;
    country?: string;
    main?: {
        temp: number;
        feels_like?: number;
        temp_min?: number;
        temp_max?: number;
        pressure?: number;
        humidity?: number;
    };
    weather?: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    wind?: {
        speed: number;
        deg?: number;
    };
    clouds?: {
        all: number;
    };
    sys?: {
        sunrise?: number;
        sunset?: number;
    };
    visibility?: number;
    uvIndex?: number;
}

interface BackendForecast {
    _id?: string;
    date: string;
    temperature: number;
    weather?: string;
    icon?: string;
}

// Map backend weather model to frontend interface
const mapWeatherData = (data: BackendWeatherData): WeatherData => {
    return {
        city: data.city,
        country: data.country || 'NP',
        temperature: data.main?.temp || 0,
        description: data.weather?.[0]?.description || 'N/A',
        condition: data.weather?.[0]?.main || 'Clear',
        wind: data.wind || { speed: 0 },
        clouds: data.clouds || { all: 0 },
        humidity: data.main?.humidity || 0,
        pressure: data.main?.pressure || 0,
        feels_like: data.main?.feels_like || 0,
        temp_min: data.main?.temp_min || 0,
        temp_max: data.main?.temp_max || 0,
        visibility: data.visibility || 10000,
        uvIndex: data.uvIndex || 0,
        sunrise: formatTime(data.sys?.sunrise),
        sunset: formatTime(data.sys?.sunset),
    };
};

export const fetchWeather = async (city: string = DEFAULT_LOCATION.name): Promise<FullWeatherData> => {
    try {
        const weatherRes = await axios.get<BackendWeatherData>(`${API_URL}/weather/${city}`);
        const forecastRes = await axios.get<{ list: BackendForecast[] }>(`${API_URL}/forecast/city/fetch?city=${city}`);
        
        const weatherData = mapWeatherData(weatherRes.data);
        
        const rawForecasts = forecastRes.data.list || [];
        
        const daily: DailyForecast[] = rawForecasts.map((f: BackendForecast) => ({
            id: f._id || Math.random().toString(),
            day: new Date(f.date).toLocaleDateString('en-US', { weekday: 'short' }),
            temp_min: f.temperature - 2,
            temp_max: f.temperature + 2,
            condition: f.weather || 'Clear',
            icon: f.icon || 'sun'
        })).slice(0, 7);

        // Derive hourly from current weather for visual parity
        const hourly: HourlyForecast[] = Array.from({ length: 8 }).map((_, i) => ({
            time: `${(new Date().getHours() + i) % 24}:00`,
            temp: weatherData.temperature + (Math.random() * 2 - 1),
            condition: weatherData.condition,
            icon: getWeatherIcon(weatherData.condition)
        }));

        return {
            ...weatherData,
            hourly,
            daily
        };
    } catch (error) {
        console.error("Error fetching weather from backend:", error);
        throw new Error("Could not fetch weather data from server.");
    }
};

export const getWeatherIcon = (condition: string): string => {
    const cond = condition.toLowerCase();
    if (cond.includes('clear')) return 'sun';
    if (cond.includes('cloud')) return 'cloud';
    if (cond.includes('rain')) return 'cloud-rain';
    if (cond.includes('snow')) return 'cloud-snow';
    if (cond.includes('storm')) return 'zap';
    return 'cloud';
};
