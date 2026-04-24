/**
 * User Profile Types
 */

export interface UserProfile {
  name: string
  major: string
  year: string
  advisor: string
}

export interface EditableFieldProps {
  label: string
  value: string
  onUpdate: (newValue: string) => Promise<void>
}

export interface ProfileDisplayProps {
  userProfile: UserProfile
  onNameUpdate: (newName: string) => Promise<void>
  onMajorUpdate: (newMajor: string) => Promise<void>
  onYearUpdate: (newYear: string) => Promise<void>
  onAdvisorUpdate: (newAdvisor: string) => Promise<void>
}

export interface EditDialogProps {
  isOpen: boolean
  label: string
  currentValue: string
  onSave: (newValue: string) => Promise<void>
  onCancel: () => void
}
