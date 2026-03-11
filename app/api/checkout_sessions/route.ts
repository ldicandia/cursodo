import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover',
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { courseId } = await req.json();

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        // Fetch course details
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();

        if (courseError || !course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Check if the course is already sold out
        const { count } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', courseId);

        if ((count || 0) >= course.max_students) {
            return NextResponse.json({ error: 'Course is sold out' }, { status: 400 });
        }

        // Check if user is already enrolled
        const { data: existingEnrollment } = await supabase
            .from('enrollments')
            .select('*')
            .eq('course_id', courseId)
            .eq('student_id', user.id)
            .eq('payment_status', 'completed')
            .single();

        if (existingEnrollment) {
            return NextResponse.json({ error: 'Already enrolled' }, { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: course.title,
                            images: course.image_url ? [course.image_url] : [],
                        },
                        unit_amount: Math.round(course.price * 100), // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/dashboard/student?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/checkout/${courseId}`,
            allow_promotion_codes: true, // Allow user to enter promo code
            metadata: {
                courseId: course.id,
                userId: user.id,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
