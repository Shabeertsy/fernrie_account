import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, MoreVertical, Download } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import type { Family } from '../types';

// Mock Data
const mockFamilies: Family[] = [
    {
        id: 1,
        headName: 'Muhammed K.',
        houseName: 'Darul Aman',
        address: 'Main Road, Athyodi',
        ward: 'Ward 1',
        primaryPhone: '+91 98765 43210',
        incomeCategory: 'Low Income',
        housingType: 'Own House',
        rationCardType: 'APL',
        status: 'Active',
        members: []
    },
    {
        id: 2,
        headName: 'Abdulla P.',
        houseName: 'Patteri House',
        address: 'Beach Road, Athyodi',
        ward: 'Ward 2',
        primaryPhone: '+91 98765 43211',
        incomeCategory: 'Middle Income',
        housingType: 'Own House',
        rationCardType: 'APL',
        status: 'Active',
        members: []
    },
    {
        id: 3,
        headName: 'Hassan S.',
        houseName: 'Sea View',
        address: 'West Coast, Athyodi',
        ward: 'Ward 1',
        primaryPhone: '+91 98765 43212',
        incomeCategory: 'Exempted',
        housingType: 'Rented',
        rationCardType: 'BPL',
        status: 'Inactive',
        members: []
    },
    {
        id: 4,
        headName: 'Ibrahim K.',
        houseName: 'Kallu Valappil',
        address: 'East Side, Athyodi',
        ward: 'Ward 3',
        primaryPhone: '+91 98765 43213',
        incomeCategory: 'High Income',
        housingType: 'Own House',
        rationCardType: 'APL',
        status: 'Active',
        members: []
    },
    {
        id: 5,
        headName: 'Yusuf M.',
        houseName: 'Manzil',
        address: 'Near Mosque, Athyodi',
        ward: 'Ward 2',
        primaryPhone: '+91 98765 43214',
        incomeCategory: 'Middle Income',
        housingType: 'Own House',
        rationCardType: 'APL',
        status: 'Active',
        members: []
    },
];

const Families: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFamilies = mockFamilies.filter(family =>
        family.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.houseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.primaryPhone.includes(searchTerm)
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Families Management</h1>
                    <p className="text-slate-500 mt-1">Manage family records and memberships.</p>
                </div>
                <Button icon={Plus}>Add Family</Button>
            </div>

            <Card className="overflow-hidden border-0 shadow-lg">
                <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, house, or phone..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="outline" size="sm" icon={Filter}>Filter</Button>
                        <Button variant="outline" size="sm" icon={Download}>Export</Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Head of Family</th>
                                <th className="px-6 py-4">House Name</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Ward</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredFamilies.map((family) => (
                                <tr
                                    key={family.id}
                                    onClick={() => navigate(`/families/${family.id}`)}
                                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-900 group-hover:text-emerald-600 transition-colors">
                                        {family.headName}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{family.houseName}</td>
                                    <td className="px-6 py-4 text-slate-600">{family.primaryPhone}</td>
                                    <td className="px-6 py-4 text-slate-600">{family.ward}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={
                                            family.incomeCategory === 'High Income' ? 'info' :
                                                family.incomeCategory === 'Middle Income' ? 'warning' :
                                                    family.incomeCategory === 'Low Income' ? 'success' : 'default'
                                        }>
                                            {family.incomeCategory}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={family.status === 'Active' ? 'success' : 'error'}>
                                            {family.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); }}
                                            className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-sm text-slate-500">
                    <span>Showing {filteredFamilies.length} of {mockFamilies.length} families</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-white">Next</button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Families;
