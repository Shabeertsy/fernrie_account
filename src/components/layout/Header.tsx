import React from 'react';
import { Bell, Search, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';



const Header: React.FC = () => {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
                <div className="flex items-center gap-3">
                    {/* Mobile Logo/Brand */}
                    <div className="lg:hidden flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            F
                        </div>
                        <span className="font-bold text-slate-800 text-lg">Fernrei</span>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden sm:block relative w-64 lg:w-96 ml-4 lg:ml-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-slate-900 placeholder:text-slate-500"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    
                    <Link to="/settings" className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                        <Settings size={20} />
                    </Link>

                    <div className="hidden sm:flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-slate-900">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role || 'Administrator'}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    </div>
                    
                    {/* Mobile Avatar (Simplified) */}
                    <div className="sm:hidden w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm border border-emerald-200">
                         {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
