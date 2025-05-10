"use client"

import { useState, useEffect } from "react"
import { Folder, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface AppFolder {
  id: string
  name: string
}

interface ApplicationFolderSelectorProps {
  applicationId: string
  onFolderChange?: (folderId: string | null) => void
  className?: string
  showLabel?: boolean
}

export default function ApplicationFolderSelector({
  applicationId,
  onFolderChange,
  className = "",
  showLabel = true,
}: ApplicationFolderSelectorProps) {
  const [folders, setFolders] = useState<AppFolder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<AppFolder | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchFolders()
    fetchApplicationFolder()
  }, [applicationId])

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase.from("application_folders").select("*").order("name")

      if (error) throw error
      setFolders(data || [])
    } catch (error) {
      console.error("Error fetching folders:", error)
      toast({
        title: "Error",
        description: "Failed to load folders",
        variant: "destructive",
      })
    }
  }

  const fetchApplicationFolder = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("applications").select("folder_id").eq("id", applicationId).single()

      if (error && error.code !== "PGRST116") throw error

      if (data?.folder_id) {
        const { data: folderData, error: folderError } = await supabase
          .from("application_folders")
          .select("*")
          .eq("id", data.folder_id)
          .single()

        if (folderError) throw folderError

        setSelectedFolder(folderData)

        if (onFolderChange) {
          onFolderChange(data.folder_id)
        }
      } else {
        setSelectedFolder(null)

        if (onFolderChange) {
          onFolderChange(null)
        }
      }
    } catch (error) {
      console.error("Error fetching application folder:", error)
      toast({
        title: "Error",
        description: "Failed to load application folder",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFolderSelect = async (folder: AppFolder | null) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ folder_id: folder?.id || null })
        .eq("id", applicationId)

      if (error) throw error

      setSelectedFolder(folder)
      setIsOpen(false)

      if (onFolderChange) {
        onFolderChange(folder?.id || null)
      }

      toast({
        title: "Success",
        description: folder ? `Application moved to "${folder.name}" folder` : "Application removed from folder",
      })
    } catch (error) {
      console.error("Error updating folder:", error)
      toast({
        title: "Error",
        description: "Failed to update folder",
        variant: "destructive",
      })
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from("application_folders")
        .insert([{ name: newFolderName.trim() }])
        .select()
        .single()

      if (error) throw error

      setFolders([...folders, data])
      setNewFolderName("")
      setIsCreateDialogOpen(false)

      // Automatically select the newly created folder
      handleFolderSelect(data)

      toast({
        title: "Success",
        description: `Folder "${data.name}" created successfully`,
      })
    } catch (error) {
      console.error("Error creating folder:", error)
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && <label className="text-sm font-medium">Folder</label>}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                Loading...
              </div>
            ) : (
              <div className="flex items-center gap-2 truncate">
                <Folder className="h-4 w-4 shrink-0" />
                <span className="truncate">{selectedFolder ? selectedFolder.name : "No Folder"}</span>
              </div>
            )}
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-2 border-b">
            <h3 className="font-medium">Select Folder</h3>
          </div>
          <div className="p-2 max-h-60 overflow-y-auto">
            <div
              className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => handleFolderSelect(null)}
            >
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                <span>No Folder</span>
              </div>
            </div>

            {folders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => handleFolderSelect(folder)}
              >
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  <span>{folder.name}</span>
                </div>
              </div>
            ))}

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start mt-2 text-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="folderName" className="text-sm font-medium">
                      Folder Name
                    </label>
                    <Input
                      id="folderName"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Enter folder name"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateFolder}>Create Folder</Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
