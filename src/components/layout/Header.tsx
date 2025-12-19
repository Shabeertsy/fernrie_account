import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Settings, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const { user } = useAuth();
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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

                    {/* Desktop User Menu */}
                    <div className="hidden sm:flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 hover:bg-slate-50 rounded-lg px-2 py-1 transition-colors"
                        >
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-slate-900">{user?.name || 'Admin User'}</p>
                                <p className="text-xs text-slate-500 capitalize">{user?.role || 'Administrator'}</p>
                            </div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm">
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <ChevronDown size={16} className="text-slate-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                                <Link
                                    to="/settings"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <UserIcon size={16} />
                                    <span>Profile</span>
                                </Link>
                                <Link
                                    to="/settings"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </Link>
                                <hr className="my-1 border-slate-200" />
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Avatar (Simplified) - with logout on click */}
                    <button
                        onClick={handleLogout}
                        className="sm:hidden w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm border border-emerald-200 hover:bg-emerald-200 transition-colors"
                        title="Logout"
                    >
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;

