"use client"

import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider"
import type { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-slate-50">{children}</div>
    </AdminAuthProvider>
  )
}
