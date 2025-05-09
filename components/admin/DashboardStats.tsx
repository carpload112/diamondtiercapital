import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react"

type DashboardStatsProps = {
  totalApplications: number
  pendingApplications: number
  approvedApplications: number
  rejectedApplications: number
}

export function DashboardStats({
  totalApplications,
  pendingApplications,
  approvedApplications,
  rejectedApplications,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold">{totalApplications}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-amber-100 p-2 rounded-full mr-3">
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-xl font-bold">{pendingApplications}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Approved</p>
            <p className="text-xl font-bold">{approvedApplications}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="bg-red-100 p-2 rounded-full mr-3">
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Rejected</p>
            <p className="text-xl font-bold">{rejectedApplications}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
