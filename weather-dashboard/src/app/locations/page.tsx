"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { MapPin, Sun, Cloud, CloudRain, Navigation, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { locationService, Location } from "@/lib/apiClient";
import { LocationModal } from "@/components/weather/LocationModal";

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadLocations();
    }, []);

    const loadLocations = async () => {
        try {
            const data = await locationService.getLocations();
            setLocations(data);
        } catch (error) {
            console.error("Failed to load locations:", error);
            // Fallback/Mock for local demo if backend is not yet running
            if (locations.length === 0) {
                setLocations([
                    { id: '1', name: "Kathmandu", region: "Bagmati", lat: 27.7172, lon: 85.3240 },
                    { id: '2', name: "Pokhara", region: "Gandaki", lat: 28.2096, lon: 83.9856 }
                ]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddLocation = async (name: string) => {
        try {
            // In a real app, we'd geocode the name first
            const newLoc = await locationService.addLocation({
                name,
                lat: 27.7, // Mock lat
                lon: 85.3, // Mock lon
                region: "Nepal"
            });
            setLocations([...locations, newLoc]);
        } catch (error) {
            console.error("Failed to add location:", error);
            // Local optimistic update for UI demo
            const mockLoc: Location = {
                id: Math.random().toString(),
                name,
                lat: 27.7,
                lon: 85.3,
                region: "Added Location"
            };
            setLocations([...locations, mockLoc]);
        }
    };

    const handleDeleteLocation = async (id: string) => {
        try {
            await locationService.deleteLocation(id);
            setLocations(locations.filter(l => l.id !== id));
        } catch (error) {
            console.error("Failed to delete location:", error);
            // Local update for UI demo
            setLocations(locations.filter(l => l.id !== id));
        }
    };

    return (
        <MainLayout pageTitle="Weather Locations">
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-gray-900">Tracked Locations</h2>
                        <p className="text-sm text-gray-500">Manage cities you want to track across your dashboard.</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Navigation className="w-4 h-4 mr-2" />
                        Add New City
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {locations.length === 0 ? (
                            <Card className="col-span-full border-dashed border-2 py-20 bg-gray-50/50">
                                <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                        <MapPin className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-900">No locations tracked yet</p>
                                        <p className="text-sm text-gray-500">Add your first city to see weather updates here.</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                                        Add Now
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            locations.map((city) => (
                                <Card key={city.id} className="group hover:border-blue-200 transition-all cursor-pointer overflow-hidden relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteLocation(city.id);
                                        }}
                                        className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 transition-all z-10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <CardContent className="p-0">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between pr-8">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-blue-500 transition-colors">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="text-xs font-bold uppercase tracking-widest">{city.region || "NEPAL"}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900">{city.name}</h3>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-3xl font-black text-gray-900">28°</p>
                                                    <p className="text-xs font-semibold text-gray-500">Sunny</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-6 py-3 bg-gray-50 flex items-center justify-between group-hover:bg-blue-50 transition-colors">
                                            <span className="text-sm font-medium text-gray-500">Current Temperature</span>
                                            <Sun className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>

            <LocationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddLocation}
            />
        </MainLayout>
    );
}
