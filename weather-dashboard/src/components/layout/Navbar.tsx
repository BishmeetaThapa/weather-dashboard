"use client";

import { useState } from "react";
import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface NavbarProps {
    title: string;
}

export function Navbar({ title }: NavbarProps) {
    const [search, setSearch] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            console.log("Searching for city:", search);
            // In a real app, this could navigate to /dashboard?city=search or triggger a global state update
            setSearch("");
        }
    };

    return (
        <header className="h-20 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>

            <div className="flex items-center gap-6">
                <form onSubmit={handleSearch} className="relative w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search city..."
                        className="pl-10 h-10 bg-gray-50/50 border-transparent focus:bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>

                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

                    <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-xs font-semibold text-gray-900 leading-none">Guest User</p>
                            <p className="text-[10px] text-gray-500 leading-tight">Demo Mode</p>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
}
