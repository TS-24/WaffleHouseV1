"use client"

import { useState } from "react"
import { Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditableField from "./EditableField"
import EditDialog from "./EditDialog"
import type { ProfileDisplayProps } from "./types"

/**
 * ProfileDisplay Component
 * Displays all user profile fields in an editable format within a card
 */
export default function ProfileDisplay({
  userProfile,
  onNameUpdate,
  onMajorUpdate,
  onYearUpdate,
  onAdvisorUpdate,
}: ProfileDisplayProps) {
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false)

  const handleNameSave = async (newName: string) => {
    await onNameUpdate(newName)
    setIsNameDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Name Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-foreground">
            {userProfile.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Click to edit your name
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsNameDialogOpen(true)}
          className="gap-2"
        >
          <Edit3 className="h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Name Edit Dialog */}
      <EditDialog
        isOpen={isNameDialogOpen}
        label="Name"
        currentValue={userProfile.name}
        onSave={handleNameSave}
        onCancel={() => setIsNameDialogOpen(false)}
      />

      {/* Profile Fields Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <EditableField
          label="Major"
          value={userProfile.major}
          onUpdate={onMajorUpdate}
        />
        <EditableField
          label="Year in School"
          value={userProfile.year}
          onUpdate={onYearUpdate}
        />
        <EditableField
          label="Advisor"
          value={userProfile.advisor}
          onUpdate={onAdvisorUpdate}
        />
      </div>
    </div>
  )
}
