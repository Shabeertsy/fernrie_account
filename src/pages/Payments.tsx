import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Calendar, Download, Filter } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

const mockTransactions = [
    { id: 'TRX-001', family: 'Muhammed K.', type: 'Monthly Due', amount: 500, date: '2023-10-25', status: 'Success' },
    { id: 'TRX-002', family: 'Abdulla P.', type: 'Donation', amount: 1000, date: '2023-10-24', status: 'Success' },
    { id: 'TRX-003', family: 'Ibrahim K.', type: 'Event Fee', amount: 250, date: '2023-10-23', status: 'Pending' },
    { id: 'TRX-004', family: 'Yusuf M.', type: 'Monthly Due', amount: 500, date: '2023-10-22', status: 'Failed' },
    { id: 'TRX-005', family: 'Amina B.', type: 'Monthly Due', amount: 200, date: '2023-10-21', status: 'Success' },
];

const Payments: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Payments & Dues</h1>
                    <p className="text-slate-500 mt-1">Track collections and transaction history.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" icon={Download}>Export Report</Button>
                    <Button icon={CreditCard}>Record Payment</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-emerald-600 text-white border-none">
                    <p className="text-emerald-100 mb-1">Total Collection (Oct)</p>
                    <h3 className="text-3xl font-bold">₹4,25,000</h3>
                    <div className="mt-4 flex items-center text-sm text-emerald-100">
                        <ArrowUpRight size={16} className="mr-1" />
                        <span>+12% from last month</span>
                    </div>
                </Card>
                <Card>
                    <p className="text-slate-500 mb-1">Pending Dues</p>
                    <h3 className="text-3xl font-bold text-slate-900">₹85,000</h3>
                    <div className="mt-4 flex items-center text-sm text-red-500">
                        <ArrowUpRight size={16} className="mr-1" />
                        <span>+5% from last month</span>
                    </div>
                </Card>
                <Card>
                    <p className="text-slate-500 mb-1">Total Expenses</p>
                    <h3 className="text-3xl font-bold text-slate-900">₹1,20,000</h3>
                    <div className="mt-4 flex items-center text-sm text-emerald-600">
                        <ArrowDownLeft size={16} className="mr-1" />
                        <span>-2% from last month</span>
                    </div>
                </Card>
            </div>

            <Card className="overflow-hidden border-0 shadow-lg">
                <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Recent Transactions</h3>
                    <Button variant="outline" size="sm" icon={Filter}>Filter</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Family</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mockTransactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{trx.id}</td>
                                    <td className="px-6 py-4 text-slate-600">{trx.family}</td>
                                    <td className="px-6 py-4 text-slate-600">{trx.type}</td>
                                    <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-400" />
                                        {trx.date}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">₹{trx.amount}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={
                                            trx.status === 'Success' ? 'success' :
                                                trx.status === 'Pending' ? 'warning' : 'error'
                                        }>
                                            {trx.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Payments;
