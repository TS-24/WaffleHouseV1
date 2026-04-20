/**
 * @file Home.tsx
 * @description Main page of the WaffleHouse course-scheduling application.
 *
 * This component orchestrates three major areas of the UI:
 *
 *   1. **Search mode** — a search bar (via HomeHeader / SearchCalendarBar)
 *      that queries the backend, displays results in a DataTable, and lets
 *      users add or remove courses from their schedule.
 *
 *   2. **Calendar mode** — a weekly calendar (BigCalendar) populated from
 *      the user's current schedule, with a summary table underneath.
 *
 *   3. **Filter sidebar** (AppSidebar) — an offcanvas panel with filter
 *      inputs (department, name, credits, day, time, professor) that
 *      narrow down search results via POST /filters. The sidebar auto-opens
 *      the first time the user searches.
 *
 * Architecture notes:
 *   - Heavy state (schedule fetching, add/remove) is delegated to the
 *     `useSchedule` custom hook.
 *   - Auth gating is handled by `useAuthGuard` (redirects to /auth).
 *   - Column definitions live in `columns.tsx` and are memoized here.
 *   - The `SidebarAutoOpen` helper isolates the `useSidebar()` context
 *     subscription so that toggling the sidebar does NOT trigger a full
 *     re-render of this (expensive) component.
 *   - Sidebar filter submissions are debounced (300 ms) and use a ref to
 *     always call the latest `submitFilters` closure, avoiding stale-
 *     closure bugs from `useCallback` with an empty dependency array.
 */

import { useState, useRef, useMemo, useEffect, useCallback } from "react"
import * as React from "react"
import { useNavigate } from "react-router-dom"
import type { Mode, Course } from "@/lib/types"
import { toMinutes, cn } from "@/lib/utils"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar.tsx"
import { DataTable } from "@/components/DataTable"
import BigCalendar from "@/components/BigCalendar"
import Footer from "@/components/Footer.tsx"
import HomeHeader from "@/components/HomeHeader.tsx"
import { getSearchColumns, getScheduleColumns } from "@/components/columns"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { useSchedule } from "@/hooks/use-schedule"

/**
 * Inspirational quotes displayed on the landing state (before any search).
 * A random quote is selected once per mount via `useMemo`.
 */
const QUOTES = [
    { text: "The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding.", author: "Proverbs 9:10" },
    { text: "Education is simply the soul of a society as it passes from one generation to another.", author: "G.K. Chesterton" },
    { text: "The task of the modern educator is not to cut down jungles, but to irrigate deserts.", author: "C.S. Lewis" },
    { text: "All truth is God's truth.", author: "Augustine of Hippo" },
    { text: "The heart cannot delight in what the mind does not regard as true.", author: "J. Gresham Machen" },
    { text: "Education without values, as useful as it is, seems rather to make man a more clever devil.", author: "C.S. Lewis" },
    { text: "The glory of God is a human being fully alive.", author: "Irenaeus of Lyon" },
    { text: "An educated mind is one that can entertain a thought without accepting it.", author: "Aristotle" },
]

/**
 * Tiny component that subscribes to the sidebar context so the heavy
 * Home component doesn't have to re-render on every sidebar toggle.
 *
 * On the first search it opens the sidebar once; after that the user
 * controls visibility via the SidebarTrigger button. The `opened` ref
 * ensures we never fight with user-initiated toggles.
 */
function SidebarAutoOpen({ hasSearched, mode }: { hasSearched: boolean; mode: Mode }) {
    const { setOpen } = useSidebar();
    const opened = useRef(false);
    useEffect(() => {
        if (hasSearched && mode === "search" && !opened.current) {
            opened.current = true;
            setOpen(true);
        }
    }, [hasSearched, mode, setOpen]);
    return null;
}

/**
 * Checks whether a candidate course has any timeslot that overlaps with
 * any timeslot of any course already in the schedule.
 *
 * Two timeslots overlap when they share the same day AND one starts
 * before the other ends:
 *   A.start < B.end  &&  A.end > B.start
 *
 * Callers must ensure the candidate is NOT already in the schedule array,
 * otherwise it will appear to conflict with itself.
 */
function courseConflicts(candidate: any, schedule: any[]): boolean {
    for (const scheduled of schedule) {
        for (const candidateSlot of (candidate.times || [])) {
            for (const scheduledSlot of (scheduled.times || [])) {
                if (String(candidateSlot.day) !== String(scheduledSlot.day)) continue;
                const candStart  = toMinutes(candidateSlot.start_time);
                const candEnd    = toMinutes(candidateSlot.end_time);
                const schedStart = toMinutes(scheduledSlot.start_time);
                const schedEnd   = toMinutes(scheduledSlot.end_time);
                if (candStart < schedEnd && candEnd > schedStart) return true;
            }
        }
    }
    return false;
}

export default function Home() {
    const navigate = useNavigate()

    // Redirect to /auth if the user is not authenticated
    useAuthGuard();

    // --------------- Core page state ---------------
    const [results, setResults] = useState<Course[]>([])
    const [hasSearched, setHasSearched] = useState(false)
    const [mode, setMode] = useState<Mode>("search")
    const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], [])

    // Schedule state (events, add/remove, scheduled IDs) from custom hook
    const {
        events, schedule, setSchedule, setEvents,
        scheduledIds, handleAdd, handleRemove, toEvents,
    } = useSchedule();

    // --------------- Toast notifications ---------------
    const [toast, setToast] = React.useState<{ message: string; ok: boolean } | null>(null);
    /** Show a transient toast that auto-dismisses after 3 seconds */
    const showToast = useCallback((message: string, ok: boolean) => {
        setToast({ message, ok });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // --------------- Search result helpers ---------------

    /**
     * After adding or removing a course, re-fetch that single course from
     * the backend and patch it into the search results array. This updates
     * the open-seats count without re-running the full search query.
     */
    const refreshCourseInResults = useCallback(async (id: number) => {
        try {
            const res = await fetch(`http://localhost:7001/course/${id}`);
            if (!res.ok) return;
            const updated = await res.json();
            setResults(prev => prev.map(c => c.id === id ? updated : c));
        } catch (err) {
            console.error("Failed to refresh course in results:", err);
        }
    }, []);

    /**
     * Memoized set of course IDs that conflict with the current schedule
     * but are NOT already in it. (Courses already in the schedule get a
     * "Remove" button instead of being flagged as conflicts.)
     */
    const conflictingIds = useMemo<Set<number>>(() => {
        const ids = new Set<number>();
        for (const course of results) {
            if (scheduledIds.has(course.id)) continue;
            if (courseConflicts(course, schedule)) ids.add(course.id);
        }
        return ids;
    }, [results, schedule, scheduledIds]);

    // --------------- Table column definitions (memoized) ---------------

    const columns = useMemo(() => getSearchColumns({
        scheduledIds,
        conflictingIds,
        onNavigate: (id) => navigate(`/course/${id}`),
        onAdd: (course) => handleAdd(course, refreshCourseInResults),
        onRemove: (course) => handleRemove(course, refreshCourseInResults),
    }), [scheduledIds, conflictingIds, navigate, handleAdd, handleRemove, refreshCourseInResults]);

    const scheduleColumns = useMemo(() => getScheduleColumns({
        onNavigate: (id) => navigate(`/course/${id}`),
        onRemove: (course) => handleRemove(course, refreshCourseInResults),
    }), [navigate, handleRemove, refreshCourseInResults]);

    // --------------- Sidebar filter support ---------------
    // NOTE: The backend /filters endpoint may not be implemented yet with
    // Supabase. This wiring is in place so that once the endpoint exists,
    // the sidebar inputs will automatically trigger filtered searches.

    /** Timer handle for the debounce; cleared on each new input */
    const filterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /**
     * Ref that always points to the latest `submitFilters` function.
     * This avoids a stale-closure bug: `debouncedSubmitFilters` is created
     * once (empty deps) but the timeout fires `submitFiltersRef.current`,
     * which is reassigned on every render to the latest closure.
     */
    const submitFiltersRef = useRef<() => void>(() => {});

    /**
     * Debounced filter submission — waits 300 ms after the last sidebar
     * input change before actually calling the backend. This prevents a
     * flood of requests while the user is typing.
     */
    const debouncedSubmitFilters = useCallback(() => {
        if (filterTimerRef.current) clearTimeout(filterTimerRef.current);
        filterTimerRef.current = setTimeout(() => submitFiltersRef.current(), 300);
    }, []);

    /**
     * Read all filter values from the sidebar's DOM inputs (queried via
     * `data-sidebar="content"`) and POST them to /filters. The response
     * replaces the current search results.
     */
    const submitFilters = async () => {
        // The sidebar renders in a fixed-position container, so we query
        // the document directly rather than a React ref.
        const sidebar = document.querySelector('[data-sidebar="content"]');
        if (!sidebar) return;

        const getString = (name: string): string | null => {
            const el = sidebar.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`);
            return el && el.value.trim() ? el.value.trim() : null;
        };

        const startTime = getString("start-time");
        const endTime   = getString("end-time");
        const day       = getString("day-of-week");

        // Build the time sub-object only if at least one time field is set
        let time: Record<string, unknown> | null = null;
        if (startTime || endTime || day) {
            time = {};
            if (day)       time.day        = day;
            if (startTime) time.start_time = startTime.split(":").map(Number);
            if (endTime)   time.end_time   = endTime.split(":").map(Number);
        }

        const postData = {
            semester: getString("semester"),
            name:     getString("name"),
            prof:     getString("prof"),
            dept:     getString("dept"),
            credits:  getString("credits"),
            year:     getString("year"),
            time,
        };

        try {
            const res = await fetch(`http://localhost:7001/filters`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            });
            if (!res.ok) {
                console.error(`Filter failed: ${res.status} ${res.statusText}`);
                return;
            }
            const filterRes: Course[] = await res.json();
            setResults(filterRes);
        } catch (err) {
            console.error("Filter error:", err);
        }
    }
    // Keep the ref in sync with the latest closure on every render
    submitFiltersRef.current = submitFilters;

    // --------------- Render ---------------

    return (
        <div className="flex flex-1 min-h-screen">
        {/* Auto-open sidebar on first search (isolated from Home re-renders) */}
        <SidebarAutoOpen hasSearched={hasSearched} mode={mode} />

        {/* Collapsible filter sidebar — inputs trigger debouncedSubmitFilters */}
        <AppSidebar onFilterChange={debouncedSubmitFilters} />

        <div className="min-h-screen flex flex-1 flex-col bg-background">
            {/* Toast notification — auto-dismisses after 3 seconds */}
            {toast && (
                <div className={cn(
                    "fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-md text-sm font-medium transition-all",
                    toast.ok
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                )}>
                    {toast.message}
                </div>
            )}

            {/* Sidebar toggle button — sticky top-left, only shown after a search */}
            {hasSearched && mode === "search" && (
                <div className="sticky top-0 z-20 flex items-center h-10 px-4 pt-4">
                    <SidebarTrigger />
                </div>
            )}

            {/* Header with search bar, save/load buttons, and user avatar */}
            <HomeHeader
                hasSearched={hasSearched}
                setHasSearched={setHasSearched}
                setResults={setResults}
                mode={mode}
                setMode={setMode}
                showToast={showToast}
                onScheduleLoad={(data) => {
                    setSchedule(data);
                    setEvents(toEvents(data));
                }}
            />

            {/* Main content area — switches between quote, search results, or calendar */}
            <div className="flex flex-1 justify-center min-h-full mb-16">
                {/* Inspirational quote shown on the landing state (before any search) */}
                {mode === "search" && !hasSearched && (
                    <div className="flex-1 flex flex-col items-center justify-center px-6">
                        <blockquote className="max-w-md text-center">
                            <p className="text-lg italic text-muted-foreground/60">
                                &ldquo;{quote.text}&rdquo;
                            </p>
                            <footer className="mt-3 text-sm text-muted-foreground/40">
                                &mdash; {quote.author}
                            </footer>
                        </blockquote>
                    </div>
                )}

                {/* Search results table */}
                {mode === "search" && hasSearched && (
                    <div className="block min-w-4/5 mt-8">
                        <div className="flex-1 flex flex-col items-center px-6 pt-8">
                            <div className="w-full max-w-4xl mx-auto">
                                <DataTable columns={columns} data={results} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Calendar view with schedule summary table */}
                {mode === "calendar" && (
                    <div className="flex-1 flex flex-col items-center max-w-2/3 mt-8">
                        <BigCalendar events={events} />
                        {schedule.length > 0 && (
                            <div className="w-full max-w-4xl mx-auto mt-8">
                                <h2 className="text-lg font-semibold mb-3">My Schedule</h2>
                                <DataTable columns={scheduleColumns} data={schedule} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <Footer />
        </div>
        </div>
    )
}
