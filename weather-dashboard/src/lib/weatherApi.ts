import axios from 'axios';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// Kathmandu coordinates
export const DEFAULT_LOCATION = {
    name: 'Kathmandu, Nepal',
    lat: 27.7172,
    lon: 85.3240
};

export interface WeatherData {
    current: {
        temp: number;
        humidity: number;
        windSpeed: number;
        precipitation: number;
        condition: string;
        feelsLike: number;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weather_code: number[];
    };
}

export const fetchWeather = async (lat: number = DEFAULT_LOCATION.lat, lon: number = DEFAULT_LOCATION.lon): Promise<WeatherData> => {
    const response = await axios.get(BASE_URL, {
        params: {
            latitude: lat,
            longitude: lon,
            hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
            current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code',
            timezone: 'auto'
        }
    });

    const { current, hourly, daily } = response.data;

    // Simple mapping for weather codes to conditions (can be expanded)
    const getCondition = (code: number) => {
        if (code === 0) return 'Clear Sky';
        if (code <= 3) return 'Partly Cloudy';
        if (code <= 67) return 'Rainy';
        if (code <= 77) return 'Snowy';
        if (code <= 99) return 'Thunderstorm';
        return 'Cloudy';
    };

    return {
        current: {
            temp: current.temperature_2m,
            humidity: current.relative_humidity_2m,
            windSpeed: current.wind_speed_10m,
            precipitation: current.precipitation,
            condition: getCondition(current.weather_code),
            feelsLike: current.temperature_2m, // Simplified
        },
        hourly: {
            time: hourly.time.slice(0, 24),
            temperature_2m: hourly.temperature_2m.slice(0, 24),
        },
        daily: {
            time: daily.time,
            temperature_2m_max: daily.temperature_2m_max,
            temperature_2m_min: daily.temperature_2m_min,
            weather_code: daily.weather_code,
        }
    };
};

export const getWeatherIcon = (code: number) => {
    // Logic to return icon names or URLs based on Open-Meteo codes
    if (code === 0) return 'sun';
    if (code <= 3) return 'cloud-sun';
    if (code <= 67) return 'cloud-rain';
    return 'cloud';
};
