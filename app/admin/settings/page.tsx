"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Mock settings
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      newApplications: true,
      statusChanges: true,
    },
    display: {
      darkMode: false,
      compactView: false,
    },
  })

  const handleSaveSettings = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">Settings</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your admin dashboard preferences and notifications.</p>
        </div>

        <div className="p-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-slate-900 mb-2">Admin Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-name">Admin Name</Label>
                      <Input id="admin-name" defaultValue="Admin User" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input id="admin-email" defaultValue="admin@diamondtier.solutions" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-slate-900 mb-2">Security</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium text-slate-900">Email Notifications</h3>
                    <p className="text-sm text-slate-500">Receive email notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium text-slate-900">New Applications</h3>
                    <p className="text-sm text-slate-500">Get notified when a new application is submitted</p>
                  </div>
                  <Switch
                    checked={settings.notifications.newApplications}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          newApplications: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium text-slate-900">Status Changes</h3>
                    <p className="text-sm text-slate-500">Get notified when an application status changes</p>
                  </div>
                  <Switch
                    checked={settings.notifications.statusChanges}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          statusChanges: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium text-slate-900">Dark Mode</h3>
                    <p className="text-sm text-slate-500">Use dark theme for the admin dashboard</p>
                  </div>
                  <Switch
                    checked={settings.display.darkMode}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        display: {
                          ...settings.display,
                          darkMode: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium text-slate-900">Compact View</h3>
                    <p className="text-sm text-slate-500">Use compact layout for tables and lists</p>
                  </div>
                  <Switch
                    checked={settings.display.compactView}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        display: {
                          ...settings.display,
                          compactView: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  )
}
