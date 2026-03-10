import { createClient } from '@/utils/supabase/server';
import { CourseCard } from '@/components/CourseCard';
import { PlusCircle, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default async function InstructorDashboard() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div className="p-8 text-center text-muted-foreground">Please log in to view the dashboard.</div>;
    }

    // Fetch instructor's courses
    const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });

    const coursesWithCounts = courses && courses.length > 0
        ? await Promise.all(courses.map(async (c) => {
            const { count } = await supabase
                .from('enrollments')
                .select('*', { count: 'exact', head: true })
                .eq('course_id', c.id);
            return { ...c, enrolledStudents: count || 0 };
        }))
        : [];

    // Calculate metrics
    const totalStudents = coursesWithCounts.reduce((sum, course) => sum + course.enrolledStudents, 0);
    // Assuming each enrolled student has paid the course price (in a real app, this would be based on payment_status)
    const totalRevenue = coursesWithCounts.reduce((sum, course) => sum + (course.enrolledStudents * course.price), 0);

    const displayCourses = coursesWithCounts.map(c => ({
        id: c.id,
        title: c.title,
        instructorName: "Me",
        date: c.date,
        price: c.price,
        maxStudents: c.max_students,
        enrolledStudents: c.enrolledStudents,
        imageUrl: c.image_url,
        editUrl: `/dashboard/instructor/edit/${c.id}`
    }));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Instructor Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your courses, track enrollments, and coordinate with students.</p>
                </div>
                <Link href="/dashboard/instructor/create" className="flex items-center gap-2 bg-action text-white px-4 py-2 rounded-xl font-medium hover:bg-action/90 transition-colors shadow-sm">
                    <PlusCircle className="w-5 h-5" />
                    Create New Course
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 text-primary mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-foreground text-lg">Total Revenue</h3>
                    </div>
                    <p className="text-4xl font-bold text-foreground">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                    <p className="text-sm text-green-600 mt-2 font-medium">From all enrollments</p>
                </div>

                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 text-primary mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-foreground text-lg">Total Students</h3>
                    </div>
                    <p className="text-4xl font-bold text-foreground">{totalStudents}</p>
                    <p className="text-sm text-green-600 mt-2 font-medium">Across all active courses</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-foreground">My Courses</h2>

            {displayCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayCourses.map(course => (
                        <CourseCard key={course.id} {...course} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 border border-dashed rounded-2xl bg-card border-border">
                    <p className="text-muted-foreground text-lg mb-4">You haven't published any courses yet.</p>
                    <Link href="/dashboard/instructor/create" className="inline-flex items-center gap-2 bg-action text-white px-6 py-3 rounded-xl font-medium hover:bg-action/90 transition-colors shadow-sm">
                        <PlusCircle className="w-5 h-5" />
                        Create Your First Course
                    </Link>
                </div>
            )}
        </div>
    );
}
