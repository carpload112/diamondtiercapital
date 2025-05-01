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
      <DialogContent className="sm:max-w-[800px] h-[90vh] sm:h-[80vh] p-0 w-[95vw] sm:w-[90vw]">
        <div className="relative h-full">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute top-0 left-0 right-0 bg-white p-2 text-center text-xs text-gray-500">
            Schedule a consultation to discuss business funding options that may be available to you. This is a
            consultation only and does not guarantee approval for any financial product.
          </div>
          <iframe
            src="https://calendly.com/diamondtiersolution/business-consultation?back=1&month=2025-01"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Schedule Consultation"
            className="rounded-lg pt-8"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
