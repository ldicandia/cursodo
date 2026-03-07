import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { updateProfile } from './actions';
import { User as UserIcon, Mail, ShieldAlert } from 'lucide-react';

export default async function ProfilePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect('/login');
    }

    const params = await searchParams;
    const error = params.error as string | undefined;
    const message = params.message as string | undefined;

    const fullName = user.user_metadata?.full_name || '';
    const role = user.user_metadata?.role || 'student';

    return (
        <div className="flex min-h-[calc(100vh-4rem)] w-full items-start justify-center bg-muted/30 px-4 py-12">
            <div className="w-full max-w-2xl bg-card border rounded-3xl p-8 sm:p-10 shadow-xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <UserIcon className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">Your Profile</h2>
                    <p className="mt-2 text-sm text-muted-foreground text-center">
                        Manage your account settings
                    </p>
                </div>

                <form className="space-y-6 flex flex-col" action={updateProfile}>
                    {error && (
                        <div className="p-4 text-sm text-red-600 bg-red-100 rounded-xl border border-red-200 flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4" />
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="p-4 text-sm text-green-700 bg-green-100 rounded-xl border border-green-200">
                            {message}
                        </div>
                    )}
                    <div className="space-y-6">
                        <div className="bg-muted/50 p-6 rounded-2xl border border-border/50">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                                Personal Information
                            </h3>
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
                                        defaultValue={fullName}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors outline-none"
                                        placeholder="Your full name"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/50 p-6 rounded-2xl border border-border/50">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                Account Details
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            disabled
                                            value={user.email}
                                            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-muted text-muted-foreground cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            value={role.charAt(0).toUpperCase() + role.slice(1)}
                                            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-muted text-muted-foreground cursor-not-allowed font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="flex justify-center py-3 px-8 border border-transparent rounded-xl shadow-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
