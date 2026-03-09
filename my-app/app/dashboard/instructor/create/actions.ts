'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCourse(formData: FormData) {
    const supabase = await createClient();

    // Verify authentication and role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'You must be logged in to create a course.' };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'dentist') {
        return { error: 'Only instructors can create courses.' };
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

    let imageUrl = null;

    // Process image upload if provided
    if (image && image.size > 0) {
        // Create a unique filename
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
            .from('course-images')
            .upload(filePath, image);

        if (uploadError) {
            console.error('Image upload error:', uploadError);
            return { error: 'Failed to upload the course image.' };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('course-images')
            .getPublicUrl(filePath);

        imageUrl = publicUrl;
    }

    // Insert course record
    const { error: insertError } = await supabase
        .from('courses')
        .insert({
            instructor_id: user.id,
            title,
            description,
            date: new Date(date).toISOString(),
            price,
            max_students: maxStudents,
            image_url: imageUrl
        });

    if (insertError) {
        console.error('Course insert error:', insertError);
        return { error: 'Failed to create the course. Please try again.' };
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard/instructor');
    revalidatePath('/courses');

    // Redirect to dashboard
    redirect('/dashboard/instructor');
}
