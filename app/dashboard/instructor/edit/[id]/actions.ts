'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateCourse(courseId: string, formData: FormData) {
    const supabase = await createClient();

    // Verify authentication and role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'You must be logged in to edit a course.' };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'dentist') {
        return { error: 'Only instructors can edit courses.' };
    }

    // Verify course ownership
    const { data: course } = await supabase
        .from('courses')
        .select('instructor_id')
        .eq('id', courseId)
        .single();

    if (!course || course.instructor_id !== user.id) {
        return { error: 'You do not have permission to edit this course.' };
    }

    // Extract form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const price = parseFloat(formData.get('price') as string);
    const maxStudents = parseInt(formData.get('maxStudents') as string, 10);
    const image = formData.get('image') as File | null;

    // Validate inputs
    if (!title || !description || !date || isNaN(price) || isNaN(maxStudents)) {
        return { error: 'Please fill out all required fields.' };
    }

    // Start with the fields that are always updated
    let updates: any = {
        title,
        description,
        date: new Date(date).toISOString(),
        price,
        max_students: maxStudents,
    };

    // Process image upload if provided
    if (image && image.size > 0) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('course-images')
            .upload(filePath, image);

        if (uploadError) {
            console.error('Image upload error:', uploadError);
            return { error: 'Failed to upload the course image.' };
        }

        const { data: { publicUrl } } = supabase.storage
            .from('course-images')
            .getPublicUrl(filePath);

        updates.image_url = publicUrl;
    }

    // Update course record
    const { error: updateError } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', courseId);

    if (updateError) {
        console.error('Course update error:', updateError);
        return { error: 'Failed to update the course. Please try again.' };
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard/instructor');
    revalidatePath(`/courses/${courseId}`);
    revalidatePath('/courses');

    // Redirect to dashboard
    redirect('/dashboard/instructor');
}
