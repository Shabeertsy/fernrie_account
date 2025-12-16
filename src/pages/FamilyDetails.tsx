import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Users, Edit, Plus, Trash2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import type { Family } from '../types';

// Mock Data (In a real app, fetch based on ID)
const mockFamily: Family = {
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
    members: [
        { id: 101, name: 'Muhammed K.', gender: 'Male', dob: '1980-05-15', relationship: 'Head', education: 'Graduate', occupation: 'Business', status: 'Active' },
        { id: 102, name: 'Fathima', gender: 'Female', dob: '1985-08-20', relationship: 'Spouse', education: 'Graduate', occupation: 'Housewife', status: 'Active' },
        { id: 103, name: 'Ali', gender: 'Male', dob: '2010-02-10', relationship: 'Child', education: 'Student', occupation: 'Student', status: 'Active' },
    ]
};

const FamilyDetails: React.FC = () => {
    const { id } = useParams();
    console.log(id); // Suppress unused variable warning
    const navigate = useNavigate();
    const family = mockFamily; // Use mock data for now

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/families')}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{family.houseName}</h1>
                    <p className="text-slate-500 flex items-center gap-2 text-sm">
                        <Users size={14} />
                        Family ID: #{family.id}
                    </p>
                </div>
                <div className="ml-auto flex gap-3">
                    <Button variant="outline" icon={Edit}>Edit Family</Button>
                    <Button variant="danger" icon={Trash2}>Delete</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Family Info Card */}
                <Card className="lg:col-span-1 space-y-6 h-fit">
                    <div>
                        <h3 className="font-bold text-slate-900 mb-4">Family Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase">Head of Family</label>
                                <p className="font-medium text-slate-900">{family.headName}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase">Address</label>
                                <div className="flex items-start gap-2 mt-1">
                                    <MapPin size={16} className="text-slate-400 mt-0.5" />
                                    <p className="text-slate-700 text-sm">{family.address}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase">Contact</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Phone size={16} className="text-slate-400" />
                                    <p className="text-slate-700 text-sm">{family.primaryPhone}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase">Ward</label>
                                    <p className="text-slate-900 text-sm font-medium">{family.ward}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase">Ration Card</label>
                                    <p className="text-slate-900 text-sm font-medium">{family.rationCardType}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase">Category</label>
                                <div className="mt-1">
                                    <Badge variant={
                                        family.incomeCategory === 'High Income' ? 'info' :
                                            family.incomeCategory === 'Middle Income' ? 'warning' :
                                                family.incomeCategory === 'Low Income' ? 'success' : 'default'
                                    }>
                                        {family.incomeCategory}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Members List Card */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900">Family Members</h3>
                        <Button size="sm" icon={Plus}>Add Member</Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Relationship</th>
                                    <th className="px-4 py-3">Gender</th>
                                    <th className="px-4 py-3">Age</th>
                                    <th className="px-4 py-3">Occupation</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {family.members.map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-900">{member.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{member.relationship}</td>
                                        <td className="px-4 py-3 text-slate-600">{member.gender}</td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {new Date().getFullYear() - new Date(member.dob).getFullYear()}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{member.occupation}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={member.status === 'Active' ? 'success' : 'default'}>
                                                {member.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                                <Edit size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default FamilyDetails;
