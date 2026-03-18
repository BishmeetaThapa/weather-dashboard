"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  User,
  Bell,
  Shield,
  Globe,
  Lock,
  Trash2,
  RefreshCw,
  MapPin,
} from "lucide-react";

interface UserSettings {
  fullName: string;
  email: string;
  location: string;
  temperatureUnit: string;
  windSpeedUnit: string;
  timeFormat: string;
  language: string;
  timezone: string;
  weatherAlerts: boolean;
  dailySummary: boolean;
}

const defaultSettings: UserSettings = {
  fullName: "Guest User",
  email: "guest@example.com",
  location: "Kathmandu, Nepal",
  temperatureUnit: "Celsius (°C)",
  windSpeedUnit: "KM/H",
  timeFormat: "24-HOUR",
  language: "English",
  timezone: "Asia/Kathmandu",
  weatherAlerts: true,
  dailySummary: true,
};

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Hindi",
  "Nepali",
];

const timezones = [
  { value: "Pacific/Midway", label: "Midway Island (UTC-11)" },
  { value: "Pacific/Honolulu", label: "Hawaii (UTC-10)" },
  { value: "America/Anchorage", label: "Alaska (UTC-9)" },
  { value: "America/Los_Angeles", label: "Pacific Time (UTC-8)" },
  { value: "America/Denver", label: "Mountain Time (UTC-7)" },
  { value: "America/Chicago", label: "Central Time (UTC-6)" },
  { value: "America/New_York", label: "Eastern Time (UTC-5)" },
  { value: "America/Caracas", label: "Caracas (UTC-4)" },
  { value: "America/Sao_Paulo", label: "Brasilia (UTC-3)" },
  { value: "Atlantic/South_Georgia", label: "Mid-Atlantic (UTC-2)" },
  { value: "Europe/London", label: "London (UTC+0)" },
  { value: "Europe/Paris", label: "Paris (UTC+1)" },
  { value: "Europe/Athens", label: "Athens (UTC+2)" },
  { value: "Europe/Moscow", label: "Moscow (UTC+3)" },
  { value: "Asia/Dubai", label: "Dubai (UTC+4)" },
  { value: "Asia/Kolkata", label: "Mumbai (UTC+5:30)" },
  { value: "Asia/Kathmandu", label: "Kathmandu (UTC+5:45)" },
  { value: "Asia/Dhaka", label: "Dhaka (UTC+6)" },
  { value: "Asia/Bangkok", label: "Bangkok (UTC+7)" },
  { value: "Asia/Singapore", label: "Singapore (UTC+8)" },
  { value: "Asia/Shanghai", label: "Shanghai (UTC+8)" },
  { value: "Asia/Tokyo", label: "Tokyo (UTC+9)" },
  { value: "Asia/Seoul", label: "Seoul (UTC+9)" },
  { value: "Australia/Sydney", label: "Sydney (UTC+10)" },
  { value: "Pacific/Auckland", label: "Auckland (UTC+12)" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    setLoading(true);
    setError(null);

    try {
      // Save to localStorage
      localStorage.setItem("userSettings", JSON.stringify(settings));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleResetAuth = () => {
    if (confirm("Are you sure you want to reset the authentication matrix? This action cannot be undone.")) {
      setLoading(true);
      setTimeout(() => {
        setSuccess(true);
        setSuccess(false);
        setLoading(false);
      }, 1000);
    }
  };

  const handleDeactivate = () => {
    if (confirm("Are you sure you want to deactivate this node? All local data will be deleted.")) {
      setLoading(true);
      // Clear all local storage
      localStorage.clear();
      setSettings(defaultSettings);
      setTimeout(() => {
        setSuccess(true);
        setSuccess(false);
        setLoading(false);
      }, 1000);
    }
  };

  const toggleSetting = (key: keyof UserSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleInputChange = (key: keyof UserSettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <MainLayout pageTitle="Settings">
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="font-sans text-white space-y-10">

          {success && (
            <div className="bg-primary/20 text-white p-6 rounded-3xl border border-primary/30 font-black text-xs uppercase tracking-widest animate-in fade-in slide-in-from-top-6 shadow-2xl shadow-primary/20">
              System Configuration Synchronized Successfully
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 text-white p-6 rounded-3xl border border-red-500/30 font-black text-xs uppercase tracking-widest animate-in fade-in slide-in-from-top-6">
              {error}
            </div>
          )}

          {/* Profile Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-black tracking-tighter uppercase">Identity Matrix</h2>
            </div>
            <Card className="bg-gray-800/20 backdrop-blur-xl border border-gray-700/40 rounded-3xl shadow-md">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary shadow-lg shadow-primary/10 group-hover:rotate-6 transition-transform duration-500">
                      <User className="w-12 h-12" />
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/60 uppercase tracking-widest px-1">
                        Full Name
                      </label>
                      <Input
                        value={settings.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="bg-gray-900/20 border border-gray-700/40 text-white focus:ring-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/60 uppercase tracking-widest px-1">
                        Email Address
                      </label>
                      <Input
                        value={settings.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        type="email"
                        className="bg-gray-900/20 border border-gray-700/40 text-white focus:ring-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/60 uppercase tracking-widest px-1">
                        Location Node
                      </label>
                      <Input
                        value={settings.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="bg-gray-900/20 border border-gray-700/40 text-white focus:ring-primary/50"
                      />
                    </div>
                    <div className="space-y-2 text-right flex items-end justify-end">
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Language & Region */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-black tracking-tighter uppercase">Language & Region</h2>
            </div>
            <Card className="bg-gray-800/20 backdrop-blur-xl border border-gray-700/40 rounded-3xl shadow-md">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-widest px-1">
                      Interface Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleInputChange("language", e.target.value)}
                      className="w-full h-12 px-5 rounded-2xl border border-gray-700/40 bg-gray-900/20 text-xs font-bold text-white focus:ring-2 focus:ring-purple-500/50 outline-none appearance-none transition-all"
                    >
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-widest px-1">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleInputChange("timezone", e.target.value)}
                      className="w-full h-12 px-5 rounded-2xl border border-gray-700/40 bg-gray-900/20 text-xs font-bold text-white focus:ring-2 focus:ring-purple-500/50 outline-none appearance-none transition-all"
                    >
                      {timezones.map((tz) => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Units & Region */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-black tracking-tighter uppercase">Geographic & Scalar Matrix</h2>
            </div>
            <Card className="bg-gray-800/20 backdrop-blur-xl border border-gray-700/40 rounded-3xl shadow-md">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-widest px-1">
                      Ambient Temperature Unit
                    </label>
                    <select
                      value={settings.temperatureUnit}
                      onChange={(e) => handleInputChange("temperatureUnit", e.target.value)}
                      className="w-full h-12 px-5 rounded-2xl border border-gray-700/40 bg-gray-900/20 text-xs font-bold text-white focus:ring-2 focus:ring-primary/50 outline-none appearance-none transition-all"
                    >
                      <option>Celsius (°C)</option>
                      <option>Fahrenheit (°F)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-widest px-1">
                      Atmospheric Velocity
                    </label>
                    <select
                      value={settings.windSpeedUnit}
                      onChange={(e) => handleInputChange("windSpeedUnit", e.target.value)}
                      className="w-full h-12 px-5 rounded-2xl border border-gray-700/40 bg-gray-900/20 text-xs font-bold text-white focus:ring-2 focus:ring-primary/50 outline-none appearance-none transition-all"
                    >
                      <option>KM/H</option>
                      <option>MPH</option>
                      <option>M/S</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-widest px-1">
                      Temporal Format
                    </label>
                    <select
                      value={settings.timeFormat}
                      onChange={(e) => handleInputChange("timeFormat", e.target.value)}
                      className="w-full h-12 px-5 rounded-2xl border border-gray-700/40 bg-gray-900/20 text-xs font-bold text-white focus:ring-2 focus:ring-primary/50 outline-none appearance-none transition-all"
                    >
                      <option>24-HOUR</option>
                      <option>12-HOUR (AM/PM)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Alerts & Security */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section className="space-y-6">
              <div className="flex items-center gap-3 px-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-black tracking-tighter uppercase">Alert Vector</h2>
              </div>
              <Card className="bg-gray-800/20 backdrop-blur-xl border border-gray-700/40 rounded-3xl shadow-md">
                <CardContent className="p-6 space-y-6">
                  {/* Weather Alerts Toggle */}
                  <div
                    className="flex items-center justify-between group/toggle cursor-pointer"
                    onClick={() => toggleSetting("weatherAlerts")}
                  >
                    <div>
                      <p className="text-xs font-black text-white/60 uppercase tracking-widest">Weather Alerts</p>
                      <p className="text-[10px] text-white/50 font-bold uppercase tracking-tighter mt-1">Critical weather warnings</p>
                    </div>
                    <div className={`h-7 w-12 rounded-full relative cursor-pointer border transition-all ${settings.weatherAlerts ? 'bg-primary border-primary' : 'bg-gray-700 border-gray-600'}`}>
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${settings.weatherAlerts ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>

                  {/* Daily Summary Toggle */}
                  <div
                    className="flex items-center justify-between group/toggle cursor-pointer"
                    onClick={() => toggleSetting("dailySummary")}
                  >
                    <div>
                      <p className="text-xs font-black text-white/60 uppercase tracking-widest">Daily Summary</p>
                      <p className="text-[10px] text-white/50 font-bold uppercase tracking-tighter mt-1">Morning forecast digest</p>
                    </div>
                    <div className={`h-7 w-12 rounded-full relative cursor-pointer border transition-all ${settings.dailySummary ? 'bg-primary border-primary' : 'bg-gray-700 border-gray-600'}`}>
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${settings.dailySummary ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 px-3">
                <div className="p-2 bg-rose-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-black tracking-tighter uppercase">Security Protocol</h2>
              </div>
              <Card className="bg-gray-800/20 backdrop-blur-xl border border-gray-700/40 rounded-3xl shadow-md">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-900/20 rounded-lg">
                        <Lock className="w-4 h-4 text-white/60" />
                      </div>
                      <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Multi-Factor Auth</span>
                    </div>
                    <span className="text-[10px] font-black text-white/60 bg-gray-900/20 px-3 py-1.5 rounded-xl uppercase border border-white/10">Active</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl font-black uppercase text-[10px] tracking-widest h-11"
                    onClick={handleResetAuth}
                    disabled={loading}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Authentication Matrix
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Danger Zone */}
          <Card className="bg-gray-900/10 border border-gray-700/40 mt-10 rounded-3xl">
            <CardContent className="p-8 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em]">Critical Termination Zone</p>
                <p className="text-xs text-white/60 font-medium italic">Geographic data nodes and identities cannot be deleted in standard observer mode.</p>
              </div>
              <Button
                variant="outline"
                className="text-rose-400 border-rose-500/20 hover:bg-rose-500/10 rounded-xl font-black uppercase text-[10px] tracking-widest px-8"
                onClick={handleDeactivate}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deactivate Node
              </Button>
            </CardContent>
          </Card>

        </div>
      </main>
    </MainLayout>
  );
}
