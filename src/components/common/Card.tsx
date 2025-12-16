import React from 'react';

import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'outline';
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    variant = 'default',
    ...props
}) => {
    const variants = {
        default: "bg-white border border-slate-100 shadow-sm",
        glass: "bg-white/80 backdrop-blur-md border border-white/20 shadow-xl",
        outline: "bg-transparent border border-slate-200",
    };

    return (
        <div
            className={twMerge(
                "rounded-2xl p-6 transition-all duration-300",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
