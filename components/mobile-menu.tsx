"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu, X } from "lucide-react"

interface MenuItem {
  title: string
  href: string
  icon?: React.ReactNode
  children?: MenuItem[]
}

interface MobileMenuProps {
  items: MenuItem[]
  className?: string
}

/**
 * Mobile menu component
 */
export function MobileMenu({ items, className = "" }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div className={`lg:hidden ${className}`}>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} aria-label="Open menu">
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div ref={menuRef} className="fixed inset-y-0 right-0 w-full max-w-xs bg-background shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-100px)]">
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={index}>
                    {item.children ? (
                      <div className="space-y-3">
                        <div className="font-medium text-sm text-muted-foreground">{item.title}</div>
                        <div className="space-y-1 pl-2">
                          {item.children.map((child, childIndex) => (
                            <Button key={childIndex} variant="ghost" asChild className="w-full justify-start">
                              <Link href={child.href}>
                                {child.icon && <span className="mr-2">{child.icon}</span>}
                                {child.title}
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <Link href={item.href}>
                          {item.icon && <span className="mr-2">{item.icon}</span>}
                          {item.title}
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  )
}
