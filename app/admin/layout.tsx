"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, CreditCard, RefreshCcw, Users, Settings, LogOut, Menu, X } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, logout } = useAuth()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && !isAdmin) {
      router.push("/")
    }
  }, [loading, user, isAdmin, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/admin/loan-applications", label: "Loan Applications", icon: <CreditCard className="h-5 w-5" /> },
    { href: "/admin/credit-repair", label: "Credit Repair Clients", icon: <RefreshCcw className="h-5 w-5" /> },
    { href: "/admin/users", label: "User Management", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="bg-white">
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <Link href="/admin/dashboard" className="flex items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cropped-Diamond-Tier-Main-Logo-2400x1800-1-1-OtGxrajBZ6tB8DXOUuNBKwF5Ag3vaG.png"
                alt="Diamond Tier Capital"
                className="h-8 w-auto"
              />
              <span className="ml-2 font-semibold text-lg">Admin</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
