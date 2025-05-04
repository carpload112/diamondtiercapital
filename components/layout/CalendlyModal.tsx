"\"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import LoadingSpinner from "@/app/components/LoadingSpinner"

interface CalendlyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  // Only render the modal on the client side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <div className="relative h-[600px] w-full">
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-4 z-10 rounded-full bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-gray-200"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <LoadingSpinner size="lg" />
            </div>
          )}

          <iframe
            src="https://calendly.com/diamondtiercapital/30min"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Schedule Consultation"
            className="rounded-lg"
            onLoad={() => setLoading(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
