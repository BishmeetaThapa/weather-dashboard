"use client";

import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface MainLayoutProps {
    children: React.ReactNode;
    pageTitle?: string;
}

export function MainLayout({ children, pageTitle = "Dashboard" }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50/50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Navbar title={pageTitle} />
                <main className="p-8 pb-12">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
