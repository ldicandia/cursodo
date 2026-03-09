import { createClient } from '@/utils/supabase/server';
import { Calendar, Users, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: course } = await supabase
        .from('courses')
        .select('*, profiles!courses_instructor_id_fkey(name, avatar_url, bio)')
        .eq('id', id)
        .single();

    if (!course) {
        notFound();
    }

    let enrolledCount = 0;
    const { count } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', id);
    enrolledCount = count || 0;
    const isSoldOut = enrolledCount >= course.max_students;

    return (
        <div className="w-full bg-background min-h-screen pb-24">
            {/* Hero Header with Image */}
            <div className="relative w-full h-[40vh] min-h-[400px] bg-muted overflow-hidden">
                {course.image_url ? (
                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full pb-8">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl space-y-4">
                            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold border border-primary/30">
                                <ShieldCheck className="w-4 h-4" /> Dental Specialist Course
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">{course.title}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* About Course */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold border-b pb-2">About this Course</h2>
                            <div className="prose prose-blue dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line leading-relaxed text-lg">
                                {course.description}
                            </div>
                        </section>

                        {/* Instructor Bios */}
                        <section className="bg-card border rounded-3xl p-8 shadow-sm">
                            <h2 className="text-xl font-bold mb-6">Meet your Instructor</h2>
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                {course.profiles.avatar_url ? (
                                    <img src={course.profiles.avatar_url} alt={course.profiles.name} className="w-24 h-24 rounded-full object-cover border-4 border-muted" />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold shrink-0">
                                        {course.profiles.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">{course.profiles.name}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {course.profiles.bio || "An experienced dental professional passionate about sharing knowledge and improving clinical outcomes."}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Syllabus Highlights */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold border-b pb-2">What you'll learn</h2>
                            <div className="grid sm:grid-cols-2 gap-4 pt-4">
                                {["Step-by-step clinical protocols", "Advanced diagnosis techniques", "Hands-on practice materials included", "Certificate of completion"].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-foreground">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* Sidebar (Right) - Enrollment Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-card border shadow-xl rounded-3xl p-6 space-y-6">
                            <div className="text-4xl font-bold text-foreground">${course.price}</div>

                            <div className="space-y-4 divide-y">
                                <div className="flex items-center gap-3 pt-4 text-muted-foreground">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="font-semibold text-foreground">Date</p>
                                        <p>{format(new Date(course.date), "MMMM d, yyyy")}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4 text-muted-foreground">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="font-semibold text-foreground">Duration</p>
                                        <p>Full Day (9:00 AM - 6:00 PM)</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4 text-muted-foreground">
                                    <Users className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="font-semibold text-foreground">Availability</p>
                                        <p>{enrolledCount} / {course.max_students} Students</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                {isSoldOut ? (
                                    <button disabled className="w-full py-4 rounded-xl font-bold text-lg bg-muted text-muted-foreground cursor-not-allowed">
                                        Sold Out
                                    </button>
                                ) : (
                                    <Link href={`/checkout/${course.id}`} className="block w-full text-center py-4 rounded-xl font-bold text-lg bg-action text-white hover:bg-action/90 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-action/25">
                                        Enroll Now
                                    </Link>
                                )}
                                <p className="text-xs text-center text-muted-foreground mt-4">Secure payment pending future integration.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
