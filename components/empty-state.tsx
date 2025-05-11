"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  actionOnClick?: () => void
  className?: string
}

/**
 * Empty state component for when there's no data to display
 */
export function EmptyState({ icon, title, description, actionLabel, actionOnClick, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}

      <h3 className="text-lg font-medium mb-2">{title}</h3>

      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}

      {actionLabel && actionOnClick && (
        <Button onClick={actionOnClick} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
