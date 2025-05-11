import { Skeleton } from "@/components/ui/skeleton"

interface FormSkeletonProps {
  fields: number
  className?: string
}

/**
 * Skeleton loader for form components
 */
export function FormSkeleton({ fields = 4, className = "" }: FormSkeletonProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}

      <div className="flex justify-end">
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}
