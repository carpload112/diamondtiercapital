"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAdminAuth } from "@/lib/admin-auth"
import { FileText, Settings, LogOut, Menu, X, ChevronRight, User, Users, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, logout } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false)

  // Redirect to login if not authenticated, or to applications if on main admin page
  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin") {
      router.push("/admin")
    } else if (isAuthenticated && pathname === "/admin") {
      // Redirect to applications page when accessing the main admin route
      router.push("/admin/applications")
    }
  }, [isAuthenticated, router, pathname])

  // Force data refresh when navigating between affiliate and application pages
  useEffect(() => {
    const isAffiliatesPage = pathname.includes("/affiliates")
    const isApplicationsPage = pathname.includes("/applications")

    if (isAffiliatesPage || isApplicationsPage) {
      // Clear any cached data
      localStorage.removeItem("cachedAffiliateData")
      localStorage.removeItem("cachedApplicationData")

      // Force component re-render
      setMobileMenuOpen(mobileMenuOpen)
    }
  }, [pathname, mobileMenuOpen])

  // Navigation items
  const navItems = [
    { name: "Applications", href: "/admin/applications", icon: FileText },
    { name: "Affiliates", href: "/admin/affiliates", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  // If on the login page and not authenticated, just show the login form
  if (!isAuthenticated && pathname === "/admin") {
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
                logout()
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
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
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
                {pathname === "/admin"
                  ? "Applications"
                  : navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.name ||
                    "Applications"}
              </h2>
              <div className="flex items-center text-xs text-slate-500">
                <Link href="/admin/applications" className="hover:text-blue-600">
                  Admin
                </Link>
                {pathname !== "/admin" && !pathname.startsWith("/admin/applications") && (
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs flex items-center gap-1"
              onClick={() => {
                // Clear any cached data
                localStorage.removeItem("cachedAffiliateData")
                localStorage.removeItem("cachedApplicationData")

                // Force a hard refresh to get fresh data
                window.location.reload()
              }}
            >
              <RefreshCw className="h-3 w-3" />
              Refresh Data
            </Button>
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                <User className="h-3.5 w-3.5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content container */}
        <div className="p-4">
          {/* This ensures the children (page content) is always rendered */}
          {children}
        </div>

        {/* Loading overlay */}
        {isDataLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-lg flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
              <span>Loading data...</span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
