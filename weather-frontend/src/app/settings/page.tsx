"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import WeatherBackground from "@/components/weather/WeatherBackground";
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

  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour <= 6;

  return (
    <MainLayout pageTitle="Account Settings">
      <WeatherBackground condition="Clear" isNight={isNight} />
      <div className="relative z-10 max-w-4xl space-y-8">
        {success && (
          <div className="bg-accent/10 text-accent p-6 rounded-[2rem] border border-accent/20 font-black text-xs uppercase tracking-widest animate-in fade-in slide-in-from-top-6 shadow-2xl shadow-accent/10">
            System Configuration Synchronized Successfully
          </div>
        )}

        {/* Profile Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-black text-foreground tracking-tighter uppercase">Identity Matrix</h2>
          </div>
          <Card className="premium-card">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary shadow-lg shadow-primary/10 group-hover:rotate-6 transition-transform duration-500">
                    <User className="w-12 h-12" />
                  </div>
                  {/* TODO: Add profile picture upload when auth is re-implemented */}
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Full Name</label>
                    <Input defaultValue="Guest User" disabled className="bg-white/5 border-white/10 opacity-60" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Email Address</label>
                    <Input defaultValue="guest@example.com" type="email" disabled className="bg-white/5 border-white/10 opacity-60" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Location Node</label>
                    <Input defaultValue="Kathmandu, Nepal" className="bg-white/5 border-white/10 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-2 text-right flex items-end justify-end">
                    {/* TODO: Enable profile editing when auth is re-implemented */}
                    <Button onClick={handleSave} disabled className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8">Save Changes</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Units & Region */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Globe className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-xl font-black text-foreground tracking-tighter uppercase">Geographic & Scalar Matrix</h2>
          </div>
          <Card className="premium-card">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Ambient Temperature Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full h-12 px-5 rounded-2xl border border-white/10 bg-white/5 text-xs font-bold focus:ring-2 focus:ring-primary/50 outline-none text-foreground appearance-none transition-all"
                  >
                    <option>Celsius (°C)</option>
                    <option>Fahrenheit (°F)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Atmospheric Velocity</label>
                  <select className="w-full h-12 px-5 rounded-2xl border border-white/10 bg-white/5 text-xs font-bold focus:ring-2 focus:ring-primary/50 outline-none text-foreground appearance-none transition-all">
                    <option>KM/H</option>
                    <option>MPH</option>
                    <option>M/S</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Temporal Format</label>
                  <select className="w-full h-12 px-5 rounded-2xl border border-white/10 bg-white/5 text-xs font-bold focus:ring-2 focus:ring-primary/50 outline-none text-foreground appearance-none transition-all">
                    <option>24-HOUR</option>
                    <option>12-HOUR (AM/PM)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Notifications & Security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Bell className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-black text-foreground tracking-tighter uppercase">Alert Vector</h2>
            </div>
            <Card className="premium-card">
              <CardContent className="p-6 space-y-6">
                {[
                  { label: 'Weather Alerts', desc: 'Critical weather warnings' },
                  { label: 'Daily Summary', desc: 'Morning forecast digest' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between group/toggle">
                    <div>
                      <p className="text-xs font-black text-foreground uppercase tracking-widest">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">{item.desc}</p>
                    </div>
                    <div className="h-7 w-12 bg-primary/20 rounded-full relative cursor-pointer border border-primary/20 transition-all group-hover/toggle:bg-primary/30">
                      <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 px-3">
              <div className="p-2 bg-rose-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-rose-400" />
              </div>
              <h2 className="text-xl font-black text-foreground tracking-tighter uppercase">Security Protocol</h2>
            </div>
            <Card className="premium-card">
              <CardContent className="p-6 space-y-6">
                {/* TODO: Re-implement security features when auth is added back */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Multi-Factor Auth</span>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground bg-white/10 px-3 py-1.5 rounded-xl uppercase border border-white/5">Locked</span>
                </div>
                <Button variant="outline" className="w-full rounded-xl font-black uppercase text-[10px] tracking-widest h-11" disabled>Reset Authentication Matrix</Button>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Danger Zone */}
        {/* TODO: Re-implement account deletion when auth is added back */}
        <Card className="border-white/5 bg-white/[0.02] mt-10 rounded-[2rem]">
          <CardContent className="p-8 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em]">Critical Termination Zone</p>
              <p className="text-xs text-muted-foreground font-medium italic">Geographic data nodes and identities cannot be deleted in standard observer mode.</p>
            </div>
            <Button variant="outline" className="text-rose-400 border-rose-500/20 hover:bg-rose-500/10 rounded-xl font-black uppercase text-[10px] tracking-widest px-8" disabled>Deactivate Node</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}