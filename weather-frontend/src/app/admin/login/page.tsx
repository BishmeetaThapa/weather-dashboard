"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/apiClient";
import WeatherBackground from "@/components/weather/WeatherBackground";
import { Shield, Lock, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await authService.login(password);

    if (result.success && result.token) {
      localStorage.setItem("admin_token", result.token);
      router.push("/admin");
    } else {
      setError(result.message || "Access Denied");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      <WeatherBackground condition="Clear" isNight={true} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="premium-card p-10 space-y-8">
          <header className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary/20 rounded-[2rem] mx-auto flex items-center justify-center border border-primary/20 shadow-xl shadow-primary/10">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white uppercase">SkyCast Control</h1>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mt-2">Administrative Node Access</p>
            </div>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Security Credential</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Passcode..."
                  className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-white placeholder:text-white/10"
                  required
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 font-bold text-xs"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Authenticating...
                </>
              ) : (
                <>
                  Establish Connection
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <footer className="text-center pt-4">
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Enforced Security Protocol 9.4.1</p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
