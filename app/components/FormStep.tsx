"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import * as LucideIcons from "lucide-react"

interface Field {
  name: string
  label: string
  type: string
  placeholder?: string
  options?: string[]
  required?: boolean
  tooltip?: string
}

interface FormStepProps {
  step: {
    title: string
    description: string
    fields: Field[]
    icon?: string
  }
  formData: Record<string, any>
  onChange: (name: string, value: any) => void
  errors: Record<string, string>
  touchedFields?: Record<string, boolean>
  setTouchedFields?: (fields: Record<string, boolean>) => void
}

export default function FormStep({ step, formData, onChange, errors, touchedFields, setTouchedFields }: FormStepProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const touchedFieldsValue = touchedFields || {}

  // Get the icon component if specified
  const IconComponent = step.icon ? (LucideIcons as any)[step.icon] : null

  const handleBlur = (fieldName: string) => {
    setFocusedField(null)
    setTouchedFields?.({ ...(touchedFields || {}), [fieldName]: true })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0 },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={containerVariants} className="space-y-8">
      <motion.div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6" variants={itemVariants}>
        {IconComponent && (
          <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary">
            <IconComponent className="w-7 h-7" />
          </div>
        )}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-base">{step.description}</p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {step.fields.map((field, index) => {
          const isFieldValid = !errors[field.name] && touchedFieldsValue?.[field.name] && formData[field.name]
          const isFieldInvalid = errors[field.name] && touchedFieldsValue?.[field.name]
          const isFocused = focusedField === field.name

          return (
            <motion.div
              key={field.name}
              className="space-y-2.5"
              variants={itemVariants}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center gap-2">
                <Label
                  htmlFor={field.name}
                  className={cn(
                    "text-sm font-medium",
                    isFocused ? "text-primary" : "text-gray-700 dark:text-gray-300",
                    isFieldValid && "text-green-600 dark:text-green-400",
                  )}
                >
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>

                {field.tooltip && (
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent
                        className="max-w-xs p-3 text-sm bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
                        side="right"
                      >
                        <p>{field.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {isFieldValid && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </motion.div>
                )}
              </div>

              {field.type === "select" ? (
                <div className="relative">
                  <Select
                    onValueChange={(value) => onChange(field.name, value)}
                    value={formData[field.name] || ""}
                    onOpenChange={() => setTouchedFields?.({ ...(touchedFields || {}), [field.name]: true })}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full h-11 transition-all duration-200",
                        isFocused && "ring-2 ring-primary/50",
                        isFieldValid && "border-green-500 dark:border-green-500",
                        isFieldInvalid && "border-red-500 ring-red-500/50",
                      )}
                    >
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[field.name] && touchedFieldsValue?.[field.name] && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 mt-2"
                    >
                      <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                      <p className="text-sm text-red-500">{errors[field.name]}</p>
                    </motion.div>
                  )}
                </div>
              ) : field.type === "radio" ? (
                <div>
                  <RadioGroup
                    onValueChange={(value) => onChange(field.name, value)}
                    value={formData[field.name] || ""}
                    className="flex flex-col space-y-3"
                  >
                    {field.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-3">
                        <RadioGroupItem
                          value={option}
                          id={`${field.name}-${option}`}
                          className={cn("transition-all duration-200", isFieldInvalid && "border-red-500")}
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => handleBlur(field.name)}
                        />
                        <Label htmlFor={`${field.name}-${option}`} className="text-sm text-gray-700 dark:text-gray-300">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors[field.name] && touchedFieldsValue?.[field.name] && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 mt-2"
                    >
                      <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                      <p className="text-sm text-red-500">{errors[field.name]}</p>
                    </motion.div>
                  )}
                </div>
              ) : field.type === "checkbox" ? (
                <div className="flex items-start space-x-3 pt-1">
                  <Checkbox
                    id={field.name}
                    checked={formData[field.name] || false}
                    onCheckedChange={(checked) => onChange(field.name, checked)}
                    className={cn(
                      "transition-all duration-200",
                      isFieldInvalid && "border-red-500",
                      isFocused && "ring-2 ring-primary/50",
                    )}
                    onFocus={() => setFocusedField(field.name)}
                    onBlur={() => handleBlur(field.name)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={field.name} className="text-sm text-gray-700 dark:text-gray-300 leading-tight">
                      {field.placeholder}
                    </Label>
                    {errors[field.name] && touchedFieldsValue?.[field.name] && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 mt-1"
                      >
                        <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                        <p className="text-sm text-red-500">{errors[field.name]}</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : field.type === "textarea" ? (
                <div>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    className={cn(
                      "min-h-[100px] transition-all duration-200",
                      isFocused && "ring-2 ring-primary/50",
                      isFieldValid && "border-green-500 dark:border-green-500",
                      isFieldInvalid && "border-red-500 ring-red-500/50",
                    )}
                    onFocus={() => setFocusedField(field.name)}
                    onBlur={() => handleBlur(field.name)}
                  />
                  {errors[field.name] && touchedFieldsValue?.[field.name] && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 mt-2"
                    >
                      <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                      <p className="text-sm text-red-500">{errors[field.name]}</p>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    className={cn(
                      "h-11 transition-all duration-200",
                      isFocused && "ring-2 ring-primary/50",
                      isFieldValid && "border-green-500 dark:border-green-500",
                      isFieldInvalid && "border-red-500 ring-red-500/50",
                    )}
                    onFocus={() => setFocusedField(field.name)}
                    onBlur={() => handleBlur(field.name)}
                  />
                  {errors[field.name] && touchedFieldsValue?.[field.name] && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 mt-2"
                    >
                      <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                      <p className="text-sm text-red-500">{errors[field.name]}</p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
