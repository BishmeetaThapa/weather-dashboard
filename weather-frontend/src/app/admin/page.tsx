"use client";

import { useEffect, useState, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { weatherService, locationService, hourlyForecastService, Location } from "@/lib/apiClient";
import {
  Shield,
  Search,
  Edit3,
  Trash2,
  Plus,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  Database,
  MapPin,
  CloudRain,
  Activity,
  Wind,
  Droplets,
  LogOut,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type TabType = 'infrastructure' | 'locations' | 'hourly';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('infrastructure');
  const [weatherList, setWeatherList] = useState<any[]>([]);
  const [locationsList, setLocationsList] = useState<Location[]>([]);
  const [hourlyForecastsList, setHourlyForecastsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNewNodeModalOpen, setIsNewNodeModalOpen] = useState(false);

  const [newNodeForm, setNewNodeForm] = useState({
    city: "",
    country: "",
    temperature: "20",
    feels_like: "18",
    humidity: "45",
    wind_speed: "10",
    pressure: "1012",
    condition: "Clear",
    description: "Clear Sky",
    icon: "01d",
    lat: "27.7",
    lon: "85.3"
  });

  const weatherOptions = [
    { value: "Clear", label: "Clear Sky", icon: "01d" },
    { value: "Clouds", label: "Cloudy", icon: "04d" },
    { value: "Rain", label: "Rainy", icon: "10d" },
    { value: "Drizzle", label: "Drizzle", icon: "09d" },
    { value: "Thunderstorm", label: "Thunderstorm", icon: "11d" },
    { value: "Snow", label: "Snow", icon: "13d" },
    { value: "Mist", label: "Mist", icon: "50d" },
    { value: "Fog", label: "Fog", icon: "50d" },
  ];

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [weather, locations, hourlyForecasts] = await Promise.all([
        weatherService.getWeatherData(),
        locationService.getLocations(),
        hourlyForecastService.getHourlyForecasts()
      ]);
      setWeatherList(weather);
      setLocationsList(locations);
      setHourlyForecastsList(hourlyForecasts);
    } catch (err: any) {
      console.error("Failed to load admin data:", err);
      setError("Failed to sync with data server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- CRUD Handlers ---

  const handleDelete = async (type: TabType, id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type} record?`)) return;
    try {
      if (type === 'infrastructure') await weatherService.deleteWeatherData(id);
      if (type === 'locations') await locationService.deleteLocation(id);
      if (type === 'hourly') await hourlyForecastService.deleteHourlyForecast(id);

      loadData();
    } catch (err) {
      setError(`Failed to terminate ${type} node.`);
    }
  };

  const handleEdit = (type: TabType, item: any) => {
    setEditingId(item._id || item.id);
    if (type === 'infrastructure') {
      setEditForm({
        temp: item.main.temp,
        main: item.weather[0].main,
        description: item.weather[0].description
      });
    } else if (type === 'locations') {
      setEditForm({
        name: item.name,
        lat: item.lat,
        lon: item.lon,
        region: item.region
      });
    }
  };

  const handleSaveEdit = async (type: TabType, id: string) => {
    try {
      if (type === 'infrastructure') {
        const original = weatherList.find(w => w._id === id);
        const updated = {
          ...original,
          main: { ...original.main, temp: parseFloat(editForm.temp) },
          weather: [{ ...original.weather[0], main: editForm.main, description: editForm.description }]
        };
        await weatherService.updateWeatherData(id, updated);
      } else if (type === 'locations') {
        await locationService.updateLocation(id, editForm);
      }

      setEditingId(null);
      loadData();
    } catch (err) {
      setError("Failed to commit updates to node.");
    }
  };

  const handleInitializeNode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Cascade creation
      await locationService.addLocation({
        name: newNodeForm.city,
        lat: parseFloat(newNodeForm.lat),
        lon: parseFloat(newNodeForm.lon),
        region: newNodeForm.country
      });

      await weatherService.createWeatherData({
        city: newNodeForm.city,
        country: newNodeForm.country,
        coordinates: { lat: parseFloat(newNodeForm.lat), lon: parseFloat(newNodeForm.lon) },
        weather: [{ id: 800, main: newNodeForm.condition, description: newNodeForm.description, icon: newNodeForm.icon }],
        main: {
          temp: parseFloat(newNodeForm.temperature),
          feels_like: parseFloat(newNodeForm.feels_like),
          temp_min: parseFloat(newNodeForm.temperature) - 5,
          temp_max: parseFloat(newNodeForm.temperature) + 5,
          pressure: parseFloat(newNodeForm.pressure),
          humidity: parseFloat(newNodeForm.humidity)
        },
        wind: { speed: parseFloat(newNodeForm.wind_speed), deg: 180 },
        dt: Math.floor(Date.now() / 1000),
        cod: 200
      });

      // Note: Hourly forecast data is automatically fetched from OpenWeatherMap by the backend

      setIsNewNodeModalOpen(false);
      loadData();
    } catch (err) {
      setError("Cascade node initialization failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
    }
  };

  const filteredItems: Record<TabType, any[]> = {
    infrastructure: weatherList.filter(w => w.city.toLowerCase().includes(searchQuery.toLowerCase())),
    locations: locationsList.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase())),
    hourly: hourlyForecastsList.filter(h => h.city?.toLowerCase().includes(searchQuery.toLowerCase()))
  };

  return (
    <MainLayout pageTitle="Admin Dashboard">
      <div className="relative z-10 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <Shield size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Admin Dashboard</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Data Management</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewNodeModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black transition-all shadow-lg shadow-primary/20 uppercase text-[10px] tracking-widest"
            >
              <Plus size={18} />
              Add New Location
            </button>
            <button
              onClick={loadData}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleLogout}
              className="p-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-2xl transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] w-fit">
          {[
            { id: 'infrastructure', label: 'Real-time (Weather)', icon: Activity },
            { id: 'locations', label: 'Registry (Locations)', icon: MapPin },
            { id: 'hourly', label: 'Hourly Forecasts', icon: Clock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as TabType); setEditingId(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-sm"
          />
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 font-bold text-sm animate-pulse">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Data Lists */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredItems[activeTab].map((item: any) => (
              <motion.div
                key={item._id || item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="premium-card">
                  <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    {/* View/Edit Context Selection based on Tab */}
                    {activeTab === 'infrastructure' && renderInfrastructureItem(item)}
                    {activeTab === 'locations' && renderLocationItem(item)}
                    {activeTab === 'hourly' && renderHourlyItem(item)}

                    {/* Generic Action Buttons */}
                    <div className="flex items-center gap-3">
                      {editingId === (item._id || item.id) ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(activeTab, item._id || item.id)}
                            className="p-3 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20 rounded-xl transition-all"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-3 bg-white/5 text-white/40 hover:bg-white/10 rounded-xl transition-all"
                          >
                            <X size={20} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(activeTab, item)}
                            className="p-3 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(activeTab, item._id || item.id)}
                            className="p-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredItems[activeTab].length === 0 && !loading && (
            <div className="py-20 text-center space-y-4 bg-white/5 border-2 border-dashed border-white/10 rounded-[3rem]">
              <Database size={48} className="mx-auto text-white/10" />
              <p className="text-white/40 font-black uppercase tracking-widest text-sm">No {activeTab} records found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Node Initialization Modal */}
      <NewNodeModal
        isOpen={isNewNodeModalOpen}
        onClose={() => setIsNewNodeModalOpen(false)}
        onAdd={handleInitializeNode}
        form={newNodeForm}
        setForm={setNewNodeForm}
        loading={loading}
      />
    </MainLayout>
  );

  // --- Render Helpers ---

  function renderInfrastructureItem(item: any) {
    const isEditing = editingId === item._id;
    return (
      <>
        <div className="flex items-center gap-6 flex-1">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Activity className="text-sky-400/50" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white">{item.city}</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">{item.country}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 flex-[2]">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Temp (°C)</label>
                <input type="number" value={editForm.temp} onChange={(e) => setEditForm({ ...editForm, temp: e.target.value })} className="admin-input" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Main</label>
                <input type="text" value={editForm.main} onChange={(e) => setEditForm({ ...editForm, main: e.target.value })} className="admin-input" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Desc</label>
                <input type="text" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="admin-input" />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Temperature</p>
                <p className="text-2xl font-black text-white">{Math.round(item.main.temp)}°C</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Condition</p>
                <p className="text-xl font-bold text-primary">{item.weather?.[0]?.main || "Unknown"}</p>
              </div>
              <div className="space-y-1 hide-on-mobile lg:block">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Description</p>
                <p className="text-xs font-semibold text-white/40 italic">{item.weather?.[0]?.description}</p>
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  function renderLocationItem(item: Location) {
    const isEditing = editingId === item.id;
    return (
      <>
        <div className="flex items-center gap-6 flex-1">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <MapPin className="text-emerald-400/50" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white">{item.name}</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">{item.region}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-8 flex-1">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Latitude</label>
                <input type="number" value={editForm.lat} onChange={(e) => setEditForm({ ...editForm, lat: e.target.value })} className="admin-input" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Longitude</label>
                <input type="number" value={editForm.lon} onChange={(e) => setEditForm({ ...editForm, lon: e.target.value })} className="admin-input" />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Coordinates</p>
                <p className="text-sm font-bold text-white/60 font-mono tracking-tighter">{item.lat.toFixed(4)}, {item.lon.toFixed(4)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Status</p>
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Registered</p>
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  function renderHourlyItem(item: any) {
    const isEditing = editingId === item._id;
    const hour = item.hour !== undefined ? `${item.hour}:00` : 'N/A';
    const date = item.date ? new Date(item.date).toLocaleDateString() : 'N/A';
    return (
      <>
        <div className="flex items-center gap-6 flex-1">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Clock className="text-purple-400/50" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white">{item.city}</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">{date} at {hour}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 flex-[2]">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Temp</label>
                <input type="number" value={editForm.temperature} onChange={(e) => setEditForm({ ...editForm, temperature: e.target.value })} className="admin-input" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Condition</label>
                <input type="text" value={editForm.condition} onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })} className="admin-input" />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Temperature</p>
                <p className="text-2xl font-black text-white">{Math.round(item.temperature)}°C</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Feels Like</p>
                <p className="text-xl font-bold text-white/60">{Math.round(item.feels_like)}°C</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Condition</p>
                <p className="text-sm font-bold text-purple-400">{item.condition}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Humidity</p>
                <p className="text-sm font-bold text-white/60">{item.humidity}%</p>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}

function NewNodeModal({ isOpen, onClose, onAdd, form, setForm, loading }: any) {
  const weatherOptions = [
    { value: "Clear", label: "Clear Sky", icon: "01d" },
    { value: "Clouds", label: "Cloudy", icon: "04d" },
    { value: "Rain", label: "Rainy", icon: "10d" },
    { value: "Drizzle", label: "Drizzle", icon: "09d" },
    { value: "Thunderstorm", label: "Thunderstorm", icon: "11d" },
    { value: "Snow", label: "Snow", icon: "13d" },
    { value: "Mist", label: "Mist", icon: "50d" },
    { value: "Fog", label: "Fog", icon: "50d" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl premium-card p-10 space-y-8 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
          >
            <header className="flex items-center justify-between border-b border-white/5 pb-6">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Add New Location</h2>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mt-2">Comprehensive Data Registry</p>
              </div>
              <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </header>

            <form onSubmit={onAdd} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Location Name</label>
                  <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City Name" className="admin-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Region/Country</label>
                  <input type="text" required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="State/ISO" className="admin-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Condition</label>
                  <select value={form.condition} onChange={(e) => {
                    const selected = weatherOptions.find(opt => opt.value === e.target.value);
                    setForm({
                      ...form,
                      condition: e.target.value,
                      description: selected?.label || "Clear Sky",
                      icon: selected?.icon || "01d"
                    });
                  }} className="admin-input">
                    {weatherOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Current Temp (°C)</label>
                  <input type="number" required value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} className="admin-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Feels Like (°C)</label>
                  <input type="number" required value={form.feels_like} onChange={(e) => setForm({ ...form, feels_like: e.target.value })} className="admin-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Humidity (%)</label>
                  <input type="number" required value={form.humidity} onChange={(e) => setForm({ ...form, humidity: e.target.value })} className="admin-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Wind Speed (km/h)</label>
                  <input type="number" required value={form.wind_speed} onChange={(e) => setForm({ ...form, wind_speed: e.target.value })} className="admin-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Pressure (hPa)</label>
                  <input type="number" required value={form.pressure} onChange={(e) => setForm({ ...form, pressure: e.target.value })} className="admin-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Latitude</label>
                  <input type="text" required value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} className="admin-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Longitude</label>
                  <input type="text" required value={form.lon} onChange={(e) => setForm({ ...form, lon: e.target.value })} className="admin-input" />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="flex-1 py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-lg shadow-primary/20 uppercase tracking-widest text-[10px]">
                  {loading ? "Saving Details..." : "Save Location"}
                </button>
                <button type="button" onClick={onClose} className="flex-1 py-4 bg-white/5 text-white/40 hover:text-white font-black rounded-2xl uppercase tracking-widest text-[10px]">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
