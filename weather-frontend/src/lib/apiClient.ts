import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
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
        return response.data;
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

export default apiClient;

