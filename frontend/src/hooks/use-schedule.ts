/**
 * @file use-schedule.ts
 * @description Custom React hook that manages the user's course schedule.
 *
 * Encapsulates all schedule-related state and backend interactions so that
 * page components (e.g. Home) can consume schedule data without owning the
 * fetch / add / remove logic themselves.
 *
 * Returned values:
 *   - `events`        — calendar-ready event objects derived from the schedule
 *   - `schedule`      — raw course objects currently in the schedule
 *   - `setSchedule`   — setter exposed for external updates (e.g. loading from disk)
 *   - `setEvents`     — setter exposed alongside setSchedule
 *   - `scheduledIds`  — memoized Set<number> of course IDs for O(1) membership checks
 *   - `fetchSchedule` — re-fetches the schedule from the backend
 *   - `handleAdd`     — POST a course to the schedule, then refresh
 *   - `handleRemove`  — DELETE a course from the schedule, then refresh
 *   - `toEvents`      — utility to convert raw courses into calendar events
 *
 * Both `handleAdd` and `handleRemove` accept an optional `onRefresh` callback
 * that is invoked with the course ID after a successful mutation. The caller
 * can use this to update local search results without a full re-query.
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import type { CourseEvent } from "@/components/BigCalendar";
import { formatTime } from "@/lib/utils";

/**
 * Transforms an array of backend course objects into `CourseEvent` objects
 * that the BigCalendar component can render.
 *
 * Each course may have multiple timeslots (e.g. MWF 9:00-9:50), and each
 * timeslot becomes a separate calendar event. The backend may serialize
 * `start_time` / `end_time` as either a JSON array `[hour, minute]` or a
 * colon-delimited string `"HH:MM"`, so both formats are handled.
 */
function toEvents(courses: any[]): CourseEvent[] {
    return courses.flatMap((course) =>
        (course.times || []).map((slot: any) => ({
            daysOfWeek: [String(slot.day)],
            startTime: Array.isArray(slot.start_time) ? formatTime(slot.start_time) : String(slot.start_time),
            endTime: Array.isArray(slot.end_time) ? formatTime(slot.end_time) : String(slot.end_time),
            courseName: course.name,
            courseCode: String(course.code),
            courseDepartment: course.subject,
            courseSection: typeof course.section === 'string' ? course.section : String.fromCharCode(course.section),
            courseLocation: course.location || '',
        }))
    );
}

export function useSchedule() {
    /** Calendar events derived from the current schedule */
    const [events, setEvents] = useState<CourseEvent[]>([]);

    /** Raw course objects in the user's schedule (as returned by the backend) */
    const [schedule, setSchedule] = useState<any[]>([]);

    /**
     * Fetch the full schedule from GET /schedule.
     * Wrapped in useCallback so it can be safely listed as a dependency
     * of other hooks without causing infinite re-render loops.
     */
    const fetchSchedule = useCallback(() => {
        fetch("http://localhost:7001/schedule")
            .then((res) => res.json())
            .then((data) => {
                setSchedule(data);
                setEvents(toEvents(data));
            })
            .catch((err) => console.error("Failed to fetch schedule:", err));
    }, []);

    // Fetch the schedule once on mount
    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    /**
     * Set of course IDs currently in the schedule.
     * Used for O(1) lookups when deciding whether to show "Add" or "Remove"
     * buttons and when checking for time conflicts.
     */
    const scheduledIds = useMemo<Set<number>>(() => {
        return new Set(schedule.map((c: any) => c.id));
    }, [schedule]);

    /**
     * Remove a course from the schedule via DELETE /course.
     * On success, re-fetches the full schedule and optionally calls
     * `onRefresh(courseId)` so the caller can update its own state
     * (e.g. refresh the open-seats count in search results).
     */
    const handleRemove = useCallback(async (course: any, onRefresh?: (id: number) => void) => {
        try {
            const res = await fetch("http://localhost:7001/course", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(course),
            });
            if (!res.ok) {
                const body = await res.text();
                console.error(`Failed to remove course: ${res.status} ${res.statusText}`, body);
                return;
            }
            const removed: boolean = await res.json();
            if (removed) {
                fetchSchedule();
                onRefresh?.(course.id);
            }
        } catch (err) {
            console.error("Error removing course:", err);
        }
    }, [fetchSchedule]);

    /**
     * Add a course to the schedule via POST /course.
     * On success, re-fetches the full schedule and optionally calls
     * `onRefresh(courseId)` so the caller can update its own state.
     */
    const handleAdd = useCallback(async (course: any, onRefresh?: (id: number) => void) => {
        try {
            const res = await fetch("http://localhost:7001/course", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(course),
            });
            if (!res.ok) {
                const body = await res.text();
                console.error(`Failed to add course: ${res.status} ${res.statusText}`, body);
                return;
            }
            const added: boolean = await res.json();
            if (added) {
                fetchSchedule();
                onRefresh?.(course.id);
            }
        } catch (err) {
            console.error("Error adding course:", err);
        }
    }, [fetchSchedule]);

    return {
        events,
        schedule,
        setSchedule,
        setEvents,
        scheduledIds,
        fetchSchedule,
        handleAdd,
        handleRemove,
        toEvents,
    };
}
