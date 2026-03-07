import Link from 'next/link';
import { Stethoscope } from 'lucide-react';

export default function SignupPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-12">
            <div className="w-full max-w-lg space-y-8 bg-card border rounded-3xl p-8 sm:p-10 shadow-xl">
                <div className="flex flex-col items-center">
                    <Link href="/" className="flex items-center gap-2 group mb-4">
                        <div className="bg-primary/10 p-3 rounded-2xl group-hover:bg-primary/20 transition-colors">
                            <Stethoscope className="h-8 w-8 text-primary" />
                        </div>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">Create Account</h2>
                    <p className="mt-2 text-sm text-muted-foreground text-center">
                        Join the community of top-tier dentistry education
                    </p>
                </div>

                <form className="space-y-6 flex flex-col pt-2">

                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex flex-col items-center justify-center border-2 border-primary/20 bg-primary/5 rounded-2xl p-4 cursor-pointer hover:border-primary hover:bg-primary/10 transition-colors">
                            <input type="radio" name="role" value="student" className="sr-only" defaultChecked />
                            <span className="font-bold text-foreground">Student</span>
                            <span className="text-xs text-muted-foreground mt-1 text-center">I want to learn</span>
                        </label>
                        <label className="flex flex-col items-center justify-center border-2 border-border bg-background rounded-2xl p-4 cursor-pointer hover:border-primary/50 transition-colors">
                            <input type="radio" name="role" value="dentist" className="sr-only" />
                            <span className="font-bold text-foreground">Instructor</span>
                            <span className="text-xs text-muted-foreground mt-1 text-center">I want to teach</span>
                        </label>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors outline-none"
                                placeholder="Dr. John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors outline-none"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-primary hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
