"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { submitCreditRepairApplication } from "@/lib/form-service"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const creditIssues = [
  "Late Payments",
  "Collections",
  "Charge-offs",
  "Bankruptcy",
  "Foreclosure",
  "Tax Liens",
  "Judgments",
  "Repossessions",
  "Inquiries",
  "Identity Theft",
]

export default function CreditRepairForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentScore: "",
    desiredScore: "",
    issues: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (issue: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      issues: checked ? [...prev.issues, issue] : prev.issues.filter((i) => i !== issue),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Convert numeric fields to numbers
      await submitCreditRepairApplication({
        ...formData,
        currentScore: Number.parseInt(formData.currentScore) || 0,
        desiredScore: Number.parseInt(formData.desiredScore) || 0,
      })

      setIsSubmitted(true)
      toast({
        title: "Application Submitted",
        description: "We've received your credit repair application and will contact you soon.",
        variant: "default",
      })

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        currentScore: "",
        desiredScore: "",
        issues: [],
      })
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for submitting your credit repair application. One of our specialists will contact you shortly.
          </p>
          <Button onClick={() => setIsSubmitted(false)}>Submit Another Application</Button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Credit Repair Application</h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentScore">Current Credit Score</Label>
                <Input
                  id="currentScore"
                  name="currentScore"
                  type="number"
                  min="300"
                  max="850"
                  value={formData.currentScore}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="desiredScore">Desired Credit Score</Label>
                <Input
                  id="desiredScore"
                  name="desiredScore"
                  type="number"
                  min="300"
                  max="850"
                  value={formData.desiredScore}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label className="block mb-2">Credit Issues (Select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {creditIssues.map((issue) => (
                  <div key={issue} className="flex items-center space-x-2">
                    <Checkbox
                      id={`issue-${issue}`}
                      checked={formData.issues.includes(issue)}
                      onCheckedChange={(checked) => handleCheckboxChange(issue, checked === true)}
                    />
                    <Label htmlFor={`issue-${issue}`}>{issue}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
