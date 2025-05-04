"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAdminAuth } from "@/lib/admin-auth"
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, logout } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin") {
      router.push("/admin")
    }
  }, [isAuthenticated, router, pathname])

  // Navigation items
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Applications", href: "/admin/applications", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  // If on the login page and not authenticated, just show the login form
  if (!isAuthenticated && pathname === "/admin") {
    return <div className="min-h-screen bg-slate-50">{children}</div>
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar for desktop */}
      <div className="w-full md:w-64 bg-gray-100 border-r border-gray-200 md:min-h-screen">
        <div className="p-4">
          <div className="flex items-center justify-between md:justify-start">
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
                      className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                        isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="p-4 border-t border-slate-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              onClick={() => {
                logout()
                router.push("/admin")
                setMobileMenuOpen(false)
              }}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
        {/* Top header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.name ||
                  "Dashboard"}
              </h2>
              <div className="flex items-center text-sm text-slate-500">
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
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600"
              onClick={() => {
                logout()
                router.push("/admin")
              }}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </header>

        {/* Page content */}
        {children}
      </main>
    </div>
  )
}
