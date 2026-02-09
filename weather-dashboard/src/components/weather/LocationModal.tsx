"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X } from "lucide-react";

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string) => void;
}

export function LocationModal({ isOpen, onClose, onAdd }: LocationModalProps) {
    const [cityName, setCityName] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cityName.trim()) {
            onAdd(cityName.trim());
            setCityName("");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Add New Location</CardTitle>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </CardHeader>
                <CardContent className="pt-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">City Name</label>
                            <Input
                                placeholder="e.g. Pokhara, Nepal"
                                value={cityName}
                                onChange={(e) => setCityName(e.target.value)}
                                autoFocus
                            />
                            <p className="text-xs text-gray-500">Enter a city to start tracking its weather data.</p>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit">Track Location</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
