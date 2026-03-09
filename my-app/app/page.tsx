import { createClient } from '@/utils/supabase/server';
import { CourseCard } from '@/components/CourseCard';
import { CalendarView } from '@/components/CalendarView';
import { ArrowRight, Star, ShieldCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button5 } from '@/components/ui/button-5';

export default async function Page() {
  const supabase = await createClient();

  // Fetch some upcoming courses for the featured section
  // Since db might be empty, we handle the empty state gracefully
  const { data: courses } = await supabase
    .from('courses')
    .select('*, profiles!courses_instructor_id_fkey(name, avatar_url)')
    .order('date', { ascending: true })
    .limit(4);

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

  const features = [
    {
      icon: Star,
      title: "Premium Education",
      description: "Learn from top-tier specialists who are actively practicing and pushing boundaries."
    },
    {
      icon: TrendingUp,
      title: "Democratized Teaching",
      description: "Providing visibility to talented professionals regardless of their marketing budget."
    },
    {
      icon: ShieldCheck,
      title: "Verified Instructors",
      description: "All instructors go through a rigorous validation process for ultimate quality."
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 overflow-hidden bg-background">

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
              Elevate Your Dental <br className="hidden md:block" /> Practice with <span className="text-primary">Cursodo</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The premier marketplace connecting specialized dentistry instructors with eager professionals.
              Discover high-quality courses, connect with peers, and advance your career.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button5 href="/courses" text="Explore Courses" icon={<ArrowRight className="w-5 h-5" />} className="w-full sm:w-auto" />
              <Button5 href="/login" text="Become an Instructor" className="w-full sm:w-auto" />
            </div>
          </div>
        </div>

        {/* Decorative blur elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-secondary/20 blur-[120px] rounded-full point-events-none -z-10" />
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-surface-secondary w-full border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 space-y-4 group">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 container mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Courses</h2>
            <p className="text-lg text-muted-foreground">Discover the most anticipated courses of the season.</p>
          </div>
          <Link href="/courses" className="text-secondary font-medium hover:underline flex items-center gap-2 whitespace-nowrap">
            View all courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {displayCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        {/* Dynamic Calendar Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">Plan Your Year with Our Ecosystem</h2>
            <p className="text-lg text-muted-foreground">
              Never miss out on a great opportunity. Our dynamic calendar lets you see all upcoming courses at a glance, allowing you to organize your clinical schedule around the education that matters most to you.
            </p>
            <div className="pt-4">
              <Button5 href="/calendar" text="Open Full Calendar" icon={<ArrowRight className="w-4 h-4" />} />
            </div>
          </div>
          <div className="lg:col-span-7">
            <CalendarView events={displayCourses} />
          </div>
        </div>
      </section>
    </div>
  );
}
