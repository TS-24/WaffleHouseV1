"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import type { EditDialogProps } from "./types"

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
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <SheetContent side="bottom" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit {label}</SheetTitle>
        </SheetHeader>

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

        <SheetFooter className="flex gap-2 justify-end">
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
