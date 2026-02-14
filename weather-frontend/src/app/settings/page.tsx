"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const [unit, setUnit] = useState('Celsius (°C)');
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <MainLayout pageTitle="Account Settings">
      <div className="max-w-4xl space-y-8">
        {success && (
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100 font-medium text-sm animate-in fade-in slide-in-from-top-4">
            Settings saved successfully!
          </div>
        )}

        {/* Profile Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <User className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
          </div>
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="w-12 h-12" />
                  </div>
                  {/* TODO: Add profile picture upload when auth is re-implemented */}
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <Input defaultValue="Guest User" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <Input defaultValue="guest@example.com" type="email" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Location</label>
                    <Input defaultValue="Kathmandu, Nepal" />
                  </div>
                  <div className="space-y-2 text-right flex items-end justify-end">
                    {/* TODO: Enable profile editing when auth is re-implemented */}
                    <Button onClick={handleSave} disabled>Save Changes</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Units & Region */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Globe className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">Region & Units</h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Temperature Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>Celsius (°C)</option>
                    <option>Fahrenheit (°F)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Wind Speed</label>
                  <select className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>km/h</option>
                    <option>mph</option>
                    <option>m/s</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Time Format</label>
                  <select className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>24-hour</option>
                    <option>12-hour (AM/PM)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Notifications & Security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Bell className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-6">
                {[
                  { label: 'Weather Alerts', desc: 'Critical weather warnings' },
                  { label: 'Daily Summary', desc: 'Morning forecast digest' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <div className="h-6 w-11 bg-blue-600 rounded-full relative cursor-pointer">
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Shield className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-bold text-gray-900">Security</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* TODO: Re-implement security features when auth is added back */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">Two-Factor Auth</span>
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">Not Available</span>
                </div>
                <Button variant="outline" className="w-full" disabled>Change Password</Button>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Danger Zone */}
        {/* TODO: Re-implement account deletion when auth is added back */}
        <Card className="border-gray-100 bg-gray-50/30">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-600">Account Management</p>
              <p className="text-xs text-gray-500">Account features will be available when authentication is re-implemented</p>
            </div>
            <Button variant="outline" className="text-gray-600 border-gray-200" disabled>Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}