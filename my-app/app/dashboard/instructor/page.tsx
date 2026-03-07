import { createClient } from '@/utils/supabase/server';
import { CourseCard } from '@/components/CourseCard';
import { PlusCircle, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default async function InstructorDashboard() {
    const supabase = await createClient();

    // In a real app we'd get the auth session:
    // const { data: { user } } = await supabase.auth.getUser();
    // const { data: courses } = await supabase.from('courses').select('*').eq('instructor_id', user.id);

    // MOCK DATA for now
    const MOCK_MY_COURSES = [
        {
            id: "mock-1",
            title: "Advanced Endodontics Masterclass",
            instructorName: "Me",
            date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            price: 499,
            maxStudents: 20,
            enrolledStudents: 15,
            imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Instructor Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your courses, track enrollments, and coordinate with students.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors">
                    <PlusCircle className="w-5 h-5" />
                    Create New Course
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 text-primary mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-foreground text-lg">Total Revenue</h3>
                    </div>
                    <p className="text-4xl font-bold text-foreground">$7,485</p>
                    <p className="text-sm text-green-600 mt-2 font-medium">+15% from last month</p>
                </div>

                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 text-primary mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-foreground text-lg">Total Students</h3>
                    </div>
                    <p className="text-4xl font-bold text-foreground">15</p>
                    <p className="text-sm text-green-600 mt-2 font-medium">Across all active courses</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_MY_COURSES.map(course => (
                    <CourseCard key={course.id} {...course} />
                ))}
            </div>
        </div>
    );
}
