import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface Button5Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    icon?: React.ReactNode;
    href?: string;
}

export const Button5 = React.forwardRef<HTMLButtonElement, Button5Props>(
    ({ className, text, icon, href, ...props }, ref) => {
        const buttonContent = (
            <>
                <span className='flex items-center justify-center gap-2 translate-y-0 group-hover:-translate-y-12 group-hover:opacity-0 transition-all duration-300'>
                    {text} {icon}
                </span>
                <div className='flex gap-2 text-white bg-action z-10 items-center absolute left-0 top-0 h-full w-full justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 rounded-full group-hover:rounded-none '>
                    <span>{text}</span> {icon}
                </div>
            </>
        );

        const buttonClasses = cn(
            'group relative cursor-pointer p-2 px-6 h-12 w-auto inline-flex items-center justify-center border bg-white rounded-full overflow-hidden text-black text-center font-semibold',
            className
        );

        if (href) {
            return (
                <Link href={href} className={buttonClasses}>
                    {buttonContent}
                </Link>
            );
        }

        return (
            <button ref={ref} className={buttonClasses} {...props}>
                {buttonContent}
            </button>
        );
    }
);

Button5.displayName = 'Button5';
