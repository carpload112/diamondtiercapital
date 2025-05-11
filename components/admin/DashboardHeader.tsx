"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

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
        <Button variant="ghost" size="sm" className="mb-2 -ml-2 h-8 text-muted-foreground" asChild>
          <Link href={backLink}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            {backLinkText}
          </Link>
        </Button>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}

export { DashboardHeader }
