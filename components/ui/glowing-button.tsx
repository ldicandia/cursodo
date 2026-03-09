import React from 'react';
import Link from 'next/link';

interface GlowingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    className?: string;
}

export function GlowingButton({ href, variant = 'primary', size = 'md', children, className = '', ...props }: GlowingButtonProps) {
    const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-300 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-action text-action-foreground shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-0.5 border border-transparent focus-visible:outline-action",
        secondary: "bg-background text-foreground shadow-sm hover:shadow-md border border-border hover:border-border/80 focus-visible:outline-primary",
        outline: "bg-transparent text-foreground border-2 border-primary/20 hover:border-primary/80 hover:text-primary hover:bg-primary/5 focus-visible:outline-primary",
        ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-surface-secondary focus-visible:outline-primary"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={classes}>
                <span className="flex items-center justify-center gap-2 w-full h-full relative z-10">
                    {children}
                </span>
            </Link>
        );
    }

    return (
        <button className={classes} {...props}>
            <span className="flex items-center justify-center gap-2 w-full h-full relative z-10">
                {children}
            </span>
        </button>
    );
}
