import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutGrid,
    Wallet,
    Building2,
    Users,
    HeartHandshake,
    ListChecks
} from 'lucide-react';
import { clsx } from 'clsx';

const BottomNav: React.FC = () => {
    const navItems = [
        { icon: LayoutGrid, label: 'Home', path: '/' },
        { icon: Wallet, label: 'Billing', path: '/billing' },
        { icon: Building2, label: 'Company', path: '/company-accounts' },
        { icon: Users, label: 'Clients', path: '/clients' },
        { icon: HeartHandshake, label: 'Partners', path: '/partners'},
        { icon: ListChecks, label: 'Todo', path: '/todo' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-4 left-3 right-3 bg-white/90 backdrop-blur-xl border border-white/20 shadow-xl shadow-slate-200/60 rounded-2xl z-50 safe-bottom">
            <div className="grid grid-cols-6 h-16 items-center px-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) => clsx(
                            "group flex flex-col items-center justify-center relative py-1 rounded-xl transition-all duration-300 tap-highlight-transparent",
                            isActive ? "text-emerald-700" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={clsx(
                                    "p-1.5 rounded-xl transition-all duration-300 mb-1",
                                    isActive 
                                        ? "bg-emerald-100/60 translate-y-0" 
                                        : "bg-transparent group-active:bg-slate-100"
                                )}>
                                    <item.icon 
                                        size={22} 
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className="transition-transform duration-300"
                                    />
                                </div>
                                
                                <span className={clsx(
                                    "text-[10px] font-medium transition-all duration-300 leading-none",
                                    isActive 
                                        ? "font-bold opacity-100" 
                                        : "font-medium opacity-80"
                                )}>
                                    {item.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
