import Link from "next/link";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface CourseCardProps {
    id: string;
    title: string;
    instructorName: string;
    instructorAvatar?: string;
    date: string;
    price: number;
    maxStudents: number;
    enrolledStudents: number;
    imageUrl?: string;
}

export function CourseCard({
    id,
    title,
    instructorName,
    instructorAvatar,
    date,
    price,
    maxStudents,
    enrolledStudents,
    imageUrl,
}: CourseCardProps) {
    const isSouldOut = enrolledStudents >= maxStudents;

    return (
        <div className="group relative bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out flex flex-col hover:-translate-y-1">
            {/* Image Section */}

            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-tr from-secondary/10 to-secondary/5 flex items-center justify-center">
                        <span className="text-secondary/50 font-medium">No Image</span>
                    </div>
                )}

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-border">
                    <span className="font-bold text-primary">${price}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col grow">
                <div className="flex items-center gap-3 mb-3">
                    {instructorAvatar ? (
                        <img src={instructorAvatar} alt={instructorName} className="w-8 h-8 rounded-full object-cover border border-border" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-action-secondary flex items-center justify-center text-action-secondary-foreground font-bold text-sm">
                            {instructorName.charAt(0)}
                        </div>
                    )}
                    <span className="text-sm font-medium text-muted-foreground truncate">
                        {instructorName}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-foreground leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {title}
                </h3>

                <div className="mt-auto space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span>{format(new Date(date), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="w-4 h-4 text-secondary" />
                            <span>{enrolledStudents} / {maxStudents} Enrolled</span>
                        </div>
                        {isSouldOut ? (
                            <span className="font-semibold text-destructive text-xs uppercase tracking-wider bg-destructive/10 px-2 py-1 rounded">Sold Out</span>
                        ) : (
                            <span className="font-semibold text-success text-xs uppercase tracking-wider bg-success/10 px-2 py-1 rounded">Available</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Hover Overlay Link */}
            <Link href={`/courses/${id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View course {title}</span>
            </Link>

            {/* Action Strip (visible on hover) */}
            <div className="h-1 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
        </div>
    );
}
