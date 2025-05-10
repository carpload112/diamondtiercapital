import { Suspense } from "react"
import ApplicationKanbanClient from "@/components/admin/ApplicationKanbanClient"

export default function ApplicationKanbanPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold mb-1">Client Applications</h1>
        <p className="text-xs text-gray-500">Kanban board for managing application status</p>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }
      >
        <ApplicationKanbanClient />
      </Suspense>
    </div>
  )
}
