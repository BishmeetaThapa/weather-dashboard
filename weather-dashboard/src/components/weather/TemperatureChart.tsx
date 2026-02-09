"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            backgroundColor: '#1e293b',
            padding: 12,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            cornerRadius: 8,
            displayColors: false,
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: '#94a3b8',
                font: { size: 12 },
            },
            border: {
                display: false,
            },
        },
        y: {
            grid: {
                color: '#f1f5f9',
            },
            ticks: {
                color: '#94a3b8',
                font: { size: 12 },
                callback: (value) => `${value}°`,
            },
            border: {
                display: false,
            },
        },
    },
    elements: {
        line: {
            tension: 0.4,
        },
        point: {
            radius: 0,
            hoverRadius: 6,
            hoverBackgroundColor: '#2563eb',
            hoverBorderColor: '#fff',
            hoverBorderWidth: 2,
        },
    },
};

interface TemperatureChartProps {
    labels?: string[];
    data?: number[];
    title?: string;
}

export function TemperatureChart({
    labels = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM', '3AM'],
    data = [18, 22, 28, 30, 26, 21, 19, 17],
    title = "Temperature Trends"
}: TemperatureChartProps) {
    const chartData = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Temperature',
                data,
                borderColor: '#2563eb',
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.1)');
                    gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
                    return gradient;
                },
                borderWidth: 3,
            },
        ],
    };

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{title}</CardTitle>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                    <span className="text-sm font-medium text-gray-500">Today</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <Line options={options} data={chartData} />
                </div>
            </CardContent>
        </Card>
    );
}
