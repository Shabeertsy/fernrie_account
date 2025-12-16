import React, { useState } from 'react';
import { Search, Plus, TrendingUp, TrendingDown, DollarSign, Eye, Phone, ChevronRight, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalExpense: number;
    totalIncome: number;
    profit: number;
    status: 'active' | 'inactive';
    splitAmount?: number;
    image?: string;
}

const Clients: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        splitAmount: '',
        image: null as File | null
    });

    const handleAddClient = (e: React.FormEvent) => {
        e.preventDefault();
        const newClient: Client = {
            id: Date.now().toString(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            totalExpense: 0,
            totalIncome: 0,
            profit: 0,
            status: 'active',
            splitAmount: parseFloat(formData.splitAmount) || 0,
            image: formData.image ? URL.createObjectURL(formData.image) : undefined
        };
        setClients([newClient, ...clients]);
        setIsModalOpen(false);
        setFormData({
            name: '',
            email: '',
            phone: '',
            splitAmount: '',
            image: null
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    // Mock data - replace with API call
    const [clients, setClients] = useState<Client[]>([
        {
            id: '1',
            name: 'ABC Corporation',
            email: 'abc@corp.com',
            phone: '+91 98765 00001',
            totalExpense: 450000,
            totalIncome: 650000,
            profit: 200000,
            status: 'active'
        },
        {
            id: '2',
            name: 'XYZ Limited',
            email: 'xyz@limited.com',
            phone: '+91 98765 00002',
            totalExpense: 320000,
            totalIncome: 520000,
            profit: 200000,
            status: 'active'
        },
        {
            id: '3',
            name: 'Tech Solutions',
            email: 'tech@solutions.com',
            phone: '+91 98765 00003',
            totalExpense: 180000,
            totalIncome: 250000,
            profit: 70000,
            status: 'active'
        },
        {
            id: '4',
            name: 'Digital Services',
            email: 'digital@services.com',
            phone: '+91 98765 00004',
            totalExpense: 550000,
            totalIncome: 480000,
            profit: -70000,
            status: 'inactive'
        }
    ]);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalProfit = clients.reduce((sum, c) => sum + c.profit, 0);
    const totalIncome = clients.reduce((sum, c) => sum + c.totalIncome, 0);
    const totalExpense = clients.reduce((sum, c) => sum + c.totalExpense, 0);

    // Mobile Client Card
    const ClientCard = ({ client }: { client: Client }) => (
        <Link 
            to={`/clients/${client.id}`}
            className="block bg-white p-4 rounded-xl border border-slate-200 shadow-sm active:bg-slate-50 transition-colors"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm overflow-hidden">
                        {client.image ? (
                            <img src={client.image} alt={client.name} className="w-full h-full object-cover" />
                        ) : (
                            client.name.substring(0, 2).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 leading-tight">{client.name}</h3>
                        <p className="text-xs text-slate-500">{client.email}</p>
                    </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                    client.status === 'active' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}>
                    {client.status}
                </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 py-3 border-t border-b border-slate-50 my-2">
                <div>
                    <p className="text-xs text-slate-400 font-medium">Income</p>
                    <p className="text-sm font-bold text-green-600">₹{client.totalIncome.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-medium">Profit</p>
                    <div className="flex items-center gap-1">
                        <p className={`text-sm font-bold ${client.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            ₹{Math.abs(client.profit).toLocaleString()}
                        </p>
                        {client.profit >= 0 ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-red-500" />}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-2">
                 <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Phone size={12} />
                    <span>{client.phone}</span>
                </div>
                <div className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                    View Details <ChevronRight size={14} />
                </div>
            </div>
        </Link>
    );

    return (
        <div className="space-y-4 sm:space-y-6 pb-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Clients</h1>
                    <p className="text-xs sm:text-base text-slate-500 mt-0.5">Manage clients and track financial performance</p>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Add Client</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200 text-center sm:text-left">
                    <p className="text-slate-500 text-xs sm:text-sm font-medium mb-1">Total Income</p>
                    <p className="text-sm sm:text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
                    <div className="hidden sm:flex mt-2 items-center gap-1 text-xs text-slate-400">
                        <TrendingUp size={14} /> <span>All time</span>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200 text-center sm:text-left">
                    <p className="text-slate-500 text-xs sm:text-sm font-medium mb-1">Total Expense</p>
                    <p className="text-sm sm:text-2xl font-bold text-red-600">₹{totalExpense.toLocaleString()}</p>
                    <div className="hidden sm:flex mt-2 items-center gap-1 text-xs text-slate-400">
                        <TrendingDown size={14} /> <span>All time</span>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200 text-center sm:text-left">
                    <p className="text-slate-500 text-xs sm:text-sm font-medium mb-1">Net Profit</p>
                    <p className={`text-sm sm:text-2xl font-bold ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        ₹{totalProfit.toLocaleString()}
                    </p>
                    <div className="hidden sm:flex mt-2 items-center gap-1 text-xs text-emerald-600">
                        <DollarSign size={14} /> <span>Net Earnings</span>
                    </div>
                </div>
            </div>

            {/* Mobile Floating Action Button */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-20 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center sm:hidden z-50 active:scale-95 hover:bg-emerald-700 transition-colors"
            >
                <Plus size={24} />
            </button>

            {/* Search */}
            <div className="bg-white p-2 sm:p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 sm:py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                </div>
            </div>

            {/* Mobile List View */}
            <div className="space-y-3 sm:hidden">
                {filteredClients.map((client) => (
                    <ClientCard key={client.id} client={client} />
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client Name</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Income</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expense</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Profit/Loss</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs overflow-hidden">
                                                {client.image ? (
                                                    <img src={client.image} alt={client.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    client.name.substring(0, 2).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{client.name}</p>
                                                <p className="text-sm text-slate-500">{client.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{client.phone}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                                        ₹{client.totalIncome.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-red-600">
                                        ₹{client.totalExpense.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {client.profit >= 0 ? (
                                                <TrendingUp className="text-green-600" size={16} />
                                            ) : (
                                                <TrendingDown className="text-red-600" size={16} />
                                            )}
                                            <span className={`text-sm font-semibold ${
                                                client.profit >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                ₹{Math.abs(client.profit).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                            client.status === 'active'
                                                ? 'bg-green-100 text-green-700 border-green-200'
                                                : 'bg-gray-100 text-gray-700 border-gray-200'
                                        }`}>
                                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/clients/${client.id}`}
                                            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                                        >
                                            <Eye size={16} />
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredClients.length === 0 && (
                    <div className="text-center py-12 bg-white sm:bg-transparent rounded-xl border border-slate-200 sm:border-none">
                        <Search className="mx-auto text-slate-300" size={48} />
                        <p className="text-slate-500 mt-2">No clients found</p>
                    </div>
                )}
            </div>

            {/* Add Client Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Client"
            >
                <form onSubmit={handleAddClient} className="space-y-4">
                    <Input
                        label="Client Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Enter client name"
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="client@example.com"
                    />
                    <Input
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        placeholder="+91 98765 43210"
                    />
                    <Input
                        label="Split Amount (%)"
                        type="number"
                        value={formData.splitAmount}
                        onChange={(e) => setFormData({ ...formData, splitAmount: e.target.value })}
                        placeholder="0"
                        min="0"
                        max="100"
                    />
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Client Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-emerald-500 transition-colors cursor-pointer relative bg-slate-50">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <div className="space-y-1 text-center">
                                {formData.image ? (
                                    <div className="flex flex-col items-center">
                                        <img 
                                            src={URL.createObjectURL(formData.image)} 
                                            alt="Preview" 
                                            className="h-20 w-20 object-cover rounded-full mb-2"
                                        />
                                        <p className="text-sm text-emerald-600 font-medium">Image selected</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mx-auto h-12 w-12 text-slate-400">
                                            <Upload size={48} />
                                        </div>
                                        <div className="flex text-sm text-slate-600">
                                            <span className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                                                Upload a file
                                            </span>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            Add Client
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Clients;
