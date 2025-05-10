"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"

// Dynamically import the client components with no SSR
const ApplicationListView = dynamic(() => import("./ApplicationListView"), { ssr: false })
const ApplicationKanbanView = dynamic(() => import("./ApplicationKanbanView"), { ssr: false })

export default function ClientTabsWrapper() {
  return (
    <Tabs defaultValue="list" className="space-y-4">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="list">List View</TabsTrigger>
        <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
      </TabsList>

      <TabsContent value="list">
        <ApplicationListView />
      </TabsContent>

      <TabsContent value="kanban">
        <ApplicationKanbanView />
      </TabsContent>
    </Tabs>
  )
}
