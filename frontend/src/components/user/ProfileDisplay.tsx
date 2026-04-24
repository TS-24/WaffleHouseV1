"use client"

import { useState } from "react"
import EditableField from "./EditableField"
import EditDialog from "./EditDialog"
import type { ProfileDisplayProps } from "@/lib/types"

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
      {/* Name Section - Fully Clickable */}
      <div
        onClick={() => setIsNameDialogOpen(true)}
        className="group cursor-pointer rounded-lg p-3 transition-all duration-200 hover:bg-accent hover:shadow-sm"
      >
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            Name
          </label>
          <h2 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {userProfile.name}
          </h2>
          <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            Click to edit
          </p>
        </div>
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
