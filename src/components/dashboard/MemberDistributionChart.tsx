import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import { Card } from '../common/Card';

const data = [
    { name: 'Low Income', value: 400 },
    { name: 'Middle Income', value: 300 },
    { name: 'High Income', value: 100 },
    { name: 'Exempted', value: 50 },
];

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

export const MemberDistributionChart: React.FC = () => {
    return (
        <Card className="h-[400px] flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Member Distribution</h3>
                <p className="text-sm text-slate-500">Families by income category</p>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => <span className="text-slate-600 text-sm font-medium ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
