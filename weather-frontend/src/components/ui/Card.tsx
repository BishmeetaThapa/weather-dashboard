import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Card({ className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200",
                className
            )}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }: CardProps) {
    return <div className={cn("p-6 pb-2", className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardProps) {
    return (
        <h3
            className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
            {...props}
        />
    );
}

export function CardContent({ className, ...props }: CardProps) {
    return <div className={cn("p-6 pt-0", className)} {...props} />;
}
