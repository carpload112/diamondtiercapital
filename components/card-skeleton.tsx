import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface CardSkeletonProps {
  hasHeader?: boolean
  headerHeight?: number
  contentCount?: number
  contentHeight?: number
  hasFooter?: boolean
  footerHeight?: number
  className?: string
}

/**
 * Skeleton loader for card components
 */
export function CardSkeleton({
  hasHeader = true,
  headerHeight = 20,
  contentCount = 3,
  contentHeight = 20,
  hasFooter = false,
  footerHeight = 40,
  className = "",
}: CardSkeletonProps) {
  return (
    <Card className={className}>
      {hasHeader && (
        <CardHeader>
          <Skeleton className={`w-1/3 h-${headerHeight}px`} />
        </CardHeader>
      )}

      <CardContent className="space-y-4">
        {Array.from({ length: contentCount }).map((_, i) => (
          <Skeleton key={i} className={`w-full h-${contentHeight}px`} />
        ))}
      </CardContent>

      {hasFooter && (
        <CardFooter>
          <Skeleton className={`w-1/4 h-${footerHeight}px`} />
        </CardFooter>
      )}
    </Card>
  )
}
