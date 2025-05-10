"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Edit, Save, X, Plus } from "lucide-react"

type MLMSetting = {
  level: number
  commission_percentage: number
  description: string
}

type AffiliateTier = {
  name: string
  description: string
  min_referrals: number
  min_approved_applications: number
  min_revenue: number
  commission_rate: number
}

interface MLMSettingsProps {
  mlmSettings: MLMSetting[]
  tiers: AffiliateTier[]
}

export function MLMSettings({ mlmSettings, tiers }: MLMSettingsProps) {
  const { toast } = useToast()
  const [editingMLM, setEditingMLM] = useState<number | null>(null)
  const [editingTier, setEditingTier] = useState<string | null>(null)
  const [mlmData, setMlmData] = useState(mlmSettings)
  const [tierData, setTierData] = useState(tiers)

  const handleMLMEdit = (level: number) => {
    setEditingMLM(level)
  }

  const handleTierEdit = (name: string) => {
    setEditingTier(name)
  }

  const handleMLMChange = (level: number, field: keyof MLMSetting, value: string | number) => {
    setMlmData((prev) =>
      prev.map((item) =>
        item.level === level
          ? { ...item, [field]: typeof value === "string" ? Number.parseFloat(value) || 0 : value }
          : item,
      ),
    )
  }

  const handleTierChange = (name: string, field: keyof AffiliateTier, value: string | number) => {
    setTierData((prev) =>
      prev.map((item) =>
        item.name === name
          ? { ...item, [field]: typeof value === "string" ? Number.parseFloat(value) || 0 : value }
          : item,
      ),
    )
  }

  const saveMLMChanges = async (level: number) => {
    try {
      // In a real implementation, this would call a server action to update the database
      // For now, we'll just show a success toast
      toast({
        title: "Success",
        description: `MLM level ${level} settings updated`,
      })
      setEditingMLM(null)
    } catch (error) {
      console.error("Error saving MLM settings:", error)
      toast({
        title: "Error",
        description: "Failed to update MLM settings",
        variant: "destructive",
      })
    }
  }

  const saveTierChanges = async (name: string) => {
    try {
      // In a real implementation, this would call a server action to update the database
      // For now, we'll just show a success toast
      toast({
        title: "Success",
        description: `Tier ${name} settings updated`,
      })
      setEditingTier(null)
    } catch (error) {
      console.error("Error saving tier settings:", error)
      toast({
        title: "Error",
        description: "Failed to update tier settings",
        variant: "destructive",
      })
    }
  }

  const cancelMLMEdit = () => {
    setMlmData(mlmSettings)
    setEditingMLM(null)
  }

  const cancelTierEdit = () => {
    setTierData(tiers)
    setEditingTier(null)
  }

  return (
    <div className="space-y-6">
      {/* MLM Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Level Marketing Settings</CardTitle>
          <CardDescription>
            Configure commission percentages for different levels in your MLM structure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Commission Percentage</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mlmData.map((setting) => (
                <TableRow key={setting.level}>
                  <TableCell>{setting.level}</TableCell>
                  <TableCell>
                    {editingMLM === setting.level ? (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={setting.commission_percentage}
                        onChange={(e) => handleMLMChange(setting.level, "commission_percentage", e.target.value)}
                        className="w-20 h-8"
                      />
                    ) : (
                      `${setting.commission_percentage}%`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingMLM === setting.level ? (
                      <Input
                        value={setting.description}
                        onChange={(e) => handleMLMChange(setting.level, "description", e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      setting.description
                    )}
                  </TableCell>
                  <TableCell>
                    {editingMLM === setting.level ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => saveMLMChanges(setting.level)}
                        >
                          <Save className="h-3.5 w-3.5 text-green-500" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={cancelMLMEdit}>
                          <X className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleMLMEdit(setting.level)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tier Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Affiliate Tier Settings</CardTitle>
          <CardDescription>Configure commission rates and requirements for different affiliate tiers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Commission Rates</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Tier
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier Name</TableHead>
                  <TableHead>Commission Rate</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.map((tier) => (
                  <TableRow key={tier.name}>
                    <TableCell className="font-medium capitalize">{tier.name}</TableCell>
                    <TableCell>{tier.commission_rate}%</TableCell>
                    <TableCell>{tier.description}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
