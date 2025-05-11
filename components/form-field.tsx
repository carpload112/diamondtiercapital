import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

interface FormFieldProps {
  id: string
  label: string
  children: ReactNode
  error?: string
  description?: string
  required?: boolean
  className?: string
}

/**
 * Reusable form field component with label and error handling
 */
export function FormField({
  id,
  label,
  children,
  error,
  description,
  required = false,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className={error ? "text-destructive" : ""}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>

        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>

      {children}

      {error && (
        <div className="flex items-center text-xs text-destructive mt-1">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}
    </div>
  )
}
