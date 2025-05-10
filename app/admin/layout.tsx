"use client"

import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X, ChevronRight, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"
import { Skeleton } from "@/components/ui/skeleton"

// AdminDashboard component
function AdminDashboard({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, isAdmin, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAdmin && pathname !== "/admin") {
      router.push("/admin")
    }
  }, [isAdmin, isLoading, router, pathname])

  // Navigation items
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Applications", href: "/admin/applications", icon: FileText },
    { name: "Affiliates", href: "/admin/affiliates", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  // If loading, show a skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="w-full max-w-md mx-auto">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  // If on the login page and not authenticated, just show the login form
  if (!isAdmin && pathname === "/admin") {
    return <div className="min-h-screen bg-slate-50">{children}</div>
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="w-full md:w-56 bg-white border-r border-gray-200 md:min-h-screen">
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-semibold text-gray-800">Diamond Tier Admin</h1>
            <button
              className="md:hidden p-1 rounded-md hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        <div className={`${mobileMenuOpen ? "block" : "hidden"} md:block`}>
          <nav className="mt-2 px-2">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-xs transition-colors",
                        isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50",
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-3.5 w-3.5 mr-2" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="p-3 border-t border-slate-100 mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 h-8"
              onClick={() => {
                signOut()
                router.push("/admin")
                setMobileMenuOpen(false)
              }}
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-3 md:p-4">
        {/* Top header */}
        <header className="bg-white border border-slate-100 rounded-md p-3 flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden mr-2 p-1 h-7 w-7"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-sm font-medium text-slate-900">
                {navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.name ||
                  "Dashboard"}
              </h2>
              <div className="flex items-center text-xs text-slate-500">
                <Link href="/admin" className="hover:text-blue-600">
                  Admin
                </Link>
                {pathname !== "/admin" && (
                  <>
                    <ChevronRight className="h-3 w-3 mx-1" />
                    <span>
                      {navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.name ||
                        ""}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {user && (
              <div className="flex items-center">
                <span className="text-xs text-slate-600 mr-2 hidden md:block">{user.email}</span>
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                    {user.email && user.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        {children}
      </main>
    </div>
  )
}

// Main layout component
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <AdminDashboard>{children}</AdminDashboard>
    </AdminAuthProvider>
  )
}
