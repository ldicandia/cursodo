import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EditCourseForm from './EditCourseForm';

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    // Fetch the course data
    const { data: course } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

    if (!course) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-2xl font-bold mb-4">Course not found</h1>
                <p className="text-muted-foreground mb-8">The course you are looking for does not exist.</p>
                <a href="/dashboard/instructor" className="text-primary hover:underline">Return to Dashboard</a>
            </div>
        );
    }

    // Verify ownership
    if (course.instructor_id !== user.id) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-2xl font-bold mb-4 text-destructive">Access Denied</h1>
                <p className="text-muted-foreground mb-8">You do not have permission to edit this course.</p>
                <a href="/dashboard/instructor" className="text-primary hover:underline">Return to Dashboard</a>
            </div>
        );
    }

    return <EditCourseForm course={course} />;
}
