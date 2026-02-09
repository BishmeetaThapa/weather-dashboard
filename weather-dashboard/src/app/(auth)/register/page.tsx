"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Cloud } from "lucide-react";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-2 pt-10">
                    <div className="mx-auto bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <Cloud className="text-white w-7 h-7" />
                    </div>
                    <CardTitle className="text-2xl pt-2">Create Account</CardTitle>
                    <p className="text-gray-500 text-sm">Start your weather tracking journey</p>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 pb-10">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="name">
                                Full Name
                            </label>
                            <Input id="name" placeholder="John Doe" type="text" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="email">
                                Email Address
                            </label>
                            <Input id="email" placeholder="name@example.com" type="email" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="password">
                                Password
                            </label>
                            <Input id="password" placeholder="••••••••" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="confirm">
                                Confirm Password
                            </label>
                            <Input id="confirm" placeholder="••••••••" type="password" required />
                        </div>
                    </div>
                    <Button className="w-full" size="lg">
                        Create Account
                    </Button>
                    <div className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
