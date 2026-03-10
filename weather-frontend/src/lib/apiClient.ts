import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export interface Location {
    id: string;
    name: string;
    lat: number;
    lon: number;
    region?: string;
}

export const locationService = {
    getLocations: async (): Promise<Location[]> => {
        const response = await apiClient.get('/locations');
        return response.data.map((loc: any) => ({
            ...loc,
            id: loc._id || loc.id
        }));
    },

    addLocation: async (location: Omit<Location, 'id'>): Promise<Location> => {
        const response = await apiClient.post('/locations', location);
        return response.data;
    },

    updateLocation: async (id: string, location: Partial<Location>): Promise<Location> => {
        const response = await apiClient.put(`/locations/${id}`, location);
        return response.data;
    },

    deleteLocation: async (id: string): Promise<void> => {
        await apiClient.delete(`/locations/${id}`);
    },
};

export const weatherService = {
    getWeatherData: async (lat?: number, lon?: number): Promise<any[]> => {
        let url = '/weather';
        if (lat !== undefined && lon !== undefined) {
            url += `?lat=${lat}&lon=${lon}`;
        }
        const response = await apiClient.get(url);
        return response.data;
    },

    updateWeatherData: async (id: string, data: any): Promise<void> => {
        await apiClient.put(`/weather/${id}`, data);
    },

    createWeatherData: async (data: any): Promise<void> => {
        await apiClient.post('/weather', data);
    },

    deleteWeatherData: async (id: string): Promise<void> => {
        await apiClient.delete(`/weather/${id}`);
    }
};

export const forecastService = {
    getForecasts: async (): Promise<any[]> => {
        const response = await apiClient.get('/forecast');
        return response.data;
    },

    getForecastData: async (city: string): Promise<any[]> => {
        const response = await apiClient.get(`/forecast/${city}`);
        return response.data;
    },

    createForecast: async (data: any): Promise<void> => {
        await apiClient.post('/forecast', data);
    },

    updateForecast: async (id: string, data: any): Promise<void> => {
        await apiClient.put(`/forecast/${id}`, data);
    },

    deleteForecast: async (id: string): Promise<void> => {
        await apiClient.delete(`/forecast/${id}`);
    }
};

export const authService = {
    login: async (password: string): Promise<{ success: boolean; token?: string; message?: string }> => {
        try {
            const response = await apiClient.post('/auth/login', { password });
            return response.data;
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Authentication Failed" 
            };
        }
    }
};

export default apiClient;

