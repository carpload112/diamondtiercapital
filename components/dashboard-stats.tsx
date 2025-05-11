import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  isLoading?: boolean
  className?: string
}

/**
 * Reusable stat card component for dashboards
 */
export function StatCard({ title, value, icon, description, trend, isLoading = false, className = "" }: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-7 w-1/2 mb-1" />
            {description && <Skeleton className="h-4 w-full" />}
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {value}
              {trend && (
                <span className={`ml-2 text-sm font-normal ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                  {trend.isPositive ? "+" : "-"}
                  {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </>
        )}
      </CardContent>
    </Card>
  )
}

interface DashboardStatsProps {
  stats: StatCardProps[]
  columns?: 1 | 2 | 3 | 4
  className?: string
}

/**
 * Grid of stat cards for dashboards
 */
export function DashboardStats({ stats, columns = 4, className = "" }: DashboardStatsProps) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns]

  return (
    <div className={`grid ${gridClass} gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
