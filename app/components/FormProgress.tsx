"use client"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import * as LucideIcons from "lucide-react"

interface FormProgressProps {
  steps: { title: string; icon?: string }[]
  currentStep: number
  completion: number
}

export default function FormProgress({ steps, currentStep, completion }: FormProgressProps) {
  return (
    <div className="hidden md:block mb-10">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isLast = index === steps.length - 1
          const IconComponent = step.icon ? (LucideIcons as any)[step.icon] : null

          return (
            <li key={index} className={cn("flex items-center", !isLast && "w-full")}>
              <div className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    "z-10 flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300",
                    isCompleted
                      ? "bg-primary text-white"
                      : isCurrent
                        ? "border-2 border-primary bg-white dark:bg-gray-900 text-primary"
                        : "border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500",
                  )}
                  initial={false}
                  animate={isCompleted ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : IconComponent ? (
                    <IconComponent className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </motion.div>
                <motion.span
                  className={cn(
                    "absolute top-12 text-xs font-medium whitespace-nowrap transition-colors duration-300",
                    isCompleted || isCurrent ? "text-primary" : "text-gray-500",
                  )}
                  initial={false}
                  animate={isCurrent ? { y: [0, -3, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {step.title}
                </motion.span>
              </div>

              {!isLast && (
                <div className="relative w-full mx-2">
                  <div className="h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  <motion.div
                    className="absolute top-0 left-0 h-0.5 bg-primary"
                    initial={{ width: "0%" }}
                    animate={{
                      width: isCompleted ? "100%" : isCurrent ? `${completion}%` : "0%",
                    }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
