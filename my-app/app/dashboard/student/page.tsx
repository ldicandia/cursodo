import { createClient } from '@/utils/supabase/server';
import { CourseCard } from '@/components/CourseCard';
import { BookOpen, CalendarCheck } from 'lucide-react';
import Link from 'next/link';

export default async function StudentDashboard() {
    const supabase = await createClient();

    // In real app, fetch enrollments:
    // const { data: enrollments } = await supabase.from('enrollments').select('courses(*)').eq('student_id', user.id);

    // MOCK DATA
    const MOCK_ENROLLED_COURSES = [
        {
            id: "mock-2",
            title: "Aesthetic Composite Restorations",
            instructorName: "Dr. Javier Gomez",
            date: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
            price: 299,
            maxStudents: 30,
            enrolledStudents: 30,
            imageUrl: "https://images.unsplash.com/photo-1598256330419-db2468acb204?auto=format&fit=crop&w=400&q=80"
        }
    ];

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
                        <p className="text-3xl font-bold text-foreground">1</p>
                    </div>
                </div>

                <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-center gap-6">
                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                        <CalendarCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground text-lg mb-1">Upcoming This Month</h3>
                        <p className="text-3xl font-bold text-foreground">1</p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">Upcoming Courses</h2>
            {MOCK_ENROLLED_COURSES.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_ENROLLED_COURSES.map(course => (
                        <CourseCard key={course.id} {...course} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 border border-dashed rounded-2xl bg-muted/20">
                    <p className="text-muted-foreground text-lg mb-4">You are not enrolled in any courses yet.</p>
                    <Link href="/courses/" className="px-6 py-3 bg-action text-action-foreground font-semibold rounded-full hover:bg-action/90 transition-all flex items-center justify-center gap-2">Explore courses</Link>
                </div>
            )}
        </div>
    );
}
