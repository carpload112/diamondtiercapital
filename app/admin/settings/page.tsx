"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateAdminForm } from "@/components/admin/CreateAdminForm"
import { useAuth } from "@/lib/auth"

export default function SettingsPage() {
  const { user } = useAuth()

  // Only super_admin can see the admin users tab
  const isSuperAdmin = user?.role === "super_admin"

  return (
    <div className="space-y-4">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="general" className="flex-1">
            General
          </TabsTrigger>
          {isSuperAdmin && (
            <TabsTrigger value="admin-users" className="flex-1">
              Admin Users
            </TabsTrigger>
          )}
          <TabsTrigger value="notifications" className="flex-1">
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your general application settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">General settings will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        {isSuperAdmin && (
          <TabsContent value="admin-users" className="space-y-4 mt-4">
            <CreateAdminForm />
          </TabsContent>
        )}
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Notification settings will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
