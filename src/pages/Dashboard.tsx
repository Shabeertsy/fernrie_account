import React from 'react';
import { 
    Users, DollarSign, TrendingUp, Receipt, Plus, Download, FileText, CheckSquare, ArrowRight,
    ArrowUp, ArrowDown
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { MemberDistributionChart } from '../components/dashboard/MemberDistributionChart';

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-transparent hover:border-l-emerald-500 p-4 sm:p-6">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={`p-2 sm:p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon size={18} className={`sm:w-6 sm:h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
        <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
            <span className="text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                <TrendingUp size={12} />
                {change}
            </span>
            <span className="text-slate-400 ml-2">vs last month</span>
        </div>
    </Card>
);

const Dashboard: React.FC = () => {
    // Data for Charts
    const cashFlowData = [
        { name: 'Income', value: 65 },
        { name: 'Expense', value: 35 },
    ];
    const CASHFLOW_COLORS = ['#10b981', '#ef4444']; // Emerald for Income, Red for Expense

    const transactions = [
        { name: 'ABC Corp', desc: 'INV-001', amount: '+₹1.5L', time: '2h', expense: false, initial: 'AB' },
        { name: 'XYZ Ltd', desc: 'INV-002', amount: '+₹2.0L', time: '5h', expense: false, initial: 'XY' },
        { name: 'Tech Sol', desc: 'INV-003', amount: '+₹1.8L', time: '1d', expense: false, initial: 'TS' },
        { name: 'Digital', desc: 'Software', amount: '-₹75K', time: '1d', expense: true, initial: 'DS' },
        { name: 'Mktg Inc', desc: 'SEO Svc', amount: '+₹95K', time: '2d', expense: false, initial: 'MI' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 sm:pb-4">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-xs sm:text-base text-slate-500 mt-0.5">Welcome back, here's what's happening.</p>
                </div>
                <div className="hidden sm:flex gap-3">
                    <Button variant="outline" icon={Download}>Export</Button>
                    <Button icon={Plus}>New Invoice</Button>
                </div>
            </div>

            {/* Mobile: Main Revenue Card (Styled like "Total Balance") */}
            <div className="sm:hidden">
                <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none p-6 relative overflow-hidden shadow-xl shadow-emerald-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900 rounded-full blur-3xl opacity-20 -ml-16 -mb-16"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-emerald-100 mb-1">
                            <span className="text-sm font-medium">Total Revenue</span>
                            <TrendingUp size={14} />
                        </div>
                        <h2 className="text-4xl font-bold mb-8">₹8.5L</h2>

                        <div className="grid grid-cols-4 gap-2">
                            <div className="flex flex-col items-center gap-2">
                                <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors text-white">
                                    <Receipt size={20} />
                                </button>
                                <span className="text-[10px] text-emerald-50 font-medium">Invoice</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors text-white">
                                    <Users size={20} />
                                </button>
                                <span className="text-[10px] text-emerald-50 font-medium">Client</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors text-white">
                                    <FileText size={20} />
                                </button>
                                <span className="text-[10px] text-emerald-50 font-medium">Partner</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors text-white">
                                    <CheckSquare size={20} />
                                </button>
                                <span className="text-[10px] text-emerald-50 font-medium">Task</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Mobile: Secondary Stats Grid */}
            <div className="grid grid-cols-3 gap-3 sm:hidden">
                <Card className="p-3 bg-white border-slate-100 flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-slate-500 mb-1">Clients</span>
                    <span className="text-lg font-bold text-slate-900">42</span>
                    <span className="text-[10px] text-emerald-600">+5 new</span>
                </Card>
                <Card className="p-3 bg-white border-slate-100 flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-slate-500 mb-1">Pending</span>
                    <span className="text-lg font-bold text-slate-900">12</span>
                    <span className="text-[10px] text-amber-600">-3 tasks</span>
                </Card>
                <Card className="p-3 bg-white border-slate-100 flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-slate-500 mb-1">Partners</span>
                    <span className="text-lg font-bold text-slate-900">8</span>
                    <span className="text-[10px] text-emerald-600">+2 new</span>
                </Card>
            </div>

            {/* Mobile: Analysis/Graph Card (Styled like "Spending") */}
            <div className="sm:hidden">
                <Card className="bg-white border-slate-100 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm mb-1">Income vs Expense</p>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">₹12.5L</h3>
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5 w-fit">
                                <span className="text-emerald-600">😎</span>
                                <span className="text-[10px] text-emerald-700 font-medium">Net Profit: ₹5.0L</span>
                            </div>
                        </div>
                        <div className="w-24 h-24 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={cashFlowData}
                                        innerRadius={25}
                                        outerRadius={40}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {cashFlowData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={CASHFLOW_COLORS[index % CASHFLOW_COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center hole color to match card bg */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-8 h-8 rounded-full bg-white"></div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
                            <ArrowUp size={16} className="rotate-45 text-emerald-600" />
                            Income
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 text-red-700 text-sm font-medium border border-red-100">
                            <ArrowDown size={16} className="rotate-45 text-red-600" />
                            Expense
                        </button>
                    </div>
                </Card>
            </div>

            {/* Desktop: Stats Grid */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <StatCard
                    title="Clients"
                    value="42"
                    change="+5"
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Revenue"
                    value="₹8.5L"
                    change="+12%"
                    icon={DollarSign}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Pending"
                    value="12"
                    change="-3"
                    icon={Receipt}
                    color="bg-amber-500"
                />
                <StatCard
                    title="Partners"
                    value="8"
                    change="+2"
                    icon={Users}
                    color="bg-violet-500"
                />
            </div>

            {/* Desktop: Charts Section */}
            <div className="hidden sm:grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>
                <div>
                    <MemberDistributionChart />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Recent Transactions - List */}
                <Card className="lg:col-span-2 p-0 overflow-hidden border-none sm:border-solid sm:border-slate-100 shadow-none sm:shadow-sm bg-transparent sm:bg-white">
                    <div className="p-0 sm:p-6 sm:border-b border-slate-100 flex items-center justify-between mb-4 sm:mb-0">
                        <h3 className="font-bold text-slate-900 text-lg">Recent Transactions</h3>
                        <Button variant="ghost" size="sm" className="text-xs hidden sm:flex">View All</Button>
                    </div>
                    <div className="divide-y divide-slate-100 space-y-3 sm:space-y-0">
                        {transactions.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl sm:rounded-none border border-slate-100 sm:border-none shadow-sm sm:shadow-none">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${item.expense ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'} flex items-center justify-center text-xs font-bold`}>
                                        {item.initial}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-sm ${item.expense ? 'text-red-600' : 'text-emerald-600'}`}>{item.amount}</p>
                                    <p className="text-xs text-slate-400">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 text-center lg:hidden mt-2">
                        <button className="text-emerald-600 text-xs font-medium flex items-center justify-center gap-1 w-full">
                            Show More Transactions <ArrowRight size={12} />
                        </button>
                    </div>
                </Card>

                {/* Desktop Quick Actions (Hidden on Mobile) */}
                <div className="space-y-6 hidden lg:block">
                    <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none">
                        <h3 className="font-bold text-lg mb-2">Quick Actions</h3>
                        <p className="text-emerald-100 text-sm mb-6">Common tasks you perform often.</p>
                        <div className="space-y-3">
                            <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium transition-colors flex items-center justify-between group">
                                <span>Create Invoice</span>
                                <Receipt size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium transition-colors flex items-center justify-between group">
                                <span>Add Client</span>
                                <Users size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium transition-colors flex items-center justify-between group">
                                <span>Add Partner</span>
                                <FileText size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium transition-colors flex items-center justify-between group">
                                <span>Add Task</span>
                                <CheckSquare size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
