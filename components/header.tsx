"use client"

import type React from "react"
import Link from "next/link"

interface DashboardHeaderProps {
  title: string
  description?: string
  backLink?: string
  backLinkText?: string
  actions?: React.ReactNode
  className?: string
}

function DashboardHeader({
  title,
  description,
  backLink,
  backLinkText = "Back",
  actions,
  className = "",
}: DashboardHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      {backLink && (
        <div className="mb-2">
          <Link href={backLink} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            <span>←</span> {backLinkText}
          </Link>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  )
}

// Export both as default and named export to support both import styles
export { DashboardHeader }
export default DashboardHeader
