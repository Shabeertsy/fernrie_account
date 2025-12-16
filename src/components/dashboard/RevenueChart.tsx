import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Card } from '../common/Card';

const data = [
    { name: 'Jan', amount: 240000 },
    { name: 'Feb', amount: 139800 },
    { name: 'Mar', amount: 980000 },
    { name: 'Apr', amount: 390800 },
    { name: 'May', amount: 480000 },
    { name: 'Jun', amount: 380000 },
    { name: 'Jul', amount: 430000 },
];

export const RevenueChart: React.FC = () => {
    return (
        <Card className="h-[250px] sm:h-[400px] flex flex-col p-4 sm:p-6">
            <div className="mb-2 sm:mb-6">
                <h3 className="text-sm sm:text-lg font-bold text-slate-900">Revenue</h3>
                <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">Monthly collection trends</p>
            </div>

            <div className="flex-1 w-full min-h-0 -ml-4 sm:ml-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                            tickMargin={10}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                            tickFormatter={(value) => `${value / 1000}k`}
                            width={35}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                fontSize: '12px',
                                padding: '8px 12px'
                            }}
                            formatter={(value: number) => [`₹${(value / 1000).toFixed(0)}k`, '']}
                            labelStyle={{ color: '#64748b', marginBottom: '2px' }}
                            cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorAmount)"
                            activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
