import Link from 'next/link';
import { Stethoscope } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
            <div className="w-full max-w-md space-y-8 bg-card border rounded-3xl p-8 sm:p-10 shadow-xl">
                <div className="flex flex-col items-center">
                    <Link href="/" className="flex items-center gap-2 group mb-6">
                        <div className="bg-primary/10 p-3 rounded-2xl group-hover:bg-primary/20 transition-colors">
                            <Stethoscope className="h-8 w-8 text-primary" />
                        </div>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">Welcome back</h2>
                    <p className="mt-2 text-sm text-muted-foreground text-center">
                        Enter your credentials to access your account
                    </p>
                </div>

                <form className="space-y-6 flex flex-col pt-4">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors outline-none"
                                placeholder="doctor@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <a href="#" className="text-sm font-semibold text-primary hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
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
                        Sign in
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-semibold text-primary hover:underline">
                        Register for free
                    </Link>
                </p>
            </div>
        </div>
    );
}
