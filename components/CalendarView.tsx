"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarEvent {
    id: string;
    title: string;
    date: string; // ISO string
}

interface CalendarViewProps {
    events: CalendarEvent[];
    onDateSelect?: (date: Date) => void;
}

export function CalendarView({ events, onDateSelect }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);

    const daysInMonth = eachDayOfInterval({
        start: firstDayOfMonth,
        end: lastDayOfMonth,
    });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    // Determine starting weekday offset to pad the beginning of the calendar grid
    const startingDayIndex = firstDayOfMonth.getDay();
    const blankDays = Array.from({ length: startingDayIndex }).map((_, i) => i);

    return (
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h2 className="text-xl font-bold text-foreground">
                    {format(currentDate, "MMMM yyyy")}
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 border-b border-border/50 bg-muted/30">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-px bg-border/30">
                {blankDays.map((blank) => (
                    <div key={`blank-${blank}`} className="bg-card min-h-[100px] p-2 opacity-50" />
                ))}

                {daysInMonth.map((day, dayIdx) => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
                    const isToday = isSameDay(day, new Date());
                    const isCurrentMonth = isSameMonth(day, currentDate);

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => onDateSelect && onDateSelect(day)}
                            className={`bg-card min-h-[100px] p-2 transition-colors duration-200 group relative ${isCurrentMonth ? "" : "opacity-50"
                                } ${onDateSelect ? "cursor-pointer hover:bg-muted/50" : ""}`}
                        >
                            <div className="flex justify-between items-start">
                                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? "bg-primary text-white" : "text-foreground group-hover:bg-muted"
                                    }`}>
                                    {format(day, "d")}
                                </span>

                                {dayEvents.length > 0 && (
                                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                                        {dayEvents.length}
                                    </span>
                                )}
                            </div>

                            <div className="mt-2 space-y-1">
                                {dayEvents.slice(0, 2).map(event => (
                                    <div
                                        key={event.id}
                                        className="text-xs truncate bg-primary/5 text-primary/80 px-1.5 py-1 rounded border border-primary/10"
                                        title={event.title}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                                {dayEvents.length > 2 && (
                                    <div className="text-[10px] text-muted-foreground font-medium px-1">
                                        +{dayEvents.length - 2} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
