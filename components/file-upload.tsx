"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatFileSize } from "@/lib/utils/format-utils"
import { FILE_SIZE_LIMITS } from "@/lib/constants"
import { Upload, X, FileCheck, AlertTriangle } from "lucide-react"

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  accept?: string
  maxSize?: number
  className?: string
  buttonText?: string
  disabled?: boolean
}

/**
 * Reusable file upload component
 */
export function FileUpload({
  onUpload,
  accept = "*/*",
  maxSize = FILE_SIZE_LIMITS.MAX_FILE_SIZE,
  className = "",
  buttonText = "Upload File",
  disabled = false,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check file size
      if (selectedFile.size > maxSize) {
        setError(`File is too large. Maximum size is ${formatFileSize(maxSize)}.`)
        return
      }

      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setIsUploading(true)
      setProgress(0)

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 100)

      // Perform upload
      await onUpload(file)

      // Complete progress
      clearInterval(interval)
      setProgress(100)

      // Reset after 2 seconds
      setTimeout(() => {
        setFile(null)
        setProgress(0)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setProgress(0)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {!file ? (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
            disabled={disabled || isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="w-full text-left justify-start"
          >
            <Upload className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        </>
      ) : (
        <div className="border rounded-md p-3 bg-muted/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FileCheck className="h-4 w-4 text-green-500 mr-2" />
              <div className="text-sm font-medium truncate max-w-[200px]">{file.name}</div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              disabled={isUploading}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mb-2">{formatFileSize(file.size)}</div>

          {progress > 0 && <Progress value={progress} className="h-1 mb-2" />}

          <div className="flex justify-end">
            <Button type="button" size="sm" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  )
}
