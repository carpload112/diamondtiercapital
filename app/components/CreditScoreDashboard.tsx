"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"

// Dynamically import recharts components with no SSR to avoid hydration issues
const LineChart = dynamic(() => import("recharts").then((mod) => mod.LineChart), { ssr: false })
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), { ssr: false })
const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false })
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false })
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false })

const creditFactors = [
  { name: "Payment History", value: 35, color: "#1E3A8A" },
  { name: "Outstanding Debt", value: 30, color: "#2563EB" },
  { name: "Credit History Length", value: 15, color: "#3B82F6" },
  { name: "Credit Mix", value: 10, color: "#60A5FA" },
  { name: "New Credit", value: 10, color: "#93C5FD" },
]

const scoreHistory = [
  { month: "Sep", score: 645 },
  { month: "Oct", score: 665 },
  { month: "Nov", score: 680 },
  { month: "Dec", score: 710 },
  { month: "Jan", score: 750 },
]

const creditScores = [
  { bureau: "Equifax", score: 788, label: "EXCELLENT", color: "#059669" },
  { bureau: "Experian", score: 780, label: "EXCELLENT", color: "#059669" },
  { bureau: "TransUnion", score: 770, label: "GOOD", color: "#0D9488" },
]

export default function CreditScoreDashboard() {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-2">
        <div className="flex items-center justify-center mb-3">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cropped-Diamond-Tier-Main-Logo-2400x1800-1-1-OtGxrajBZ6tB8DXOUuNBKwF5Ag3vaG.png"
            alt="Diamond Tier Logo"
            className="h-6"
          />
        </div>

        <h2 className="text-lg font-bold mb-3">Dashboard</h2>

        {/* Credit Scores Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Credit Scores</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="grid grid-cols-3 gap-2">
              {creditScores.map((score, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-16 h-16" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={score.color}
                        strokeWidth="10"
                        strokeDasharray={`${(score.score / 850) * 283} 283`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <span className="absolute text-sm font-bold">{score.score}</span>
                  </div>
                  <p className="text-xs font-medium mt-1">{score.bureau}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">{score.label}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Credit Factors Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Credit Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[150px]">
              {typeof window !== "undefined" && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={creditFactors}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {creditFactors.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 rounded-lg shadow border">
                              <p className="text-sm font-medium">{payload[0].name}</p>
                              <p className="text-sm text-gray-500">{`${payload[0].value}%`}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {creditFactors.map((factor, index) => (
                <div key={index} className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: factor.color }} />
                  <span className="text-gray-600">{factor.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Score History Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[150px]">
              {typeof window !== "undefined" && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreHistory}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[600, 850]} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 rounded-lg shadow border">
                              <p className="text-sm font-medium">{label}</p>
                              <p className="text-sm text-gray-500">Score: {payload[0].value}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#2563EB"
                      strokeWidth={2}
                      dot={{ fill: "#2563EB", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
