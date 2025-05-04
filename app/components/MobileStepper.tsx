"use client"
import { motion } from "framer-motion"

interface MobileStepperProps {
  currentStep: number
  totalSteps: number
  completion: number
}

export default function MobileStepper({ currentStep, totalSteps, completion }: MobileStepperProps) {
  const overallProgress = Math.round(((currentStep + completion / 100) / totalSteps) * 100)

  return (
    <div className="md:hidden mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <motion.span
          className="text-sm font-medium text-primary"
          key={`${currentStep}-${completion}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {overallProgress}%
        </motion.span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="bg-primary h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${overallProgress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
