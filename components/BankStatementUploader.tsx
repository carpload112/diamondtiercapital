"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { UploadIcon as FileUploadIcon, Upload, X, FileCheck, Info, AlertTriangle } from "lucide-react"
import { uploadBankStatement } from "@/lib/supabase/actions"
import { formatFileSize } from "@/lib/utils/format-utils"
import { FILE_SIZE_LIMITS } from "@/lib/constants"
import { getMonthOptions } from "@/lib/utils/date-utils"

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

  // Validate application ID on mount
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

  // Memoized file validation function
  const validateFile = useCallback(
    (file: File) => {
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
        return false
      }

      // Check file size
      if (file.size > FILE_SIZE_LIMITS.MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `Maximum file size is ${formatFileSize(FILE_SIZE_LIMITS.MAX_FILE_SIZE)}`,
          variant: "destructive",
        })
        return false
      }

      // Show appropriate warnings based on file size
      if (file.size > FILE_SIZE_LIMITS.VERY_LARGE_FILE_THRESHOLD) {
        toast({
          title: "Very large file detected",
          description: "Files over 50MB may take several minutes to upload and process. Please be patient.",
          variant: "warning",
          duration: 8000,
        })
      } else if (file.size > FILE_SIZE_LIMITS.LARGE_FILE_THRESHOLD) {
        toast({
          title: "Large file detected",
          description: "Files over 20MB may take longer to upload and process",
          variant: "warning",
          duration: 5000,
        })
      }

      return true
    },
    [toast],
  )

  // Optimized file change handler
  const handleFileChange = useCallback(
    (month: string, e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]

        if (validateFile(file)) {
          setFiles((prev) => ({ ...prev, [month]: file }))
        } else if (fileInputRefs[month as keyof typeof fileInputRefs]?.current) {
          fileInputRefs[month as keyof typeof fileInputRefs].current!.value = ""
        }
      }
    },
    [validateFile],
  )

  // Remove file handler
  const removeFile = useCallback((month: string) => {
    setFiles((prev) => ({ ...prev, [month]: null }))
    if (fileInputRefs[month as keyof typeof fileInputRefs]?.current) {
      fileInputRefs[month as keyof typeof fileInputRefs].current!.value = ""
    }
  }, [])

  // Month change handler
  const handleMonthChange = useCallback((month: string, value: string) => {
    setMonths((prev) => ({ ...prev, [month]: value }))
  }, [])

  // Upload handler with optimized progress tracking
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

    // Check for very large files and warn the user
    const totalSize = Object.values(files).reduce((sum, file) => sum + (file?.size || 0), 0)
    const hasVeryLargeFile = Object.values(files).some(
      (file) => file && file.size > FILE_SIZE_LIMITS.VERY_LARGE_FILE_THRESHOLD,
    )

    if (hasVeryLargeFile || totalSize > 100 * 1024 * 1024) {
      toast({
        title: "Very large upload",
        description: "You're uploading large files. This may take several minutes to complete. Please be patient.",
        duration: 8000,
      })
    }

    setUploading(true)
    setUploadStatus(null)

    try {
      // Upload each file
      let successCount = 0
      let errorCount = 0

      // Process files in sequence to avoid overwhelming the server
      for (const [month, file] of Object.entries(files)) {
        if (file) {
          try {
            // Reset progress for this file
            setUploadProgress((prev) => ({ ...prev, [month]: 1 }))

            // Start progress simulation based on file size
            const progressInterval = Math.max(100, Math.min(1000, Math.floor(file.size / 200000)))
            const interval = setInterval(() => {
              setUploadProgress((prev) => {
                const increment =
                  file.size > FILE_SIZE_LIMITS.VERY_LARGE_FILE_THRESHOLD
                    ? 1
                    : file.size > FILE_SIZE_LIMITS.LARGE_FILE_THRESHOLD
                      ? 2
                      : 5
                return {
                  ...prev,
                  [month]: Math.min((prev[month] || 0) + increment, 90),
                }
              })
            }, progressInterval)

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
              errorCount++
              throw new Error(result.error || "Upload failed")
            }
          } catch (error) {
            console.error(`Error uploading ${month} statement:`, error)
            toast({
              title: `Failed to upload ${month} statement`,
              description: error instanceof Error ? error.message : "An unknown error occurred",
              variant: "destructive",
            })
          }
        }
      }

      // Check if at least one file was uploaded successfully
      if (successCount > 0) {
        setUploadStatus({
          success: true,
          message: `Successfully uploaded ${successCount} bank statement(s)${
            errorCount > 0 ? `, ${errorCount} failed` : ""
          }`,
        })

        toast({
          title: "Upload successful",
          description: `Successfully uploaded ${successCount} bank statement(s)${
            errorCount > 0 ? `, ${errorCount} failed` : ""
          }`,
        })

        // Reset form for successful uploads
        const newFiles = { ...files }
        const newMonths = { ...months }
        const newProgress = { ...uploadProgress }

        Object.entries(files).forEach(([month, file]) => {
          if (file && uploadProgress[month] === 100) {
            newFiles[month] = null
            newMonths[month] = ""
            newProgress[month] = 0
            if (fileInputRefs[month as keyof typeof fileInputRefs]?.current) {
              fileInputRefs[month as keyof typeof fileInputRefs].current!.value = ""
            }
          }
        })

        setFiles(newFiles)
        setMonths(newMonths)
        setNotes("")
        setUploadProgress(newProgress)

        // Notify parent component
        if (onUploadComplete) {
          onUploadComplete()
        }
      } else if (errorCount > 0) {
        setUploadStatus({
          success: false,
          message: "No files were uploaded successfully. Please try again with smaller files.",
        })
      }
    } catch (error) {
      console.error("Error uploading bank statements:", error)
      toast({
        title: "Upload failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while uploading bank statements. Please try again with smaller files.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  // Generate month options (last 12 months)
  const monthOptions = useMemo(() => getMonthOptions(12), [])

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <FileUploadIcon className="h-5 w-5 mr-2 text-blue-500" />
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

        <div className="p-3 bg-blue-50 border border-blue-100 rounded-md mb-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-800">File Size Guidelines</p>
              <p className="text-xs text-blue-700 mt-1">
                • Files up to 20MB: Standard upload, recommended for most statements
                <br />• Files 20-50MB: Large files, may take longer to process
                <br />• Files 50-100MB: Very large files, may take several minutes to process
                <br />• Maximum file size: 100MB
              </p>
            </div>
          </div>
        </div>

        {/* Warning for very large files */}
        {Object.values(files).some((file) => file && file.size > FILE_SIZE_LIMITS.VERY_LARGE_FILE_THRESHOLD) && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              <div>
                <p className="text-sm font-medium text-amber-800">Very Large File Warning</p>
                <p className="text-xs text-amber-700 mt-1">
                  You've selected one or more very large files (over 50MB). These may take several minutes to upload and
                  process. If you encounter errors, please try splitting the file into smaller parts or using a
                  compressed format.
                </p>
              </div>
            </div>
          </div>
        )}

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
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm truncate">{files.month1.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(files.month1.size)}
                      {files.month1.size > FILE_SIZE_LIMITS.VERY_LARGE_FILE_THRESHOLD && (
                        <span className="text-amber-600 ml-1">(Very Large)</span>
                      )}
                      {files.month1.size > FILE_SIZE_LIMITS.LARGE_FILE_THRESHOLD &&
                        files.month1.size <= FILE_SIZE_LIMITS.VERY_LARGE_FILE_THRESHOLD && (
                          <span className="text-amber-500 ml-1">(Large)</span>
                        )}
                    </span>
                  </div>
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
                  {uploadProgress.month1 < 100 && uploadProgress.month1 > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadProgress.month1}% - {uploadProgress.month1 >= 90 ? "Processing..." : "Uploading..."}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Month 2 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="month2" className="text-sm font-medium">
              Second Most Recent Month
            </Label>
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
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm truncate">{files.month2.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(files.month2.size)}
                      {files.month2.size > FILE_SIZE_LIMITS.VERY_LARGE_FILE_THRESHOLD && (
                        <span className="text-amber-600 ml-1">(Very Large)</span>
                      )}
                      {files.month2.size > FILE_SIZE_LIMITS.LARGE_FILE_THRESHOLD &&
                        files.month2.size <= FILE_SIZE_LIMITS.VERY_LARGE_FILE_THRESHOLD && (
                          <span className="text-amber-500 ml-1">(Large)</span>
                        )}
                    </span>
                  </div>
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
                  {uploadProgress.month2 < 100 && uploadProgress.month2 > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadProgress.month2}% - {uploadProgress.month2 >= 90 ? "Processing..." : "Uploading..."}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Month 3 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="month3" className="text-sm font-medium">
              Third Most Recent Month
            </Label>
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
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm truncate">{files.month3.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(files.month3.size)}
                      {files.month3.size > FILE_SIZE_LIMITS.VERY_LARGE_FILE_THRESHOLD && (
                        <span className="text-amber-600 ml-1">(Very Large)</span>
                      )}
                      {files.month3.size > FILE_SIZE_LIMITS.LARGE_FILE_THRESHOLD &&
                        files.month3.size <= FILE_SIZE_LIMITS.VERY_LARGE_FILE_THRESHOLD && (
                          <span className="text-amber-500 ml-1">(Large)</span>
                        )}
                    </span>
                  </div>
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
                  {uploadProgress.month3 < 100 && uploadProgress.month3 > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadProgress.month3}% - {uploadProgress.month3 >= 90 ? "Processing..." : "Uploading..."}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Additional Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Any additional information you want to provide?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button onClick={handleUpload} disabled={uploading || !applicationId} className="w-full">
          {uploading ? "Uploading..." : "Upload Statements"}
        </Button>
      </CardContent>
    </Card>
  )
}
