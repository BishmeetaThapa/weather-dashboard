"use client";

import { CloudSun, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-white/20 backdrop-blur-md border-t border-white/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-2 text-gray-800">
          <CloudSun className="text-blue-600" size={22} />
          <span className="font-semibold">
            Weather Dashboard
          </span>
          <span className="text-sm text-gray-500">
            © {new Date().getFullYear()}
          </span>
        </div>

        {/* Center: Info */}
        <p className="text-sm text-gray-600 text-center">
          Real-time weather insights powered by modern web technologies
        </p>

        {/* Right: Social / Links */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="p-2 rounded-lg bg-white/30 hover:bg-white/40 transition-all duration-300"
            aria-label="GitHub"
          >
            <Github size={18} className="text-gray-800" />
          </a>
          <a
            href="#"
            className="p-2 rounded-lg bg-white/30 hover:bg-white/40 transition-all duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} className="text-gray-800" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;