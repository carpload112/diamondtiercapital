"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { UploadIcon as FileUpload, Upload, X, FileCheck, AlertCircle, Info } from "lucide-react"
import { uploadBankStatement } from "@/lib/supabase/actions"

interface BankStatementUploaderProps {
  applicationId: string
  onUploadComplete?: () => void
}

export function BankStatementUploader({ applicationId, onUploadComplete }: BankStatementUploaderProps) {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    month1: null,
    month2: null,
    month3: null,
  })
  const [months, setMonths] = useState<{ [key: string]: string }>({
    month1: "",
    month2: "",
    month3: "",
  })
  const [notes, setNotes] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({
    month1: 0,
    month2: 0,
    month3: 0,
  })
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string } | null>(null)
  const fileInputRefs = {
    month1: useRef<HTMLInputElement>(null),
    month2: useRef<HTMLInputElement>(null),
    month3: useRef<HTMLInputElement>(null),
  }
  const { toast } = useToast()

  // Validate application ID on component mount
  useEffect(() => {
    if (!applicationId) {
      setUploadStatus({
        success: false,
        message: "Missing application ID. Please complete the previous steps first.",
      })
    } else {
      setUploadStatus(null)
    }
  }, [applicationId])

  const handleFileChange = (month: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file type
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ]
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, image, or Excel file",
          variant: "destructive",
        })
        return
      }

      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive",
        })
        return
      }

      setFiles((prev) => ({ ...prev, [month]: file }))
    }
  }

  const removeFile = (month: string) => {
    setFiles((prev) => ({ ...prev, [month]: null }))
    if (fileInputRefs[month as keyof typeof fileInputRefs]?.current) {
      fileInputRefs[month as keyof typeof fileInputRefs].current!.value = ""
    }
  }

  const handleMonthChange = (month: string, value: string) => {
    setMonths((prev) => ({ ...prev, [month]: value }))
  }

  const handleUpload = async () => {
    // Validate that at least one file is selected
    const hasFiles = Object.values(files).some((file) => file !== null)
    if (!hasFiles) {
      toast({
        title: "No files selected",
        description: "Please select at least one bank statement to upload",
        variant: "destructive",
      })
      return
    }

    // Validate that each file has a month selected
    let isValid = true
    Object.entries(files).forEach(([month, file]) => {
      if (file && !months[month]) {
        isValid = false
        toast({
          title: "Missing month",
          description: `Please select a month for all uploaded statements`,
          variant: "destructive",
        })
      }
    })

    if (!isValid) return

    setUploading(true)
    setUploadStatus(null)

    try {
      // Upload each file
      let successCount = 0
      for (const [month, file] of Object.entries(files)) {
        if (file) {
          // Simulate progress
          const interval = setInterval(() => {
            setUploadProgress((prev) => {
              const newProgress = Math.min((prev[month] || 0) + 10, 90)
              return { ...prev, [month]: newProgress }
            })
          }, 200)

          try {
            // Upload the file
            const result = await uploadBankStatement({
              applicationId,
              file,
              monthYear: months[month],
              notes: notes,
            })

            clearInterval(interval)

            if (result.success) {
              setUploadProgress((prev) => ({ ...prev, [month]: 100 }))
              successCount++
            } else {
              setUploadProgress((prev) => ({ ...prev, [month]: 0 }))
              throw new Error(result.error || "Upload failed")
            }
          } catch (error) {
            clearInterval(interval)
            console.error(`Error uploading ${month} statement:`, error)
            toast({
              title: `Failed to upload ${month} statement`,
              description: error instanceof Error ? error.message : "An unknown error occurred",
              variant: "destructive",
            })
            // Continue with other uploads even if one fails
          }
        }
      }

      // Check if at least one file was uploaded successfully
      if (successCount > 0) {
        setUploadStatus({
          success: true,
          message: `Successfully uploaded ${successCount} bank statement(s)`,
        })

        toast({
          title: "Upload successful",
          description: `Successfully uploaded ${successCount} bank statement(s)`,
        })

        // Reset form
        setFiles({ month1: null, month2: null, month3: null })
        setMonths({ month1: "", month2: "", month3: "" })
        setNotes("")
        setUploadProgress({ month1: 0, month2: 0, month3: 0 })

        // Notify parent component
        if (onUploadComplete) {
          onUploadComplete()
        }
      } else {
        setUploadStatus({
          success: false,
          message: "No files were uploaded successfully. Please try again.",
        })
        throw new Error("No files were uploaded successfully")
      }
    } catch (error) {
      console.error("Error uploading bank statements:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred while uploading bank statements",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  // Generate month options (last 12 months)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return {
      value: `${date.getMonth() + 1}/${date.getFullYear()}`,
      label: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    }
  })

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <FileUpload className="h-5 w-5 mr-2 text-blue-500" />
          Bank Statement Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploadStatus && (
          <div
            className={`p-3 rounded-md ${
              uploadStatus.success ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {uploadStatus.success ? (
                  <FileCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <Info className="h-5 w-5 text-amber-500" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm ${uploadStatus.success ? "text-green-700" : "text-amber-700"}`}>
                  {uploadStatus.message}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 mb-4">
          Please upload your last 3 months of business bank statements. Accepted formats: PDF, JPG, PNG, Excel.
        </div>

        {/* Month 1 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="month1" className="text-sm font-medium">
              Most Recent Month
            </Label>
            <div className="text-xs text-gray-500">Required</div>
          </div>
          <div className="flex gap-3 items-start">
            <Select value={months.month1} onValueChange={(value) => handleMonthChange("month1", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1 relative">
              {!files.month1 ? (
                <>
                  <Input
                    id="month1"
                    type="file"
                    className="hidden"
                    ref={fileInputRefs.month1}
                    onChange={(e) => handleFileChange("month1", e)}
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-left justify-start"
                    onClick={() => fileInputRefs.month1.current?.click()}
                    disabled={!applicationId}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </>
              ) : (
                <div className="flex items-center p-2 border rounded-md bg-gray-50">
                  <FileCheck className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm truncate flex-1">{files.month1.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => removeFile("month1")}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              )}
              {uploadProgress.month1 > 0 && (
                <div className="mt-1">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${uploadProgress.month1}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Month 2 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="month2" className="text-sm font-medium">
              Previous Month
            </Label>
            <div className="text-xs text-gray-500">Required</div>
          </div>
          <div className="flex gap-3 items-start">
            <Select value={months.month2} onValueChange={(value) => handleMonthChange("month2", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1 relative">
              {!files.month2 ? (
                <>
                  <Input
                    id="month2"
                    type="file"
                    className="hidden"
                    ref={fileInputRefs.month2}
                    onChange={(e) => handleFileChange("month2", e)}
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-left justify-start"
                    onClick={() => fileInputRefs.month2.current?.click()}
                    disabled={!applicationId}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </>
              ) : (
                <div className="flex items-center p-2 border rounded-md bg-gray-50">
                  <FileCheck className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm truncate flex-1">{files.month2.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => removeFile("month2")}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              )}
              {uploadProgress.month2 > 0 && (
                <div className="mt-1">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${uploadProgress.month2}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Month 3 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="month3" className="text-sm font-medium">
              3 Months Ago
            </Label>
            <div className="text-xs text-gray-500">Required</div>
          </div>
          <div className="flex gap-3 items-start">
            <Select value={months.month3} onValueChange={(value) => handleMonthChange("month3", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1 relative">
              {!files.month3 ? (
                <>
                  <Input
                    id="month3"
                    type="file"
                    className="hidden"
                    ref={fileInputRefs.month3}
                    onChange={(e) => handleFileChange("month3", e)}
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-left justify-start"
                    onClick={() => fileInputRefs.month3.current?.click()}
                    disabled={!applicationId}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </>
              ) : (
                <div className="flex items-center p-2 border rounded-md bg-gray-50">
                  <FileCheck className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm truncate flex-1">{files.month3.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => removeFile("month3")}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              )}
              {uploadProgress.month3 > 0 && (
                <div className="mt-1">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${uploadProgress.month3}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Add any notes about these bank statements"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>

        <div className="flex items-center pt-2">
          <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
          <p className="text-xs text-gray-500">
            All information is securely stored and only accessible to authorized personnel.
          </p>
        </div>

        <Button
          type="button"
          className="w-full"
          onClick={handleUpload}
          disabled={uploading || !Object.values(files).some((file) => file !== null) || !applicationId}
        >
          {uploading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Uploading...
            </>
          ) : (
            <>
              <FileUpload className="h-4 w-4 mr-2" />
              Upload Bank Statements
            </>
          )}
        </Button>
        {process.env.NODE_ENV !== "production" && (
          <div className="mt-4 p-3 border border-dashed border-amber-300 bg-amber-50 rounded-md">
            <p className="text-xs font-medium text-amber-800 mb-1">Debug Information:</p>
            <p className="text-xs text-amber-700">Application ID: {applicationId || "Not set"}</p>
            <p className="text-xs text-amber-700">Files selected: {Object.values(files).filter(Boolean).length}</p>
            <p className="text-xs text-amber-700">Months selected: {Object.values(months).filter(Boolean).length}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
