'use client';

import { useState } from 'react';
import { updateCourse } from './actions';
import { GlowingButton } from '@/components/ui/glowing-button';
import { ArrowLeft, Image as ImageIcon, Upload } from 'lucide-react';
import Link from 'next/link';

export default function EditCourseForm({ course }: { course: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(course.image_url);

    // Format the db timestamp to what datetime-local expects: YYYY-MM-DDThh:mm
    const formattedDate = course.date ? new Date(course.date).toISOString().slice(0, 16) : '';

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            // Revert to the existing image if the user cancels selection
            setPreviewUrl(course.image_url);
        }
    };

    const actionWithCourseId = updateCourse.bind(null, course.id);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await actionWithCourseId(formData);
            if (result && result.error) {
                setError(result.error);
                setIsSubmitting(false);
            }
            // If successful, the server action will redirect back to the dashboard
        } catch (err) {
            setError('An unexpected error occurrred. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Link href="/dashboard/instructor" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            <div className="bg-card border rounded-3xl p-6 sm:p-10 shadow-sm">
                <div className="mb-8 border-b pb-6">
                    <h1 className="text-3xl font-bold text-foreground">Edit Course</h1>
                    <p className="text-muted-foreground mt-2">Update the details for "{course.title}"</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Basic Details</h2>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">Course Title <span className="text-destructive">*</span></label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                defaultValue={course.title}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">Detailed Description <span className="text-destructive">*</span></label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows={5}
                                defaultValue={course.description}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 mt-6 border-t">
                        <h2 className="text-xl font-semibold">Logistics & Pricing</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">Start Date <span className="text-destructive">*</span></label>
                                <input
                                    id="date"
                                    name="date"
                                    type="datetime-local"
                                    required
                                    defaultValue={formattedDate}
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="maxStudents" className="block text-sm font-medium text-foreground mb-2">Maximum Students <span className="text-destructive">*</span></label>
                                <input
                                    id="maxStudents"
                                    name="maxStudents"
                                    type="number"
                                    min="1"
                                    required
                                    defaultValue={course.max_students}
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">Enrollment Price ($) <span className="text-destructive">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        defaultValue={course.price}
                                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 mt-6 border-t">
                        <h2 className="text-xl font-semibold">Media</h2>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Cover Image</label>

                            <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-border px-6 py-10 hover:border-primary/50 transition-colors relative overflow-hidden bg-muted/20 group">
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-full shadow-sm mb-3">
                                                <Upload className="h-6 w-6 text-primary" aria-hidden="true" />
                                            </div>
                                            <p className="text-sm font-semibold text-foreground bg-background/80 px-3 py-1 rounded-full">Change image</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center relative z-10">
                                        <div className="bg-primary/10 p-4 rounded-full inline-block mb-4 text-primary">
                                            <ImageIcon className="h-8 w-8" aria-hidden="true" />
                                        </div>
                                        <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                                            <label
                                                htmlFor="image"
                                                className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                                            >
                                                <span>Upload a file</span>
                                                <input id="image" name="image" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-muted-foreground mt-2">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                )}

                                {previewUrl && (
                                    <input id="image-replace" name="image" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept="image/*" onChange={handleImageChange} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t flex justify-end gap-4">
                        <Link href="/dashboard/instructor" className="px-6 py-3 rounded-xl font-semibold border hover:bg-muted transition-colors">
                            Cancel
                        </Link>
                        <GlowingButton type="submit" variant="primary" size="md" className="min-w-[150px]">
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </GlowingButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
