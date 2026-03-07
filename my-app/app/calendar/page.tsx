import { createClient } from '@/utils/supabase/server';
import { CalendarView } from '@/components/CalendarView';

export const metadata = {
    title: 'Course Calendar - Cursodo',
    description: 'View and plan all our upcoming specialized dentistry courses with our dynamic calendar.',
};

export default async function CalendarPage() {
    const supabase = await createClient();

    // Fetch all upcoming courses
    const { data: courses } = await supabase
        .from('courses')
        .select('id, title, date')
        .order('date', { ascending: true });

    const displayCourses = courses ? courses.map(c => ({
        id: c.id,
        title: c.title,
        date: c.date,
    })) : [];

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Course Calendar</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Plan your clinical schedule around the education that matters most. View all upcoming courses at a glance.
                    </p>
                </div>

                <div className="bg-surface-secondary p-4 sm:p-8 rounded-3xl border border-border shadow-sm">
                    <CalendarView events={displayCourses} />
                </div>
            </div>
        </div>
    );
}
