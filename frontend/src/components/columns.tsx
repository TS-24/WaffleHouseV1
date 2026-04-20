/**
 * @file columns.tsx
 * @description TanStack Table column definitions for the two DataTable instances
 *              used on the Home page: the **search results** table and the
 *              **schedule** table (shown below the calendar).
 *
 * Column definitions are extracted into factory functions so that Home.tsx
 * can memoize them with `useMemo` and avoid recreating the full column
 * array on every render. Each factory accepts callback props (navigate,
 * add, remove) so the columns remain decoupled from routing and state logic.
 *
 * Visual behavior:
 *   - Courses already in the schedule OR that conflict with it are visually
 *     dimmed (opacity-30) in the search results table.
 *   - The "action" column is marked `meta: { sticky: true }` so DataTable
 *     can pin it to the right edge during horizontal scroll.
 *   - An AlertTriangle icon appears next to courses with zero open seats.
 */

import type { ColumnDef } from "@tanstack/react-table";
import type { Course } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { formatTime } from "@/lib/utils";

/** Options required to build the search-results column definitions */
interface ColumnOptions {
    /** Set of course IDs currently in the user's schedule */
    scheduledIds: Set<number>;
    /** Set of course IDs that have a time conflict with the schedule */
    conflictingIds: Set<number>;
    /** Navigate to a course detail page by course ID */
    onNavigate: (id: number) => void;
    /** Add a course to the schedule */
    onAdd: (course: Course) => void;
    /** Remove a course from the schedule */
    onRemove: (course: Course) => void;
}

/**
 * Builds the column definition array for the search-results DataTable.
 *
 * Columns: Dept, Code, Section, Course name (clickable link), Credits,
 * Open Seats (with warning icon when 0), Professor, Days & Time, Action
 * (Add / Remove button depending on schedule membership).
 *
 * Rows for courses that are already scheduled or conflict with the schedule
 * are visually dimmed via the `dimClass` helper.
 */
export function getSearchColumns({
    scheduledIds,
    conflictingIds,
    onNavigate,
    onAdd,
    onRemove,
}: ColumnOptions): ColumnDef<Course>[] {
    /** Returns "opacity-30" if the course should be dimmed, empty string otherwise */
    const dimClass = (id: number) =>
        scheduledIds.has(id) || conflictingIds.has(id) ? "opacity-30" : "";

    return [
        {
            accessorKey: "subject",
            header: "Dept",
            cell: ({ row }) => <span className={dimClass(row.original.id)}>{row.original.subject}</span>,
        },
        {
            accessorKey: "code",
            header: "Code",
            cell: ({ row }) => <span className={dimClass(row.original.id)}>{row.original.code}</span>,
        },
        {
            accessorKey: "section",
            header: "Section",
            cell: ({ row }) => <span className={dimClass(row.original.id)}>{row.original.section}</span>,
        },
        {
            accessorKey: "name",
            header: "Course name",
            cell: ({ row }) => (
                <button
                    onClick={() => onNavigate(row.original.id)}
                    className="text-left hover:underline cursor-pointer text-foreground"
                >
                    <span className={dimClass(row.original.id)}>{row.original.name}</span>
                </button>
            ),
        },
        {
            accessorKey: "creditHours",
            header: "Credits",
            cell: ({ row }) => <span className={dimClass(row.original.id)}>{row.original.creditHours}</span>,
        },
        {
            accessorKey: "openSeats",
            header: "Open Seats",
            cell: ({ row }) => {
                const noSeats = row.original.openSeats === 0;
                return (
                    <span className={dimClass(row.original.id)}>
                        {/* Warn the user when no seats are available */}
                        {noSeats && <AlertTriangle className="inline h-3.5 w-3.5 mr-1 text-amber-500" />}
                        {row.original.openSeats}
                    </span>
                );
            },
        },
        {
            id: "professor",
            header: "Professor",
            cell: ({ row }) => {
                const professors = row.original.professors;
                if (!Array.isArray(professors)) return null;
                const text = professors.map((p) => `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim()).join(", ");
                return <span className={dimClass(row.original.id)}>{text}</span>;
            },
        },
        {
            id: "time",
            header: "Days & Time",
            cell: ({ row }) => {
                const times = row.original.times;
                if (!Array.isArray(times)) return null;
                // Format each timeslot as "DAY START\u2013END" (en-dash between times)
                const text = times.map((t) => {
                    const day = String(t.day);
                    const start = Array.isArray(t.start_time) ? formatTime(t.start_time) : String(t.start_time);
                    const end = Array.isArray(t.end_time) ? formatTime(t.end_time) : String(t.end_time);
                    return `${day} ${start}\u2013${end}`;
                }).join(", ");
                return <span className={dimClass(row.original.id)}>{text}</span>;
            },
        },
        {
            id: "action",
            header: "",
            // DataTable reads meta.sticky to pin this column to the right edge
            meta: { sticky: true },
            cell: ({ row }) => {
                const course = row.original;

                // Already in schedule — offer removal
                if (scheduledIds.has(course.id)) {
                    return (
                        <Button variant="destructive" size="sm" onClick={() => onRemove(course)}>
                            Remove
                        </Button>
                    );
                }

                // Time conflict — hide the button (row is already dimmed)
                if (conflictingIds.has(course.id)) return null;

                // Default — offer to add
                return (
                    <Button size="sm" onClick={() => onAdd(course)}>
                        Add
                    </Button>
                );
            },
        },
    ];
}

/** Options required to build the schedule column definitions */
interface ScheduleColumnOptions {
    /** Navigate to a course detail page by course ID */
    onNavigate: (id: number) => void;
    /** Remove a course from the schedule */
    onRemove: (course: any) => void;
}

/**
 * Builds the column definition array for the schedule DataTable shown
 * below the calendar view.
 *
 * Columns: Dept, Code, Section, Course name (clickable), Professor,
 * Days & Time, Remove button.
 */
export function getScheduleColumns({ onNavigate, onRemove }: ScheduleColumnOptions): ColumnDef<any>[] {
    return [
        { accessorKey: "subject", header: "Dept" },
        { accessorKey: "code", header: "Code" },
        { accessorKey: "section", header: "Section" },
        {
            accessorKey: "name",
            header: "Course name",
            cell: ({ row }) => (
                <button
                    onClick={() => onNavigate(row.original.id)}
                    className="text-left hover:underline cursor-pointer text-foreground"
                >
                    {row.original.name}
                </button>
            ),
        },
        {
            id: "professor",
            header: "Professor",
            cell: ({ row }) => {
                const professors = row.original.professors;
                if (!Array.isArray(professors)) return null;
                return professors.map((p: any) => `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim()).join(", ");
            },
        },
        {
            id: "time",
            header: "Days & Time",
            cell: ({ row }) => {
                const times = row.original.times;
                if (!Array.isArray(times)) return null;
                return times.map((t: any) => {
                    const day = String(t.day);
                    const start = Array.isArray(t.start_time) ? formatTime(t.start_time) : String(t.start_time);
                    const end = Array.isArray(t.end_time) ? formatTime(t.end_time) : String(t.end_time);
                    return `${day} ${start}\u2013${end}`;
                }).join(", ");
            },
        },
        {
            id: "remove",
            header: "",
            meta: { sticky: true },
            cell: ({ row }) => (
                <Button variant="destructive" size="sm" onClick={() => onRemove(row.original)}>
                    Remove
                </Button>
            ),
        },
    ];
}
