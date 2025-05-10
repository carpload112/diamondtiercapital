"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getMLMSettings } from "@/lib/supabase/affiliate-actions"
import { createServerClient } from "@/lib/supabase/server"

export function MLMSettings() {
  const [settings, setSettings] = useState([
    { level: 1, commission_percentage: 60, description: "Direct referral" },
    { level: 2, commission_percentage: 20, description: "Second level" },
    { level: 3, commission_percentage: 10, description: "Third level" },
    { level: 4, commission_percentage: 5, description: "Fourth level" },
    { level: 5, commission_percentage: 5, description: "Fifth level" },
  ])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const { success, data, error } = await getMLMSettings()
      if (success && data.length > 0) {
        setSettings(data)
      } else if (error) {
        toast({
          title: "Error",
          description: error || "Failed to fetch MLM settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching MLM settings:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (index, value) => {
    const newSettings = [...settings]
    newSettings[index].commission_percentage = Number.parseFloat(value)
    setSettings(newSettings)
  }

  const handleDescriptionChange = (index, value) => {
    const newSettings = [...settings]
    newSettings[index].description = value
    setSettings(newSettings)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createServerClient()

      // First, delete all existing settings
      await supabase.from("affiliate_mlm_settings").delete().neq("id", "placeholder")

      // Then insert the new settings
      const { error } = await supabase.from("affiliate_mlm_settings").insert(
        settings.map((setting) => ({
          level: setting.level,
          commission_percentage: setting.commission_percentage,
          description: setting.description,
        })),
      )

      if (error) throw error

      toast({
        title: "Success",
        description: "MLM settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving MLM settings:", error)
      toast({
        title: "Error",
        description: "Failed to save MLM settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Level Commission Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {settings.map((setting, index) => (
            <div key={setting.level} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-2">
                <Label>Level {setting.level}</Label>
              </div>
              <div className="col-span-3">
                <div className="flex items-center">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={setting.commission_percentage}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="w-20"
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
              <div className="col-span-7">
                <Input
                  value={setting.description}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  placeholder="Description"
                />
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
