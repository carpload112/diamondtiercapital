"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createAffiliate, updateAffiliate } from "@/lib/supabase/affiliate-actions"

interface AffiliateFormProps {
  mode: "create" | "edit"
  initialData?: {
    id?: string
    name?: string
    email?: string
    status?: string
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export function AffiliateForm({ mode, initialData, onSuccess, onCancel }: AffiliateFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Split name into first and last name if in edit mode
  const nameParts = initialData?.name?.split(" ") || ["", ""]
  const defaultFirstName = nameParts[0] || ""
  const defaultLastName = nameParts.slice(1).join(" ") || ""

  const [formData, setFormData] = useState({
    firstName: defaultFirstName,
    lastName: defaultLastName,
    email: initialData?.email || "",
    phone: "",
    companyName: "",
    status: initialData?.status || "active",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      let result

      if (mode === "create") {
        // Create new affiliate
        result = await createAffiliate({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName,
        })
      } else {
        // Update existing affiliate
        if (!initialData?.id) {
          throw new Error("Affiliate ID is required for updates")
        }

        result = await updateAffiliate(initialData.id, {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          status: formData.status,
        })
      }

      if (result.success) {
        toast({
          title: "Success",
          description:
            mode === "create" ? "Affiliate has been created successfully" : "Affiliate has been updated successfully",
        })

        if (onSuccess) {
          onSuccess()
        }
      } else {
        throw new Error(result.error || "Operation failed")
      }
    } catch (error) {
      console.error("Error in affiliate form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="John"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Doe"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="john@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (Optional)</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="(123) 456-7890"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name (Optional)</Label>
        <Input
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          placeholder="Acme Inc."
        />
      </div>

      {mode === "edit" && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : mode === "create" ? "Create Affiliate" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
