import { createClient } from '@/utils/supabase/server';
import { CourseCard } from '@/components/CourseCard';
import { BookOpen, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function StudentDashboard() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
            course_id,
            courses (
                *,
                profiles!courses_instructor_id_fkey(name, avatar_url)
            )
        `)
        .eq('student_id', user.id)
        .eq('payment_status', 'completed');

    // To get the number of enrolled students per course for the cards
    const courseIds = enrollments?.map(e => e.course_id) || [];
    let enrollmentsCount: Record<string, number> = {};

    if (courseIds.length > 0) {
        const { data: countsData } = await supabase
            .from('enrollments')
            .select('course_id')
            .in('course_id', courseIds);

        if (countsData) {
            countsData.forEach(row => {
                enrollmentsCount[row.course_id] = (enrollmentsCount[row.course_id] || 0) + 1;
            });
        }
    }

    const mappedCourses = (enrollments || []).map((e: any) => {
        const course = Array.isArray(e.courses) ? e.courses[0] : e.courses;
        return {
            id: course.id,
            title: course.title,
            instructorName: course.profiles?.name || 'Instructor',
            instructorAvatar: course.profiles?.avatar_url || undefined,
            date: course.date,
            price: course.price,
            maxStudents: course.max_students,
            enrolledStudents: enrollmentsCount[course.id] || 0,
            imageUrl: course.image_url || undefined
        };
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">My Learning</h1>
                <p className="text-muted-foreground mt-1">Access your enrolled courses and upcoming schedule.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-center gap-6">
                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground text-lg mb-1">Enrolled Courses</h3>
                        <p className="text-3xl font-bold text-foreground">{mappedCourses.length}</p>
                    </div>
                </div>

                <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-center gap-6">
                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                        <CalendarCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground text-lg mb-1">Upcoming This Month</h3>
                        <p className="text-3xl font-bold text-foreground">
                            {mappedCourses.filter(c => new Date(c.date).getMonth() === new Date().getMonth()).length}
                        </p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-foreground">Upcoming Courses</h2>
            {mappedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mappedCourses.map(course => (
                        <CourseCard key={course.id} {...course} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 border border-dashed rounded-2xl bg-muted/20 border-border">
                    <p className="text-muted-foreground text-lg mb-4">You are not enrolled in any courses yet.</p>
                    <Link href="/courses/" className="px-6 py-3 bg-action text-action-foreground font-semibold rounded-full hover:bg-action/90 transition-all flex items-center justify-center gap-2">Explore courses</Link>
                </div>
            )}
        </div>
    );
}
