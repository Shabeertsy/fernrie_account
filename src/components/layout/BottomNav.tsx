import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Receipt,
    UserPlus,
    Users,
    CheckSquare,
    Building2
} from 'lucide-react';
import { clsx } from 'clsx';

const BottomNav: React.FC = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Home', path: '/' },
        { icon: Receipt, label: 'Billing', path: '/billing' },
        { icon: Building2, label: 'Company', path: '/company-accounts' },
        { icon: Users, label: 'Clients', path: '/clients' },
        { icon: UserPlus, label: 'Partners', path: '/partners'},
        { icon: CheckSquare, label: 'Todo', path: '/todo' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-bottom">
            <div className="grid grid-cols-6 h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center gap-1 transition-colors",
                            isActive
                                ? "text-emerald-600"
                                : "text-slate-400"
                        )}
                    >
                        <item.icon size={20} className="flex-shrink-0" />
                        <span className="text-xs font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
