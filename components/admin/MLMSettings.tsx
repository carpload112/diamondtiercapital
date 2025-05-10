"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Edit, Save, X } from "lucide-react"

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Min. Referrals</TableHead>
                <TableHead>Min. Approved Apps</TableHead>
                <TableHead>Min. Revenue</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tierData.map((tier) => (
                <TableRow key={tier.name}>
                  <TableCell className="font-medium">
                    {tier.name.charAt(0).toUpperCase() + tier.name.slice(1)}
                  </TableCell>
                  <TableCell>
                    {editingTier === tier.name ? (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={tier.commission_rate}
                        onChange={(e) => handleTierChange(tier.name, "commission_rate", e.target.value)}
                        className="w-20 h-8"
                      />
                    ) : (
                      `${tier.commission_rate}%`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTier === tier.name ? (
                      <Input
                        type="number"
                        min="0"
                        value={tier.min_referrals}
                        onChange={(e) => handleTierChange(tier.name, "min_referrals", e.target.value)}
                        className="w-20 h-8"
                      />
                    ) : (
                      tier.min_referrals
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTier === tier.name ? (
                      <Input
                        type="number"
                        min="0"
                        value={tier.min_approved_applications}
                        onChange={(e) => handleTierChange(tier.name, "min_approved_applications", e.target.value)}
                        className="w-20 h-8"
                      />
                    ) : (
                      tier.min_approved_applications
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTier === tier.name ? (
                      <Input
                        type="number"
                        min="0"
                        value={tier.min_revenue}
                        onChange={(e) => handleTierChange(tier.name, "min_revenue", e.target.value)}
                        className="w-20 h-8"
                      />
                    ) : (
                      `$${tier.min_revenue.toLocaleString()}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTier === tier.name ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => saveTierChanges(tier.name)}
                        >
                          <Save className="h-3.5 w-3.5 text-green-500" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={cancelTierEdit}>
                          <X className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleTierEdit(tier.name)}
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
    </div>
  )
}
