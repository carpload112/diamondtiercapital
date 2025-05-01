"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, XAxis, YAxis } from "recharts"

const scoreHistory = [
  { month: "Jan", score: 665 },
  { month: "Feb", score: 680 },
  { month: "Mar", score: 695 },
  { month: "Apr", score: 710 },
  { month: "May", score: 725 },
  { month: "Jun", score: 745 },
]

const creditFactors = [
  { name: "Payment History", value: 35, color: "#1E3A8A" },
  { name: "Outstanding Debt", value: 30, color: "#2563EB" },
  { name: "Credit Length", value: 15, color: "#3B82F6" },
  { name: "Credit Mix", value: 10, color: "#60A5FA" },
  { name: "New Credit", value: 10, color: "#93C5FD" },
]

const creditScores = [
  { bureau: "Equifax", score: 788, label: "EXCELLENT" },
  { bureau: "Experian", score: 780, label: "EXCELLENT" },
  { bureau: "TransUnion", score: 770, label: "GOOD" },
]

export default function CreditRepairDashboard() {
  if (!scoreHistory || !creditFactors || !creditScores) {
    return null
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Credit Education Dashboard</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Educational tools to help you understand credit factors and monitor your progress
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Sample Credit Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {creditScores.map((bureau) => (
                    <div key={bureau.bureau} className="text-center">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-24 h-24" viewBox="0 0 96 96">
                          <circle cx="48" cy="48" r="36" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                          <circle
                            cx="48"
                            cy="48"
                            r="36"
                            fill="none"
                            stroke="#2563EB"
                            strokeWidth="8"
                            strokeDasharray={`${(bureau.score / 850) * 226} 226`}
                            transform="rotate(-90 48 48)"
                          />
                        </svg>
                        <span className="absolute text-xl font-bold">{bureau.score}</span>
                      </div>
                      <p className="text-sm font-medium mt-2">{bureau.bureau}</p>
                      <p className="text-xs text-blue-600">{bureau.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  This is a sample visualization for educational purposes only.
                </p>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Sample Score History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scoreHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="month" />
                      <YAxis domain={[600, 850]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#2563EB"
                        strokeWidth={2}
                        dot={{ fill: "#2563EB", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  This chart shows a sample progression of credit scores over time.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Credit Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={creditFactors}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {creditFactors.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {creditFactors.map((factor, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: factor.color }} />
                      <div>
                        <p className="text-sm font-medium">{factor.name}</p>
                        <p className="text-sm text-gray-500">{factor.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  This chart shows the relative importance of different factors that may affect credit scores.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex gap-4"
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3735562c-laptop2_10fq08t000000000000028-copy-MEbNcQykitEFNUlvQov9UAnIZ0s9bA.png"
              alt="Credit Education Dashboard Preview - Desktop"
              className="w-1/2 rounded-lg shadow-xl hidden lg:block"
            />
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/627651ec-frame-289348_10e00cc000000000000028-copy-TAJwxnmrGpovFHLBWMpzF3ETZtHdMp.png"
              alt="Credit Education Dashboard Preview - Mobile"
              className="w-full lg:w-1/3 rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
