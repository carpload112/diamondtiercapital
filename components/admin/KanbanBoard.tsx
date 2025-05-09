"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, DollarSign, ArrowRight } from "lucide-react"
import Link from "next/link"

type Application = {
  id: string
  reference_id: string
  status: string
  created_at: string
  full_name: string
  email: string
  business_name: string
  amount_requested: string | number
}

type KanbanColumn = {
  id: string
  title: string
  applications: Application[]
}

type KanbanBoardProps = {
  applications: Application[]
  onStatusChange?: (id: string, newStatus: string) => Promise<void>
}

const initialColumns: KanbanColumn[] = [
  {
    id: "pending",
    title: "Pending",
    applications: [],
  },
  {
    id: "in_review",
    title: "In Review",
    applications: [],
  },
  {
    id: "approved",
    title: "Approved",
    applications: [],
  },
  {
    id: "rejected",
    title: "Rejected",
    applications: [],
  },
]

export function KanbanBoard({ applications, onStatusChange }: KanbanBoardProps) {
  // Add this after the KanbanBoard function declaration
  console.log("Applications received:", applications.length)
  console.log("Applications by status:", {
    pending: applications.filter((app) => app.status === "pending").length,
    in_review: applications.filter((app) => app.status === "in_review").length,
    approved: applications.filter((app) => app.status === "approved").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  })

  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns)

  // Update columns when applications prop changes
  useEffect(() => {
    setColumns([
      {
        id: "pending",
        title: "Pending",
        applications: applications.filter((app) => app.status === "pending"),
      },
      {
        id: "in_review",
        title: "In Review",
        applications: applications.filter((app) => app.status === "in_review"),
      },
      {
        id: "approved",
        title: "Approved",
        applications: applications.filter((app) => app.status === "approved"),
      },
      {
        id: "rejected",
        title: "Rejected",
        applications: applications.filter((app) => app.status === "rejected"),
      },
    ])
  }, [applications])

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item was dropped back in its original position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Find the application that was dragged
    const application = applications.find((app) => app.id === draggableId)
    if (!application) return

    // Create a new array of columns
    const newColumns = [...columns]

    // Remove from source column
    const sourceColumn = newColumns.find((col) => col.id === source.droppableId)
    if (!sourceColumn) return

    const newSourceApps = [...sourceColumn.applications]
    const [removed] = newSourceApps.splice(source.index, 1)
    sourceColumn.applications = newSourceApps

    // Add to destination column
    const destColumn = newColumns.find((col) => col.id === destination.droppableId)
    if (!destColumn) return

    const newDestApps = [...destColumn.applications]
    newDestApps.splice(destination.index, 0, removed)
    destColumn.applications = newDestApps

    // Update state
    setColumns(newColumns)

    // Call the onStatusChange callback if provided
    if (onStatusChange) {
      await onStatusChange(draggableId, destination.droppableId)
    }
  }

  const getInitials = (name: string) => {
    if (!name || name === "N/A") return "NA"
    try {
      return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    } catch (error) {
      return "NA"
    }
  }

  const formatCurrency = (amount: string | number | undefined) => {
    if (!amount || amount === "N/A") return "$0"
    try {
      // If it's already a formatted range like "$50,000 - $100,000", return as is
      if (typeof amount === "string" && amount.includes("-")) {
        return amount
      }

      const num = typeof amount === "string" ? Number.parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(num)
    } catch (error) {
      return "$0"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      return "N/A"
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">{column.title}</h3>
              <Badge variant="outline" className="text-xs">
                {column.applications.length}
              </Badge>
            </div>

            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 rounded-md p-2 flex-1 min-h-[300px] max-h-[calc(100vh-220px)] overflow-y-auto"
                >
                  {column.applications.length === 0 ? (
                    <div className="flex items-center justify-center h-20 text-sm text-gray-500">No applications</div>
                  ) : (
                    column.applications.map((app, index) => (
                      <Draggable key={app.id} draggableId={app.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                          >
                            <Card className="bg-white border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2">
                                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                        {getInitials(app.full_name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h4 className="text-sm font-medium line-clamp-1">{app.full_name || "N/A"}</h4>
                                      <p className="text-xs text-gray-500 line-clamp-1">{app.business_name || "N/A"}</p>
                                    </div>
                                  </div>
                                  <Link
                                    href={`/admin/applications/${app.id}`}
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    <ArrowRight className="h-4 w-4" />
                                  </Link>
                                </div>

                                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    <span>{formatCurrency(app.amount_requested)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{formatDate(app.created_at)}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
