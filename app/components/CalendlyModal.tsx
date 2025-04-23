"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface CalendlyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] sm:h-[80vh] p-0 w-[95vw] sm:w-[90vw] rounded-xl border-none">
        <div className="relative h-full rounded-xl overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <iframe
            src="https://calendly.com/diamondtiersolution/business-consultation?back=1&month=2025-01"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Schedule Consultation"
            className="rounded-xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
