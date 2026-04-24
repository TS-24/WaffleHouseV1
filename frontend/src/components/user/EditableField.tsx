"use client"

import { useState } from "react"
import { Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditDialog from "./EditDialog"
import type { EditableFieldProps } from "./types"

/**
 * EditableField Component
 * Wrapper for a profile field that opens an edit dialog on click
 */
export default function EditableField({
  label,
  value,
  onUpdate,
}: EditableFieldProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSave = async (newValue: string) => {
    await onUpdate(newValue)
    setIsDialogOpen(false)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
  }

  return (
    <>
      {/* Field Display */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
          <span className="text-sm font-medium">{value}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit dialog */}
      <EditDialog
        isOpen={isDialogOpen}
        label={label}
        currentValue={value}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </>
  )
}
