"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

interface FormStepProps {
  step: {
    title: string
    description: string
    icon: string
    fields: Array<{
      name: string
      label: string
      type: string
      placeholder?: string
      options?: string[]
      required?: boolean
      tooltip?: string
      component?: string
    }>
  }
  formData: Record<string, any>
  onChange: (name: string, value: any) => void
  errors: Record<string, string>
  touchedFields: Record<string, boolean>
  setTouchedFields: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  renderCustomComponent?: (field: any) => React.ReactNode
}

export default function FormStep({
  step,
  formData,
  onChange,
  errors,
  touchedFields,
  setTouchedFields,
  renderCustomComponent,
}: FormStepProps) {
  const handleBlur = (name: string) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }))
  }

  const showError = (name: string) => {
    return touchedFields[name] && errors[name]
  }

  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{step.title}</h2>
        <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {step.fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {field.label}
                </Label>
                {field.tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{field.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              {field.required && <div className="text-xs text-gray-500">Required</div>}
            </div>

            {field.type === "text" && (
              <Input
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                className={showError(field.name) ? "border-red-500" : ""}
              />
            )}

            {field.type === "email" && (
              <Input
                id={field.name}
                name={field.name}
                type="email"
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                className={showError(field.name) ? "border-red-500" : ""}
              />
            )}

            {field.type === "tel" && (
              <Input
                id={field.name}
                name={field.name}
                type="tel"
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                className={showError(field.name) ? "border-red-500" : ""}
              />
            )}

            {field.type === "textarea" && (
              <Textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                className={`resize-none ${showError(field.name) ? "border-red-500" : ""}`}
                rows={4}
              />
            )}

            {field.type === "select" && field.options && (
              <Select
                value={formData[field.name] || ""}
                onValueChange={(value) => onChange(field.name, value)}
                onOpenChange={() => handleBlur(field.name)}
              >
                <SelectTrigger className={showError(field.name) ? "border-red-500" : ""}>
                  <SelectValue placeholder={field.placeholder || "Select an option"} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {field.type === "radio" && field.options && (
              <RadioGroup
                value={formData[field.name] || ""}
                onValueChange={(value) => onChange(field.name, value)}
                className="flex flex-col space-y-1"
              >
                {field.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${field.name}-${option}`} />
                    <Label htmlFor={`${field.name}-${option}`} className="text-sm font-normal">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {field.type === "checkbox" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.name}
                  checked={formData[field.name] || false}
                  onCheckedChange={(checked) => onChange(field.name, checked)}
                />
                <Label htmlFor={field.name} className="text-sm font-normal">
                  {field.placeholder}
                </Label>
              </div>
            )}

            {field.type === "custom" && renderCustomComponent && renderCustomComponent(field)}

            {showError(field.name) && <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
