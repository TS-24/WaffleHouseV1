import { useState } from "react"
import type {ColumnDef} from "@tanstack/react-table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import BigCalendar from "@/components/BigCalendar"
import { DataTable } from "@/components/DataTable"
import Footer from "@/components/Footer.tsx";
import { SearchIcon } from "lucide-react"

// TODO: Replace with actual response type from Java API
interface Course {
    id: number
    name: string
    description: string
}

// TODO: Update columns to match actual API response fields
const columns: ColumnDef<Course>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
]


export default function Home() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<Course[]>([])
    return (
        <div className="min-h-screen flex flex-col bg-background">

            <Tabs
                defaultValue="search"
                className="flex flex-col min-h-screen"
            >
                {/* Header */}
                <header className="relative h-16 flex items-center px-6">

                    {/* Centered Tabs */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <TabsList className="pointer-events-auto">
                            <TabsTrigger value="search">Search</TabsTrigger>
                            <TabsTrigger value="calendar">Calendar</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Avatar aligned right */}
                    <div className="ml-auto">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Avatar>
                                <AvatarImage src="" />
                                <AvatarFallback>IT</AvatarFallback>
                            </Avatar>
                        </Button>
                    </div>

                </header>

                {/* Main Content */}
                <main className="flex flex-1 min-h-full mb-16">

                    <TabsContent
                        value="search"
                        className="flex-1 flex items-center justify-center px-6"
                    >
                        <form
                            className="flex-1 flex items-center justify-center min-w-xs max-w-2/5"
                            onSubmit={async (e) => {
                                e.preventDefault()
                                if (!query.trim()) return

                                // TODO: Replace with actual API endpoint
                                // const response = await fetch(`/api/courses/search?q=${encodeURIComponent(query.trim())}`)
                                // const data: Course[] = await response.json()
                                // setResults(data)
                            }}
                        >
                            <InputGroup className="min-w-xs max-w-full rounded-3xl px-2 h-14">
                                <InputGroupInput
                                    type="search"
                                    placeholder="Search courses..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <InputGroupAddon>
                                    <SearchIcon className="h-5 w-5" />
                                </InputGroupAddon>
                                {/* TODO: Spinner */}
                            </InputGroup>
                            <button type="submit" value="Submit" hidden />  {/* so that submission actually works */}
                        </form>
                        {results.length > 0 && (
                            <div className="w-full max-w-4xl mx-auto mt-6">
                                <DataTable columns={columns} data={results} />
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent
                        value="calendar"
                        className="flex-1 flex items-center justify-center"
                    >
                        <BigCalendar />

                    </TabsContent>

                    <div className="min-h-full">

                    </div>

                </main>

                {/* Footer (same height as header) */}
                <Footer />

            </Tabs>
        </div>
    )
}