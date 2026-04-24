"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { EditDialogProps } from "@/lib/types"

/**
 * EditDialog Component
 * Modal dialog for editing a single user profile field
 */
export default function EditDialog({
  isOpen,
  label,
  currentValue,
  onSave,
  onCancel,
}: EditDialogProps) {
  const [inputValue, setInputValue] = useState(currentValue)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (inputValue.trim() === "") {
      return // Don't save empty values
    }

    setIsLoading(true)
    try {
      await onSave(inputValue)
      setInputValue(currentValue) // Reset after successful save
    } catch (error) {
      console.error("Error saving:", error)
      // Keep the dialog open and let the user try again
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setInputValue(currentValue) // Reset to current value
    onCancel()
  }

  // Update inputValue when dialog opens with new currentValue
  if (isOpen && inputValue !== currentValue) {
    setInputValue(currentValue)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {label}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Enter new ${label.toLowerCase()}`}
            className="mb-4"
            autoFocus
          />
        </div>

        <DialogFooter className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || inputValue.trim() === ""}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
