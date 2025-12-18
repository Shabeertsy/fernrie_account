import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Plus,
    Briefcase,
    PieChart,
    Clock,
    Users,
    Loader2
} from 'lucide-react';
import { partnersAPI } from '../api/partners';
import type { Partner } from '../types';

const Partners: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartners = async () => {
            setLoading(true);
            try {
                const data = await partnersAPI.getPartners();
                setPartners(data);
            } catch (error) {
                console.error('Failed to fetch partners:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    const filteredPartners = partners.filter(partner => {
        const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase());
        // Note: API Partner type doesn't have 'type' field, so we'll skip type filtering for now
        return matchesSearch;
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

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="animate-spin text-emerald-600" size={32} />
                </div>
            )}

            {/* Partners Grid (Desktop) */}
            {!loading && (
                <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {filteredPartners.map((partner) => (
                        <div
                            key={partner.id}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/partners/${partner.id}`)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-base sm:text-lg">
                                            {partner.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 leading-tight">{partner.name}</h3>
                                        <p className="text-xs sm:text-sm text-slate-500 font-medium">Email: {partner.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Mobile List View */}
            {!loading && (
                <div className="space-y-3 sm:hidden">
                    {filteredPartners.map((partner) => (
                        <div
                            key={partner.id}
                            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate(`/partners/${partner.id}`)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                                    <span className="font-bold text-lg">{partner.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{partner.name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                        <span>Email: {partner.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredPartners.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <Plus className="mx-auto text-slate-300" size={48} />
                    <p className="text-slate-500 mt-2">No partners found</p>
                </div>
            )}
        </div>
    );
};

export default Partners;
