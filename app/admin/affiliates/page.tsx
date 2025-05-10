"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AffiliateManagement } from "@/components/admin/AffiliateManagement"
import { MLMSettings } from "@/components/admin/MLMSettings"
import { AffiliatePayouts } from "@/components/admin/AffiliatePayouts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AffiliatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold mb-1">Affiliate Program</h1>
        <p className="text-xs text-gray-500">Manage your affiliate program and commission structure</p>
      </div>

      <Tabs defaultValue="affiliates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="settings">Commission Settings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="affiliates">
          <AffiliateManagement />
        </TabsContent>

        <TabsContent value="payouts">
          <AffiliatePayouts />
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <MLMSettings />

            <Card>
              <CardHeader>
                <CardTitle>Tier Commission Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Bronze Tier</span>
                        <span className="text-sm">10%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div className="h-2 rounded-full bg-amber-500" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Silver Tier</span>
                        <span className="text-sm">15%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div className="h-2 rounded-full bg-gray-400" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Gold Tier</span>
                        <span className="text-sm">20%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: "20%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Platinum Tier</span>
                        <span className="text-sm">25%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div className="h-2 rounded-full bg-purple-500" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Performance Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p>Performance reports will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
