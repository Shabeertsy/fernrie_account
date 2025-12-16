import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';

const PublicRegistration: React.FC = () => {
    const [members, setMembers] = useState([{ id: 1 }]);

    const addMember = () => {
        setMembers([...members, { id: Date.now() }]);
    };

    const removeMember = (id: number) => {
        if (members.length > 1) {
            setMembers(members.filter(m => m.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                        <span className="text-white font-bold text-3xl">A</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Family Registration</h1>
                    <p className="text-slate-500 mt-2">Athyodi Juma Masjid Mahallu Committee</p>
                </div>

                <form className="space-y-8">
                    {/* Family Details Section */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm mr-3">1</span>
                            Family Details
                        </h2>
                        <Card className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Family Head Name" placeholder="Enter full name" />
                            <Input label="House Name / Number" placeholder="Enter house name" />
                            <Input label="Address" placeholder="Enter full address" className="md:col-span-2" />
                            <Select
                                label="Ward / Area"
                                options={[
                                    { value: 'ward1', label: 'Ward 1' },
                                    { value: 'ward2', label: 'Ward 2' },
                                    { value: 'ward3', label: 'Ward 3' },
                                    { value: 'ward4', label: 'Ward 4' },
                                ]}
                            />
                            <Input label="Mahallu Number" placeholder="Optional" />
                            <Input label="Primary Contact Number" type="tel" placeholder="+91" />
                            <Input label="Alternate Contact Number" type="tel" placeholder="+91" />
                        </Card>
                    </section>

                    {/* Family Status Section */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm mr-3">2</span>
                            Family Status
                        </h2>
                        <Card className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Monthly Income Range"
                                options={[
                                    { value: 'low', label: 'Below ₹10,000' },
                                    { value: 'middle', label: '₹10,000 - ₹50,000' },
                                    { value: 'high', label: 'Above ₹50,000' },
                                ]}
                            />
                            <Select
                                label="Housing Type"
                                options={[
                                    { value: 'own', label: 'Own House' },
                                    { value: 'rented', label: 'Rented' },
                                    { value: 'other', label: 'Other' },
                                ]}
                            />
                            <Select
                                label="Ration Card Type"
                                options={[
                                    { value: 'apl', label: 'APL' },
                                    { value: 'bpl', label: 'BPL' },
                                    { value: 'aay', label: 'AAY' },
                                ]}
                            />
                        </Card>
                    </section>

                    {/* Member Details Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center">
                                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm mr-3">3</span>
                                Member Details
                            </h2>
                            <Button type="button" size="sm" icon={Plus} onClick={addMember}>Add Member</Button>
                        </div>

                        <div className="space-y-4">
                            {members.map((member, index) => (
                                <Card key={member.id} className="relative group">
                                    <div className="absolute top-4 right-4">
                                        {members.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeMember(member.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>

                                    <h3 className="font-medium text-slate-900 mb-4">Member {index + 1}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Input label="Full Name" placeholder="Name" />
                                        <Select
                                            label="Gender"
                                            options={[
                                                { value: 'male', label: 'Male' },
                                                { value: 'female', label: 'Female' },
                                            ]}
                                        />
                                        <Input label="Date of Birth" type="date" />
                                        <Select
                                            label="Relationship"
                                            options={[
                                                { value: 'head', label: 'Head' },
                                                { value: 'spouse', label: 'Spouse' },
                                                { value: 'child', label: 'Child' },
                                                { value: 'parent', label: 'Parent' },
                                                { value: 'sibling', label: 'Sibling' },
                                            ]}
                                        />
                                        <Select
                                            label="Education"
                                            options={[
                                                { value: 'primary', label: 'Primary' },
                                                { value: 'secondary', label: 'Secondary' },
                                                { value: 'graduate', label: 'Graduate' },
                                                { value: 'postgraduate', label: 'Post Graduate' },
                                            ]}
                                        />
                                        <Input label="Occupation" placeholder="Job / Student" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <div className="flex justify-end pt-6">
                        <Button size="lg" icon={Save} className="w-full sm:w-auto">
                            Submit Registration
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PublicRegistration;
