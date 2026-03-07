import { createClient } from '@/utils/supabase/server';
import { CourseCard } from '@/components/CourseCard';
import { Search, Filter } from 'lucide-react';

export default async function ExploreCoursesPage() {
    const supabase = await createClient();

    const { data: courses } = await supabase
        .from('courses')
        .select('*, profiles!courses_instructor_id_fkey(name, avatar_url)')
        .order('date', { ascending: true });

    const coursesWithCounts = courses && courses.length > 0
        ? await Promise.all(courses.map(async (c) => {
            const { count } = await supabase
                .from('enrollments')
                .select('*', { count: 'exact', head: true })
                .eq('course_id', c.id);
            return { ...c, enrolledStudents: count || 0 };
        }))
        : [];

    const displayCourses = coursesWithCounts.map(c => ({
        id: c.id,
        title: c.title,
        instructorName: c.profiles?.name || "Unknown Instructor",
        instructorAvatar: c.profiles?.avatar_url,
        date: c.date,
        price: c.price,
        maxStudents: c.max_students,
        enrolledStudents: c.enrolledStudents,
        imageUrl: c.image_url
    }));

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Explore Courses</h1>
                    <p className="text-muted-foreground text-lg">Find the perfect specialized dental course for your career.</p>
                </div>

                <div className="flex w-full md:w-auto items-center gap-3">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                        <input
                            type="text"
                            placeholder="Search courses or instructors..."
                            className="w-full pl-10 pr-4 py-3 bg-background border border-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        />
                    </div>
                    <button className="flex items-center justify-center p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                        <Filter className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayCourses.map(course => (
                    <CourseCard key={course.id} {...course} />
                ))}
            </div>

            {displayCourses.length === 0 && (
                <div className="text-center py-24 border border-dashed rounded-2xl">
                    <p className="text-muted-foreground text-lg">No courses found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
