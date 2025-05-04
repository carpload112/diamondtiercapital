"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, ExternalLink, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ApplicationsPage() {
  const [creditPullConsent, setCreditPullConsent] = useState<string | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    annualRevenue: "",
    fundingNeeded: "",
    fundingPurpose: "",
    creditScore: "",
    creditPullConsent: "",
    termsAccepted: false,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (field === "creditPullConsent") {
      setCreditPullConsent(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    // In a real application, you would send this data to your backend
    console.log("Form submitted", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Logo only */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <Link href="/" className="inline-block">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cropped-Diamond-Tier-Main-Logo-2400x1800-1-1-OtGxrajBZ6tB8DXOUuNBKwF5Ag3vaG.png"
              alt="Diamond Tier Capital"
              width={160}
              height={44}
              className="h-10 w-auto"
              priority
            />
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-none shadow-lg overflow-hidden rounded-xl">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-6 px-6 text-white text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4"
                  >
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold">Application Received</h2>
                </div>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600 mb-6">
                    Thank you for submitting your application. Our team will review your information and contact you
                    shortly to discuss the next steps.
                  </p>
                  <Button asChild>
                    <Link href="/">Return to Homepage</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card className="border-none shadow-lg overflow-hidden rounded-xl">
                <div className="bg-gradient-to-r from-primary to-blue-600 py-6 px-6 text-white text-center">
                  <h1 className="text-2xl font-bold">Business Funding Application</h1>
                  <p className="text-blue-100 text-sm mt-1">
                    Complete this secure form to begin your funding consultation
                  </p>
                </div>

                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <div className="flex items-center border-b border-gray-200 pb-2 mb-3">
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Personal Information
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="firstName" className="text-xs font-medium text-gray-700">
                            First Name*
                          </Label>
                          <Input
                            id="firstName"
                            placeholder="Enter first name"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            required
                            className="h-9 text-sm rounded-md"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="lastName" className="text-xs font-medium text-gray-700">
                            Last Name*
                          </Label>
                          <Input
                            id="lastName"
                            placeholder="Enter last name"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            required
                            className="h-9 text-sm rounded-md"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-xs font-medium text-gray-700">
                            Email Address*
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                            className="h-9 text-sm rounded-md"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-xs font-medium text-gray-700">
                            Phone Number*
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(123) 456-7890"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            required
                            className="h-9 text-sm rounded-md"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    <div className="space-y-4">
                      <div className="flex items-center border-b border-gray-200 pb-2 mb-3">
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Business Information
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="businessName" className="text-xs font-medium text-gray-700">
                            Business Name*
                          </Label>
                          <Input
                            id="businessName"
                            placeholder="Enter business name"
                            value={formData.businessName}
                            onChange={(e) => handleInputChange("businessName", e.target.value)}
                            required
                            className="h-9 text-sm rounded-md"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="businessType" className="text-xs font-medium text-gray-700">
                            Business Type*
                          </Label>
                          <Select
                            value={formData.businessType}
                            onValueChange={(value) => handleInputChange("businessType", value)}
                          >
                            <SelectTrigger id="businessType" className="h-9 text-sm rounded-md">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="soleProprietorship">Sole Proprietorship</SelectItem>
                              <SelectItem value="llc">LLC</SelectItem>
                              <SelectItem value="corporation">Corporation</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="annualRevenue" className="text-xs font-medium text-gray-700">
                            Annual Revenue*
                          </Label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                            <Input
                              id="annualRevenue"
                              type="number"
                              min="0"
                              placeholder="Enter amount"
                              value={formData.annualRevenue}
                              onChange={(e) => handleInputChange("annualRevenue", e.target.value)}
                              required
                              className="h-9 text-sm rounded-md pl-8"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="fundingNeeded" className="text-xs font-medium text-gray-700">
                            Funding Amount Needed*
                          </Label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                            <Input
                              id="fundingNeeded"
                              type="number"
                              min="0"
                              placeholder="Enter amount"
                              value={formData.fundingNeeded}
                              onChange={(e) => handleInputChange("fundingNeeded", e.target.value)}
                              required
                              className="h-9 text-sm rounded-md pl-8"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="fundingPurpose" className="text-xs font-medium text-gray-700">
                          Purpose of Funding*
                        </Label>
                        <Textarea
                          id="fundingPurpose"
                          placeholder="Briefly describe how you plan to use the funds"
                          value={formData.fundingPurpose}
                          onChange={(e) => handleInputChange("fundingPurpose", e.target.value)}
                          required
                          className="text-sm rounded-md h-20 resize-none"
                        />
                      </div>
                    </div>

                    {/* Credit Information */}
                    <div className="space-y-4">
                      <div className="flex items-center border-b border-gray-200 pb-2 mb-3">
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Credit Information
                        </h2>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="creditScore" className="text-xs font-medium text-gray-700">
                          Estimated Credit Score*
                        </Label>
                        <Select
                          value={formData.creditScore}
                          onValueChange={(value) => handleInputChange("creditScore", value)}
                        >
                          <SelectTrigger id="creditScore" className="h-9 text-sm rounded-md">
                            <SelectValue placeholder="Select credit score range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent (750+)</SelectItem>
                            <SelectItem value="good">Good (700-749)</SelectItem>
                            <SelectItem value="fair">Fair (650-699)</SelectItem>
                            <SelectItem value="poor">Poor (600-649)</SelectItem>
                            <SelectItem value="veryPoor">Very Poor (Below 600)</SelectItem>
                            <SelectItem value="unknown">I don't know</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-700">
                          Do you consent to Diamond Tier Capital pulling your credit report?*
                        </Label>
                        <RadioGroup
                          value={formData.creditPullConsent}
                          onValueChange={(value) => {
                            handleInputChange("creditPullConsent", value)
                            setCreditPullConsent(value)
                          }}
                          className="flex flex-col space-y-1.5"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="credit-yes" className="text-primary" />
                            <Label htmlFor="credit-yes" className="text-sm cursor-pointer">
                              Yes, I consent to a credit pull
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="credit-no" className="text-primary" />
                            <Label htmlFor="credit-no" className="text-sm cursor-pointer">
                              No, I prefer to provide my own credit report
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <AnimatePresence>
                        {creditPullConsent === "no" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
                              <div className="flex items-center mb-2">
                                <Info className="h-4 w-4 text-primary mr-2" />
                                <h4 className="text-sm font-medium text-blue-800">
                                  How to Provide Your Own Credit Report
                                </h4>
                              </div>

                              <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center">
                                  <Image
                                    src="https://member.identityiq.com/content/images/logo.png"
                                    alt="IdentityIQ Logo"
                                    width={100}
                                    height={25}
                                    className="mr-2"
                                  />
                                </div>
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                                  $1 for 7-day trial
                                </span>
                              </div>

                              <ol className="text-xs text-blue-800 space-y-1.5 mb-3 pl-5 list-decimal">
                                <li>Sign up for IdentityIQ's 7-day trial for just $1</li>
                                <li>Download your credit reports from all three bureaus</li>
                                <li>Email reports to info@diamondtier.solutions</li>
                                <li>You can cancel your subscription anytime after downloading</li>
                              </ol>

                              <Button
                                asChild
                                size="sm"
                                variant="secondary"
                                className="w-full text-xs py-1.5 bg-white text-primary hover:bg-gray-100"
                              >
                                <Link
                                  href="https://member.identityiq.com/sc-securemax.aspx?offercode=431279M1"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center"
                                >
                                  Get Your Credit Reports
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Terms and Submit */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => handleInputChange("termsAccepted", checked)}
                          required
                          className="mt-1 text-primary rounded"
                        />
                        <Label htmlFor="terms" className="text-xs text-gray-600">
                          I understand that the information provided will be used to determine potential funding
                          options. Diamond Tier Capital provides consultation services only and does not guarantee
                          approval for any financial product.*
                        </Label>
                      </div>

                      <div className="pt-2">
                        <Button
                          type="submit"
                          disabled={!formData.termsAccepted}
                          className="w-full py-2.5 transition-colors bg-primary text-white hover:bg-primary/90"
                        >
                          Submit Application
                        </Button>
                      </div>

                      <p className="text-center text-xs text-gray-500 mt-4">
                        Your information is secure and will only be used for consultation purposes.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
