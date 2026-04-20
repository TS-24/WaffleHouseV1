/**
 * @file HomeHeader.tsx
 * @description Top navigation bar for the Home page.
 *
 * Contains three sections laid out in a flex row:
 *   1. **SearchCalendarBar** — the animated search input / calendar mode
 *      toggle that sits in the center of the header.
 *   2. **Save / Load Schedule buttons** — persist the current schedule to
 *      (or restore it from) the backend via POST /schedule/save and
 *      POST /schedule/load. Success or failure is communicated through
 *      the `showToast` callback.
 *   3. **User avatar** — placeholder avatar button (top-right).
 *
 * This component is intentionally "dumb" — it receives all state and
 * callbacks via props so that it never subscribes to sidebar context
 * or owns schedule state, keeping re-renders cheap.
 */

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchCalendarBar from "@/components/SearchCalendarBar.tsx";
import type { Mode, Course } from "@/lib/types";

interface HomeHeaderProps {
    /** Whether the user has performed at least one search */
    hasSearched: boolean;
    /** Setter to mark that a search has been performed */
    setHasSearched: (value: boolean) => void;
    /** Replace the search results array */
    setResults: (results: Course[]) => void;
    /** Current view mode: "search" (table) or "calendar" */
    mode: Mode;
    /** Switch between search and calendar mode */
    setMode: (mode: Mode) => void;
    /** Display a transient toast notification (message, success/failure) */
    showToast: (message: string, ok: boolean) => void;
    /** Called after a successful schedule load with the loaded course array */
    onScheduleLoad: (data: any[]) => void;
}

export default function HomeHeader({
    hasSearched,
    setHasSearched,
    setResults,
    mode,
    setMode,
    showToast,
    onScheduleLoad,
}: HomeHeaderProps) {
    return (
        <header className="relative h-16 flex items-center px-6 mt-4 gap-2">
            {/* Animated search / calendar toggle — centered via absolute positioning */}
            <SearchCalendarBar
                hasSearched={hasSearched}
                setHasSearched={setHasSearched}
                setResults={setResults}
                mode={mode}
                setMode={setMode}
            />

            {/* Right-aligned action buttons */}
            <div className="ml-auto flex items-center gap-2">
                {/* Persist the in-memory schedule to disk on the backend */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                        try {
                            const res = await fetch("http://localhost:7001/schedule/save", {
                                method: "POST",
                            });
                            if (!res.ok) {
                                showToast("Failed to save schedule.", false);
                                console.error("Failed to save schedule:", await res.text());
                            } else {
                                showToast("Schedule saved successfully.", true);
                            }
                        } catch (err) {
                            showToast("Failed to save schedule.", false);
                            console.error("Error saving schedule:", err);
                        }
                    }}
                >
                    Save Schedule
                </Button>

                {/* Restore a previously saved schedule from the backend */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                        try {
                            const res = await fetch("http://localhost:7001/schedule/load", {
                                method: "POST",
                            });
                            if (!res.ok) {
                                showToast("Failed to load schedule.", false);
                                console.error("Failed to load schedule:", await res.text());
                                return;
                            }
                            const data = await res.json();
                            onScheduleLoad(data);
                            showToast("Schedule loaded successfully.", true);
                        } catch (err) {
                            showToast("Failed to load schedule.", false);
                            console.error("Error loading schedule:", err);
                        }
                    }}
                >
                    Load Schedule
                </Button>

                {/* User avatar — currently a static placeholder */}
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>IT</AvatarFallback>
                    </Avatar>
                </Button>
            </div>
        </header>
    );
}
