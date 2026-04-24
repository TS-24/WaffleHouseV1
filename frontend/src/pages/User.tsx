import { useState, useEffect } from "react"
import { FileText, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProfileDisplay from "@/components/user/ProfileDisplay"
import { supabase } from "@/lib/supabase"
import {
  getCurrentUserProfile,
  updateUserName,
  updateUserMajor,
  updateUserYear,
  updateUserAdvisor,
} from "@/services/userInfo"
import type { UserProfile } from "@/lib/types"

/**
 * User Profile Page Component
 * Displays and manages user profile information in a Vercel-style dashboard
 */
export default function User() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get current user ID from session
        const { data: { session } } = await supabase.auth.getSession()
        if (!session || !session.user) {
          throw new Error("User is not authenticated")
        }

        setUserId(session.user.id)

        // Fetch user profile from Supabase
        const profile = await getCurrentUserProfile()
        setUserProfile(profile)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load profile"
        setError(message)
        console.error("Error fetching user profile:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  /**
   * Updates user name and persists to Supabase
   */
  const updateName = async (newName: string) => {
    if (!userId) {
      setError("User ID not available")
      return
    }

    try {
      await updateUserName(userId, newName)
      setUserProfile((prev) => prev ? { ...prev, name: newName } : null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update name"
      setError(message)
      console.error("Error updating name:", err)
    }
  }

  /**
   * Updates user major and persists to Supabase
   */
  const updateMajor = async (newMajor: string) => {
    if (!userId) {
      setError("User ID not available")
      return
    }

    try {
      await updateUserMajor(userId, newMajor)
      setUserProfile((prev) => prev ? { ...prev, major: newMajor } : null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update major"
      setError(message)
      console.error("Error updating major:", err)
    }
  }

  /**
   * Updates user year and persists to Supabase
   */
  const updateYear = async (newYear: string) => {
    if (!userId) {
      setError("User ID not available")
      return
    }

    try {
      await updateUserYear(userId, newYear)
      setUserProfile((prev) => prev ? { ...prev, year: newYear } : null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update year"
      setError(message)
      console.error("Error updating year:", err)
    }
  }

  /**
   * Updates user advisor and persists to Supabase
   */
  const updateAdvisor = async (newAdvisor: string) => {
    if (!userId) {
      setError("User ID not available")
      return
    }

    try {
      await updateUserAdvisor(userId, newAdvisor)
      setUserProfile((prev) => prev ? { ...prev, advisor: newAdvisor } : null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update advisor"
      setError(message)
      console.error("Error updating advisor:", err)
    }
  }

  const handleViewStatusSheet = () => {
    // TODO: Link to PDF status sheet
    console.log("View Status Sheet clicked")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No profile data available</p>
        </div>
      </div>
    )
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
      </div>
    </div>
  )
}
