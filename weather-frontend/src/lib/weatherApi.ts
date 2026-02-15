import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/weather';

// Default location (Kathmandu)
export const DEFAULT_LOCATION = {
    name: 'Kathmandu, Nepal',
    lat: 27.7172,
    lon: 85.3240
};

// Weather mapping for Open-Meteo codes
const mapWeatherCode = (code: number): string => {
    if (code === 0) return 'Clear Sky';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 55) return 'Drizzle';
    if (code <= 65) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Rain Showers';
    if (code <= 86) return 'Snow Showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Cloudy';
};

// Backend API response structure
export interface WeatherData {
    city: string;
    country: string;
    temperature: number;
    description: string;
    wind: {
        speed: number;
        deg?: number;
    };
    clouds: {
        all: number;
    };
    humidity: number;
    pressure?: number;
    feels_like?: number;
    temp_min?: number;
    temp_max?: number;
    visibility?: number;
    sunrise?: string;
    sunset?: string;
}

export interface ForecastDay {
    date: string;
    temp_min: number;
    temp_max: number;
    description: string;
    icon: string;
}

export interface ForecastData {
    city: string;
    list: ForecastDay[];
}

export const fetchWeather = async (city: string = DEFAULT_LOCATION.name): Promise<WeatherData> => {
    // Call the backend API which now strictly queries the database
    const response = await axios.get(`http://localhost:5000/api/weather/city/fetch?city=${city}`, {
        timeout: 10000,
    });

    const data = response.data;

    if (!data) {
        throw new Error('No weather data found for this city.');
    }

    // Map backend DB format to Frontend UI format
    return {
        city: data.city,
        country: data.country,
        temperature: data.main.temp,
        description: data.weather[0].description,
        wind: {
            speed: data.wind.speed,
            deg: data.wind.deg
        },
        clouds: {
            all: data.clouds?.all || 0
        },
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        feels_like: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        visibility: data.visibility,
        sunrise: data.sys?.sunrise ? new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        sunset: data.sys?.sunset ? new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
    };
};

export const fetchForecast = async (city: string = DEFAULT_LOCATION.name): Promise<ForecastData> => {
    try {
        const response = await axios.get(`http://localhost:5000/api/forecast/city/fetch?city=${city}`, {
            timeout: 10000,
        });

        const data = response.data;

        // Backend now returns { city: string, list: [] } directly from DB
        const forecastList: ForecastDay[] = data.list.map((item: any) => ({
            date: new Date(item.date).toLocaleDateString(),
            temp_max: item.temperature, // Simplified for now, assuming DB has simpler structure or compatible one
            temp_min: item.temperature, // logic to separate min/max if DB stores them, otherwise update model
            description: item.description,
            icon: item.icon
        }));

        return {
            city: data.city,
            list: forecastList
        };
    } catch (error) {
        console.error('Error fetching forecast from backend:', error);
        throw error;
    }
};

// Helper function to get weather icon based on description
export const getWeatherIcon = (description: string): string => {
    const desc = description.toLowerCase();

    if (desc.includes('clear') || desc.includes('sunny')) return 'sun';
    if (desc.includes('cloud')) {
        if (desc.includes('partly') || desc.includes('few')) return 'cloud-sun';
        return 'cloud';
    }
    if (desc.includes('rain') || desc.includes('drizzle')) return 'cloud-rain';
    if (desc.includes('snow')) return 'snow';
    if (desc.includes('thunderstorm') || desc.includes('storm')) return 'zap';
    if (desc.includes('mist') || desc.includes('fog')) return 'cloud-fog';
    if (desc.includes('wind')) return 'wind';

    return 'cloud'; // default icon
};

// Helper function to get temperature in different units
export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
    if (unit === 'F') {
        return `${Math.round((temp * 9 / 5) + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
};

// Helper function to get wind direction
export const getWindDirection = (degrees?: number): string => {
    if (degrees === undefined) return 'N/A';

    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
};
