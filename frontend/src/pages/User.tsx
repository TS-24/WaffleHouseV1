import { useState } from "react"
import { FileText, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProfileDisplay from "@/components/user/ProfileDisplay"
import type { UserProfile } from "@/components/user/types"

/**
 * User Profile Page Component
 * Displays and manages user profile information in a Vercel-style dashboard
 */
export default function User() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Jane Smith",
    major: "Computer Science",
    year: "Junior",
    advisor: "Dr. Robert Johnson",
  })

  /**
   * Updates user name
   * TODO: Integrate with Supabase to persist changes
   */
  const updateName = async (newName: string) => {
    setUserProfile((prev: UserProfile) => ({ ...prev, name: newName }))
    // TODO: Call Supabase API
    // await supabase.from('users').update({ name: newName }).eq('id', userId)
  }

  /**
   * Updates user major
   * TODO: Integrate with Supabase to persist changes
   */
  const updateMajor = async (newMajor: string) => {
    setUserProfile((prev: UserProfile) => ({ ...prev, major: newMajor }))
    // TODO: Call Supabase API
    // await supabase.from('users').update({ major: newMajor }).eq('id', userId)
  }

  /**
   * Updates user year in school
   * TODO: Integrate with Supabase to persist changes
   */
  const updateYear = async (newYear: string) => {
    setUserProfile((prev: UserProfile) => ({ ...prev, year: newYear }))
    // TODO: Call Supabase API
    // await supabase.from('users').update({ year: newYear }).eq('id', userId)
  }

  /**
   * Updates user advisor
   * TODO: Integrate with Supabase to persist changes
   */
  const updateAdvisor = async (newAdvisor: string) => {
    setUserProfile((prev: UserProfile) => ({ ...prev, advisor: newAdvisor }))
    // TODO: Call Supabase API
    // await supabase.from('users').update({ advisor: newAdvisor }).eq('id', userId)
  }

  const handleViewStatusSheet = () => {
    // TODO: Link to PDF status sheet
    console.log("View Status Sheet clicked")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile</h1>
              <p className="text-muted-foreground mt-1">
                Manage your account information and preferences
              </p>
            </div>
            <Button
              onClick={handleViewStatusSheet}
              variant="outline"
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              View Status Sheet
            </Button>
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileDisplay
              userProfile={userProfile}
              onNameUpdate={updateName}
              onMajorUpdate={updateMajor}
              onYearUpdate={updateYear}
              onAdvisorUpdate={updateAdvisor}
            />
          </CardContent>
        </Card>

        {/* Additional Cards for future features */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Track your course completion and GPA
              </p>
              <div className="mt-4 text-2xl font-semibold">
                Coming Soon
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                View your current semester schedule
              </p>
              <div className="mt-4 text-2xl font-semibold">
                Coming Soon
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
