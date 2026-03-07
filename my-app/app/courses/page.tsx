import { createClient } from '@/utils/supabase/server';
import { CourseCard } from '@/components/CourseCard';
import { Search, Filter } from 'lucide-react';

export default async function ExploreCoursesPage() {
    const supabase = await createClient();

    const { data: courses } = await supabase
        .from('courses')
        .select('*, profiles!courses_instructor_id_fkey(name, avatar_url)')
        .order('date', { ascending: true });

    const MOCK_COURSES = [
        {
            id: "mock-1",
            title: "Advanced Endodontics Masterclass: Rotary Instruments",
            instructorName: "Dr. Elena Smith",
            date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            price: 499,
            maxStudents: 20,
            enrolledStudents: 15,
            imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "mock-2",
            title: "Aesthetic Composite Restorations from A to Z",
            instructorName: "Dr. Javier Gomez",
            date: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
            price: 299,
            maxStudents: 30,
            enrolledStudents: 30,
            imageUrl: "https://images.unsplash.com/photo-1598256330419-db2468acb204?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "mock-3",
            title: "Digital Workflow in Implantology",
            instructorName: "Dr. Sarah Chen",
            date: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(),
            price: 899,
            maxStudents: 15,
            enrolledStudents: 5,
            imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "mock-4",
            title: "Pediatric Dentistry: Behavioral Management",
            instructorName: "Dr. Ahmed Hassan",
            date: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(),
            price: 350,
            maxStudents: 25,
            enrolledStudents: 10,
            imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "mock-5",
            title: "Surgical Extractions and Bone Grafting",
            instructorName: "Dr. Michael Rossi",
            date: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
            price: 600,
            maxStudents: 12,
            enrolledStudents: 11,
            imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
        }
    ];

    const displayCourses = courses && courses.length > 0 ? courses.map(c => ({
        id: c.id,
        title: c.title,
        instructorName: c.profiles?.name || "Unknown Instructor",
        instructorAvatar: c.profiles?.avatar_url,
        date: c.date,
        price: c.price,
        maxStudents: c.max_students,
        enrolledStudents: 0,
        imageUrl: c.image_url
    })) : MOCK_COURSES;

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
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search courses or instructors..."
                            className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                        />
                    </div>
                    <button className="flex items-center justify-center p-3 border border-border rounded-xl hover:bg-muted transition-colors text-foreground">
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
