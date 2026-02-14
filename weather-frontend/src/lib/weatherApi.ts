import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/weather';

// Default location
export const DEFAULT_LOCATION = {
    name: 'Kathmandu, Nepal',
    lat: 27.7172,
    lon: 85.3240
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
    // Optional additional fields your backend might provide
    temp_min?: number;
    temp_max?: number;
    visibility?: number;
    sunrise?: string;
    sunset?: string;
}

export const fetchWeather = async (): Promise<WeatherData> => {
    try {
        const response = await axios.get(BASE_URL, {
            timeout: 10000, // 10 second timeout
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        // Backend returns an array, take the first item
        const data = response.data[0];
        
        if (!data) {
            throw new Error('No weather data received from backend');
        }
        
        return {
            city: data.city || 'Unknown',
            country: data.country || 'Unknown',
            temperature: data.main?.temp || 0,
            description: data.weather?.[0]?.description || 'Clear Weather',
            wind: {
                speed: data.wind?.speed || 0,
                deg: data.wind?.deg
            },
            clouds: {
                all: data.clouds?.all || 0
            },
            humidity: data.main?.humidity || 0,
            pressure: data.main?.pressure,
            feels_like: data.main?.feels_like || data.main?.temp,
            temp_min: data.main?.temp_min,
            temp_max: data.main?.temp_max,
            visibility: data.visibility,
            sunrise: data.sunrise,
            sunset: data.sunset
        };
    } catch (error) {
        console.error('Error fetching weather from backend:', error);
        
        // Return fallback data instead of throwing error
        return {
            city: 'Unknown',
            country: 'Unknown',
            temperature: 20,
            description: 'Weather data unavailable',
            wind: {
                speed: 0,
                deg: undefined
            },
            clouds: {
                all: 0
            },
            humidity: 0,
            pressure: undefined,
            feels_like: 20,
            temp_min: undefined,
            temp_max: undefined,
            visibility: undefined,
            sunrise: undefined,
            sunset: undefined
        };
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
        return `${Math.round((temp * 9/5) + 32)}°F`;
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
