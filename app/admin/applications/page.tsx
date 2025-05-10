export default function ApplicationsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold mb-1">Client Applications</h1>
        <p className="text-xs text-gray-500">Manage and review all submitted applications</p>
      </div>

      <div className="p-8 text-center">
        <p>Please select a view to manage applications:</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="/admin/applications/list" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            List View
          </a>
          <a href="/admin/applications/kanban" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Kanban Board
          </a>
        </div>
      </div>
    </div>
  )
}
