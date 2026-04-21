/**
 * Filters sidebar. Owns the filter form state (uncontrolled via ref) and
 * triggers re-queries through `setResults` whenever a field changes.
 *
 * @author Ina Tang
 */

import * as React from "react"
import { useRef } from "react"
import type { Course } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { filterCourses } from "@/services/search"

interface FiltersSidebarProps {
    setResults: (results: Course[]) => void
}

function FiltersSidebarInner({ setResults }: FiltersSidebarProps) {
    const formRef = useRef<HTMLFormElement>(null)

    const submitFilters = async () => {
        if (!formRef.current) return
        const formData = new FormData(formRef.current)

        const getString = (name: string): string | null => {
            const val = formData.get(name)
            return val && String(val).trim() ? String(val).trim() : null
        }

        const startTime = getString("start-time")
        const endTime = getString("end-time")
        const day = getString("day-of-week")

        let time: Record<string, unknown> | null = null
        if (startTime || endTime || day) {
            time = {}
            if (day) time.day = day
            if (startTime) time.start_time = startTime.split(":").map(Number)
            if (endTime) time.end_time = endTime.split(":").map(Number)
        }

        try {
            const filterRes = await filterCourses({
                semester: getString("semester"),
                name: getString("name"),
                prof: getString("prof"),
                dept: getString("dept"),
                credits: getString("credits"),
                year: getString("year"),
                time: time as any,
            })
            setResults(filterRes)
        } catch (err) {
            console.error("Filter error:", err)
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        submitFilters()
    }

    return (
        <Sidebar variant="floating" collapsible="offcanvas">
            <SidebarHeader className="px-4 py-3 text-lg font-semibold">Filters</SidebarHeader>
            <SidebarContent className="px-2">
                <form ref={formRef} onSubmit={handleSubmit} onChange={submitFilters}>
                    <SidebarGroup>
                        <SidebarGroupLabel>Year</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <Input id="year" name="year" type="number" placeholder="2024" />
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Semester</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <Input id="semester" name="semester" placeholder="Fall, Spring, Winter_Online..." />
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Department</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <Input id="department" name="dept" placeholder="Department" />
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Course name</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <Input id="course-name" name="name" placeholder="Course name" />
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Number of credits</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <Input id="credit" name="credits" type="number" />
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Days of the week</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <NativeSelect id="day-of-week" name="day-of-week">
                                <NativeSelectOption value="">Select a day...</NativeSelectOption>
                                <NativeSelectOption value="M">Monday</NativeSelectOption>
                                <NativeSelectOption value="T">Tuesday</NativeSelectOption>
                                <NativeSelectOption value="W">Wednesday</NativeSelectOption>
                                <NativeSelectOption value="R">Thursday</NativeSelectOption>
                                <NativeSelectOption value="F">Friday</NativeSelectOption>
                            </NativeSelect>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Time range</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <Input id="start-time" name="start-time" type="time" min="08:00" max="21:00" step="900" />
                            <Input id="end-time" name="end-time" type="time" min="08:00" max="21:00" step="900" />
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Professor</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <Input id="professor" name="prof" placeholder="Hutchins, Jon, or..." />
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <button type="submit" hidden />
                </form>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

/**
 * Memoized so that toggling the sidebar's open/collapsed state (which
 * triggers SidebarProvider to re-render) does not re-render this subtree
 * when `setResults` is a stable reference.
 */
export const FiltersSidebar = React.memo(FiltersSidebarInner)
