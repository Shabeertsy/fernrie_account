import React, { useState } from 'react';
import { Save, User, Bell, Lock, DollarSign } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

const Settings: React.FC = () => {
    const [saved, setSaved] = useState(false);
    
    // Company Settings
    const [companyName, setCompanyName] = useState('Fernrei Accounts');
    const [companyEmail, setCompanyEmail] = useState('admin@fernrei.com');
    const [companyPhone, setCompanyPhone] = useState('+91 98765 43210');
    const [companyAddress, setCompanyAddress] = useState('123 Business Park, Mumbai, MH 400001');
    
    // Currency & Billing
    const [currency, setCurrency] = useState('INR');
    const [taxRate, setTaxRate] = useState('18');
    const [invoicePrefix, setInvoicePrefix] = useState('INV');
    
    // Notifications
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [invoiceReminders, setInvoiceReminders] = useState(true);
    const [paymentAlerts, setPaymentAlerts] = useState(true);

    const handleSave = () => {
        // Save to backend/localStorage
        const settings = {
            company: { companyName, companyEmail, companyPhone, companyAddress },
            billing: { currency, taxRate, invoicePrefix },
            notifications: { emailNotifications, invoiceReminders, paymentAlerts }
        };
        localStorage.setItem('appSettings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                    <p className="text-slate-500 mt-1">Manage your account and application preferences</p>
                </div>
                <Button icon={Save} onClick={handleSave}>
                    {saved ? 'Saved!' : 'Save Changes'}
                </Button>
            </div>

            {/* Company Information */}
            <Card>
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="text-emerald-600" size={20} />
                        <h2 className="text-lg font-bold text-slate-900">Company Information</h2>
                    </div>
                    <p className="text-sm text-slate-500">Update your company details</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={companyEmail}
                                onChange={(e) => setCompanyEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                            <input
                                type="tel"
                                value={companyPhone}
                                onChange={(e) => setCompanyPhone(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                        <textarea
                            value={companyAddress}
                            onChange={(e) => setCompanyAddress(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>
            </Card>

            {/* Currency & Billing Settings */}
            <Card>
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="text-emerald-600" size={20} />
                        <h2 className="text-lg font-bold text-slate-900">Currency & Billing</h2>
                    </div>
                    <p className="text-sm text-slate-500">Configure billing and invoice settings</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="INR">₹ INR - Indian Rupee</option>
                                <option value="USD">$ USD - US Dollar</option>
                                <option value="EUR">€ EUR - Euro</option>
                                <option value="GBP">£ GBP - British Pound</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tax Rate (%)</label>
                            <input
                                type="number"
                                value={taxRate}
                                onChange={(e) => setTaxRate(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Invoice Prefix</label>
                            <input
                                type="text"
                                value={invoicePrefix}
                                onChange={(e) => setInvoicePrefix(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Notifications */}
            <Card>
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Bell className="text-emerald-600" size={20} />
                        <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
                    </div>
                    <p className="text-sm text-slate-500">Manage your notification preferences</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                            <p className="font-medium text-slate-900">Email Notifications</p>
                            <p className="text-sm text-slate-500">Receive email updates for important events</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={(e) => setEmailNotifications(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                            <p className="font-medium text-slate-900">Invoice Reminders</p>
                            <p className="text-sm text-slate-500">Automatic reminders for unpaid invoices</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={invoiceReminders}
                                onChange={(e) => setInvoiceReminders(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                            <p className="font-medium text-slate-900">Payment Alerts</p>
                            <p className="text-sm text-slate-500">Get notified when payments are received</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={paymentAlerts}
                                onChange={(e) => setPaymentAlerts(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                </div>
            </Card>

            {/* Security */}
            <Card>
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Lock className="text-emerald-600" size={20} />
                        <h2 className="text-lg font-bold text-slate-900">Security</h2>
                    </div>
                    <p className="text-sm text-slate-500">Manage your password and security settings</p>
                </div>

                <div className="space-y-4">
                    <Button variant="outline" icon={Lock}>Change Password</Button>
                    <p className="text-sm text-slate-500">Last password change: Never</p>
                </div>
            </Card>
        </div>
    );
};

export default Settings;
