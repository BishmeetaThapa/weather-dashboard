"use client";

import { User } from "lucide-react";

interface NavbarProps {
    title: string;
}

export function Navbar({ title }: NavbarProps) {
    return (
        <header className="h-20 border-b border-border bg-background/30 backdrop-blur-xl sticky top-0 z-30 px-8 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
                <button className="flex items-center gap-3 p-1.5 pr-3 rounded-xl border border-border hover:bg-white/5 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-xs font-bold text-foreground leading-none">Guest User</p>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-1 uppercase tracking-wider">Demo Mode</p>
                    </div>
                </button>
            </div>
        </header>
    );
}
