import React, { useState } from 'react';
import { 
    Search, 
    Plus, 
    Mail, 
    Phone, 
    Edit2, 
    MessageCircle, 
    UserPlus, 
    Briefcase, 
    PieChart, 
    Clock,
    Users,
    DollarSign
} from 'lucide-react';

interface Partner {
    id: string;
    name: string;
    role: string;
    type: 'Business' | 'Technical' | 'Financial';
    status: 'active' | 'inactive';
    email: string;
    phone: string;
    equity: string;
    joinedDate: string;
    avatar: string;
}

const Partners: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Mock data
    const [partners] = useState<Partner[]>([
        {
            id: '1',
            name: 'Sarah Wilson',
            role: 'Lead Investor',
            type: 'Financial',
            status: 'active',
            email: 'sarah.w@example.com',
            phone: '+91 98765 43210',
            equity: '35%',
            joinedDate: 'Jan 2023',
            avatar: 'S'
        },
        {
            id: '2',
            name: 'David Chen',
            role: 'Tech Advisor',
            type: 'Technical',
            status: 'active',
            email: 'david.c@example.com',
            phone: '+91 98765 43211',
            equity: '15%',
            joinedDate: 'Mar 2023',
            avatar: 'D'
        },
        {
            id: '3',
            name: 'Michael Ross',
            role: 'Operations Head',
            type: 'Business',
            status: 'inactive',
            email: 'michael.r@example.com',
            phone: '+91 98765 43212',
            equity: '10%',
            joinedDate: 'Jun 2023',
            avatar: 'M'
        },
        {
            id: '4',
            name: 'Emma Thompson',
            role: 'Marketing Dir',
            type: 'Business',
            status: 'active',
            email: 'emma.t@example.com',
            phone: '+91 98765 43213',
            equity: '20%',
            joinedDate: 'Aug 2023',
            avatar: 'E'
        }
    ]);



    const filteredPartners = partners.filter(partner => {
        const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || partner.type.toLowerCase() === filterType.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Partners</h1>
                    <p className="text-xs sm:text-base text-slate-500 mt-0.5">Manage your business partners</p>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm active:scale-95">
                        <UserPlus size={20} />
                        <span>Add Partner</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Total Partners</p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{partners.length}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="text-blue-600" size={16} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Active Deals</p>
                            <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">12</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Briefcase className="text-emerald-600" size={16} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Revenue Share</p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">₹4.5L</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <PieChart className="text-purple-600" size={16} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Pending</p>
                            <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">₹85k</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Clock className="text-amber-600" size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Floating Action Button */}
            <button className="fixed bottom-20 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center sm:hidden z-50 active:scale-95 hover:bg-emerald-700 transition-colors">
                <Plus size={24} />
            </button>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search partners..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 sm:py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                </div>
                 <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:flex-none">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white text-sm"
                        >
                            <option value="all">All Types</option>
                            <option value="financial">Financial</option>
                            <option value="technical">Technical</option>
                            <option value="business">Business</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {filteredPartners.map((partner) => (
                    <div key={partner.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-base sm:text-lg">
                                        {partner.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 leading-tight">{partner.name}</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 font-medium">{partner.role}</p>
                                </div>
                            </div>
                            <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-semibold border ${
                                partner.status === 'active'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}>
                                {partner.status}
                            </span>
                        </div>

                        <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                                <Mail size={14} className="text-slate-400" />
                                <span className="truncate">{partner.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                                <Phone size={14} className="text-slate-400" />
                                <span>{partner.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                                <DollarSign size={14} className="text-slate-400" />
                                <span>Equity: {partner.equity}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors active:scale-95">
                                <MessageCircle size={16} />
                                <span className="text-xs font-semibold">Message</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors active:scale-95">
                                <Edit2 size={16} />
                                <span className="text-xs font-semibold">Edit</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPartners.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <Plus className="mx-auto text-slate-300" size={48} />
                    <p className="text-slate-500 mt-2">No partners found</p>
                </div>
            )}
        </div>
    );
};

export default Partners;
