import Link from 'next/link';
import { Stethoscope } from 'lucide-react';
import { signup } from './actions';
import { GlowingButton } from '@/components/ui/glowing-button';

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const error = params.error as string | undefined;

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

                <form className="space-y-6 flex flex-col pt-2" action={signup}>
                    {error && (
                        <div className="p-3 text-sm text-center text-red-500 bg-red-100 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <label className="cursor-pointer relative group">
                            <input type="radio" name="role" value="student" className="peer sr-only" defaultChecked />
                            <div className="flex flex-col items-center justify-center border-2 border-primary/20 bg-background peer-checked:border-primary peer-checked:bg-primary/5 rounded-2xl p-4 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-200 shadow-sm hover:shadow-md h-full">
                                <span className="font-bold text-foreground">Student</span>
                                <span className="text-xs text-muted-foreground mt-1 text-center">I want to learn</span>
                            </div>
                        </label>
                        <label className="cursor-pointer relative group">
                            <input type="radio" name="role" value="dentist" className="peer sr-only" />
                            <div className="flex flex-col items-center justify-center border-2 border-border bg-background peer-checked:border-primary peer-checked:bg-primary/5 rounded-2xl p-4 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-200 shadow-sm hover:shadow-md h-full">
                                <span className="font-bold text-foreground">Instructor</span>
                                <span className="text-xs text-muted-foreground mt-1 text-center">I want to teach</span>
                            </div>
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
                                className="w-full px-4 py-3 rounded-2xl border border-border shadow-sm bg-background text-foreground focus-visible:outline-2 focus-visible:outline-primary transition-all duration-200"
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
                                className="w-full px-4 py-3 rounded-2xl border border-border shadow-sm bg-background text-foreground focus-visible:outline-2 focus-visible:outline-primary transition-all duration-200"
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
                                className="w-full px-4 py-3 rounded-2xl border border-border shadow-sm bg-background text-foreground focus-visible:outline-2 focus-visible:outline-primary transition-all duration-200"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <GlowingButton
                        type="submit"
                        variant="primary"
                        className="w-full"
                    >
                        Create Account
                    </GlowingButton>
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
