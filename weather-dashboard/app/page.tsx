"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const [city, setCity] = useState("Kathmandu");

  const handleSearch = () => {
    console.log("Search weather for:", city);
    // Later: fetch weather API here
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar city={city} setCity={setCity} onSearch={handleSearch} />

        {/* Dashboard Body */}
        <main className="p-6 overflow-auto flex-1">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              Weather Overview
            </h2>
            <p className="text-gray-500 mt-2">
              Select a city to see real-time weather data.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}