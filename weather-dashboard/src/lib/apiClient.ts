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

// Fallback mock data for demo purposes
const MOCK_LOCATIONS: Location[] = [
    { id: '1', name: "Kathmandu", region: "Bagmati", lat: 27.7172, lon: 85.3240 },
    { id: '2', name: "Pokhara", region: "Gandaki", lat: 28.2096, lon: 83.9856 },
    { id: '3', name: "Paton", region: "Bagmati", lat: 27.671, lon: 85.324 },
];

export const locationService = {
    getLocations: async (): Promise<Location[]> => {
        try {
            const response = await apiClient.get('/locations');
            return response.data;
        } catch (error) {
            console.warn("Backend unreachable, using mock data for locations.");
            return MOCK_LOCATIONS;
        }
    },

    addLocation: async (location: Omit<Location, 'id'>): Promise<Location> => {
        try {
            const response = await apiClient.post('/locations', location);
            return response.data;
        } catch (error) {
            console.warn("Backend unreachable, simulating add location locally.");
            return { ...location, id: Math.random().toString() };
        }
    },

    updateLocation: async (id: string, location: Partial<Location>): Promise<Location> => {
        try {
            const response = await apiClient.put(`/locations/${id}`, location);
            return response.data;
        } catch (error) {
            console.warn("Backend unreachable, simulating update locally.");
            return { id, name: "", lat: 0, lon: 0, ...location } as Location;
        }
    },

    deleteLocation: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/locations/${id}`);
        } catch (error) {
            console.warn("Backend unreachable, simulating delete locally.");
        }
    },
};

export default apiClient;
