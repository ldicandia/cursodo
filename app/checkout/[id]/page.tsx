import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import CheckoutButton from './CheckoutButton';

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Verify user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    const { data: course } = await supabase
        .from('courses')
        .select('*, profiles!courses_instructor_id_fkey(name, avatar_url, bio)')
        .eq('id', id)
        .single();

    if (!course) {
        notFound();
    }

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', id)
        .eq('student_id', user.id)
        .eq('payment_status', 'completed')
        .single();

    if (existingEnrollment) {
        redirect('/dashboard/student');
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold mb-4">Complete your Enrollment</h1>
                <p className="text-muted-foreground text-lg">Secure your spot in the masterclass</p>
            </div>

            <div className="bg-card border rounded-3xl p-8 shadow-sm">
                <div className="mb-8 p-4 bg-muted/50 rounded-2xl flex items-center gap-4">
                    {course.image_url ? (
                        <img src={course.image_url} alt={course.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    ) : (
                        <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                            <span className="text-2xl">🦷</span>
                        </div>
                    )}
                    <div>
                        <h3 className="font-bold text-foreground">{course.title}</h3>
                        <p className="text-muted-foreground">{course.profiles.name} • ${course.price.toFixed(2)}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <p className="text-muted-foreground">
                        You will be redirected to our secure Stripe checkout to complete your payment. Promocodes can be applied on the next step.
                    </p>
                    
                    <CheckoutButton courseId={course.id} price={course.price} />
                </div>
            </div>
        </div>
    );
}
