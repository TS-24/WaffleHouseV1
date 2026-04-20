/**
 * @author Ina Tang
 */

import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar({ onFilterChange }: { onFilterChange?: () => void }) {

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="px-4 py-3 text-lg font-semibold">Filters</SidebarHeader>
      <SidebarContent className="px-2" onInput={onFilterChange} onChange={onFilterChange}>
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
            <Input id="start-time" name="start-time" type="time" min="08:00" max="21:00" step="900"/>
            <Input id="end-time" name="end-time" type="time" min="08:00" max="21:00" step="900"/>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Professor</SidebarGroupLabel>
          <SidebarGroupContent>
            <Input id="professor" name="prof" placeholder="Hutchins, Jon, or..." />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}