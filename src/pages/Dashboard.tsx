import React from 'react';
import { Users, DollarSign, TrendingUp, Receipt, Plus, Download, FileText, CheckSquare, ArrowRight } from 'lucide-react';
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
    return (
        <div className="space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
            {/* Mobile Header Compact */}
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

            {/* Compact Grid for Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>
                <div>
                    <MemberDistributionChart />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Recent Transactions - Compact Mobile List */}
                <Card className="lg:col-span-2 p-0 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg">Recent Transactions</h3>
                        <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {[
                            { name: 'ABC Corp', desc: 'INV-001', amount: '+₹1.5L', time: '2h', expense: false, initial: 'AB' },
                            { name: 'XYZ Ltd', desc: 'INV-002', amount: '+₹2.0L', time: '5h', expense: false, initial: 'XY' },
                            { name: 'Tech Sol', desc: 'INV-003', amount: '+₹1.8L', time: '1d', expense: false, initial: 'TS' },
                            { name: 'Digital', desc: 'Software', amount: '-₹75K', time: '1d', expense: true, initial: 'DS' },
                            { name: 'Mktg Inc', desc: 'SEO Svc', amount: '+₹95K', time: '2d', expense: false, initial: 'MI' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors active:bg-slate-50">
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
                    <div className="p-3 border-t border-slate-100 text-center lg:hidden">
                        <button className="text-emerald-600 text-xs font-medium flex items-center justify-center gap-1">
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
