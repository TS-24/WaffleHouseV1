/* Shared types and interfaces */

// Track state of SearchBarCalendar
export type Mode = "search" | "calendar"

// Wrapper for Course class in frontend
export interface Course {
    id: number
    name: string
    code: number
    section: string
    department: string
    professor: string
    creditHours: number
    year: number
    semester: number
    times: Date[]
};