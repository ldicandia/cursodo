"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope, Calendar, Search, LogIn, Menu, X, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { signOutAction } from "@/app/auth/actions";

export function Navbar({ user }: { user: User | null }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname() || '';

    const navLinks = [
        { name: "Explore Courses", href: "/courses", icon: Search },
        { name: "Calendar", href: "/calendar", icon: Calendar },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary/95 text-white backdrop-blur supports-backdrop-filter:bg-primary/90 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-colors">
                                <Stethoscope className="h-6 w-6 text-secondary" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">Cursodo</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-6">
                            {navLinks.map((link) => {
                                const isActive = pathname.startsWith(link.href);
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${isActive ? 'text-white' : 'text-white/70'}`}
                                    >
                                        <link.icon className="h-4 w-4" />
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <>
                                    <Link href="/profile" className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-2">
                                        <UserIcon className="h-4 w-4" />
                                        Profile
                                    </Link>
                                    <form action={signOutAction}>
                                        <button type="submit" className="bg-destructive/20 text-destructive-foreground hover:bg-destructive/30 px-4 py-2 rounded-full text-sm font-medium transition-transform shadow-sm">
                                            Sign Out
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-2">
                                        <LogIn className="h-4 w-4" />
                                        Sign In
                                    </Link>
                                    <Link href="/signup" className="bg-action text-action-foreground hover:bg-action/90 px-4 py-2 rounded-full text-sm font-medium transition-transform hover:scale-105 active:scale-95 shadow-sm shadow-action/20">
                                        Join Now
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white p-2"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-primary/20 bg-surface-secondary shadow-xl pb-4 rounded-b-2xl overflow-hidden"
                    >
                        <div className="flex flex-col px-4 py-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 text-lg font-medium text-foreground py-2 border-b border-muted/50"
                                >
                                    <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                                        <link.icon className="h-5 w-5" />
                                    </div>
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-3 mt-4">
                                {user ? (
                                    <>
                                        <Link href="/profile" className="w-full py-3 text-center rounded-xl bg-secondary/10 text-secondary font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                                            Profile
                                        </Link>
                                        <form action={signOutAction} className="w-full">
                                            <button type="submit" className="w-full py-3 text-center rounded-xl bg-destructive/10 text-destructive font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                                                Sign Out
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="w-full py-3 text-center rounded-xl bg-action-secondary text-action-secondary-foreground font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                                            Sign In
                                        </Link>
                                        <Link href="/signup" className="w-full py-3 text-center rounded-xl bg-action text-action-foreground font-medium shadow-sm shadow-action/20" onClick={() => setIsMobileMenuOpen(false)}>
                                            Create Account
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
