"use client"

import { useState, useEffect } from "react"
import { Plus, X, FolderIcon, TagIcon, Edit, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Tag {
  id: string
  name: string
  color: string
}

interface AppFolder {
  id: string
  name: string
}

export default function TagsManager() {
  const [tags, setTags] = useState<Tag[]>([])
  const [folders, setFolders] = useState<AppFolder[]>([])
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#3b82f6")
  const [newFolderName, setNewFolderName] = useState("")
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [editingFolder, setEditingFolder] = useState<AppFolder | null>(null)
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()
  const { toast } = useToast()

  // Fetch tags and folders on component mount
  useEffect(() => {
    fetchTags()
    fetchFolders()
  }, [])

  const fetchTags = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("application_tags").select("*").order("name")

      if (error) throw error
      setTags(data || [])
    } catch (error) {
      console.error("Error fetching tags:", error)
      toast({
        title: "Error",
        description: "Failed to load tags",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFolders = async () => {
    try {
      setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast({
        title: "Error",
        description: "Tag name cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from("application_tags")
        .insert([{ name: newTagName.trim(), color: newTagColor }])
        .select()
        .single()

      if (error) throw error

      setTags([...tags, data])
      setNewTagName("")
      setNewTagColor("#3b82f6")
      setIsTagDialogOpen(false)

      toast({
        title: "Success",
        description: "Tag created successfully",
      })
    } catch (error) {
      console.error("Error creating tag:", error)
      toast({
        title: "Error",
        description: "Failed to create tag",
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
      setIsFolderDialogOpen(false)

      toast({
        title: "Success",
        description: "Folder created successfully",
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

  const handleUpdateTag = async () => {
    if (!editingTag) return

    try {
      const { error } = await supabase
        .from("application_tags")
        .update({ name: editingTag.name, color: editingTag.color })
        .eq("id", editingTag.id)

      if (error) throw error

      setTags(tags.map((tag) => (tag.id === editingTag.id ? editingTag : tag)))
      setEditingTag(null)

      toast({
        title: "Success",
        description: "Tag updated successfully",
      })
    } catch (error) {
      console.error("Error updating tag:", error)
      toast({
        title: "Error",
        description: "Failed to update tag",
        variant: "destructive",
      })
    }
  }

  const handleUpdateFolder = async () => {
    if (!editingFolder) return

    try {
      const { error } = await supabase
        .from("application_folders")
        .update({ name: editingFolder.name })
        .eq("id", editingFolder.id)

      if (error) throw error

      setFolders(folders.map((folder) => (folder.id === editingFolder.id ? editingFolder : folder)))
      setEditingFolder(null)

      toast({
        title: "Success",
        description: "Folder updated successfully",
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

  const handleDeleteTag = async (tagId: string) => {
    try {
      // First remove tag from all applications
      const { error: relationError } = await supabase.from("application_tag_relations").delete().eq("tag_id", tagId)

      if (relationError) throw relationError

      // Then delete the tag itself
      const { error } = await supabase.from("application_tags").delete().eq("id", tagId)

      if (error) throw error

      setTags(tags.filter((tag) => tag.id !== tagId))

      toast({
        title: "Success",
        description: "Tag deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting tag:", error)
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    try {
      // First remove folder from all applications
      const { error: appError } = await supabase
        .from("applications")
        .update({ folder_id: null })
        .eq("folder_id", folderId)

      if (appError) throw appError

      // Then delete the folder itself
      const { error } = await supabase.from("application_folders").delete().eq("id", folderId)

      if (error) throw error

      setFolders(folders.filter((folder) => folder.id !== folderId))

      toast({
        title: "Success",
        description: "Folder deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting folder:", error)
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <Tabs defaultValue="tags">
        <TabsList className="mb-4">
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <TagIcon className="h-4 w-4" />
            Tags
          </TabsTrigger>
          <TabsTrigger value="folders" className="flex items-center gap-2">
            <FolderIcon className="h-4 w-4" />
            Folders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tags" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TagIcon className="h-5 w-5" /> Tags Management
            </h3>
            <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Tag</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="tagName" className="text-sm font-medium">
                      Tag Name
                    </label>
                    <Input
                      id="tagName"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter tag name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tagColor" className="text-sm font-medium">
                      Tag Color
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="tagColor"
                        type="color"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <div className="w-10 h-10 rounded-full border" style={{ backgroundColor: newTagColor }} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTag}>Create Tag</Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Loading tags...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {tags.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No tags found. Create your first tag to get started.
                </div>
              ) : (
                tags.map((tag) => (
                  <div key={tag.id} className="flex items-center justify-between p-2 border rounded-md">
                    {editingTag?.id === tag.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editingTag.name}
                          onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                          className="h-8"
                        />
                        <Input
                          type="color"
                          value={editingTag.color}
                          onChange={(e) => setEditingTag({ ...editingTag, color: e.target.value })}
                          className="w-8 h-8 p-0"
                        />
                        <Button size="icon" variant="ghost" onClick={handleUpdateTag}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditingTag(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }} />
                          <Badge style={{ backgroundColor: tag.color }} className="text-white">
                            {tag.name}
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <Button size="icon" variant="ghost" onClick={() => setEditingTag(tag)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteTag(tag.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="folders" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FolderIcon className="h-5 w-5" /> Folders Management
            </h3>
            <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add Folder
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
                    <Button variant="outline" onClick={() => setIsFolderDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateFolder}>Create Folder</Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Loading folders...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {folders.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No folders found. Create your first folder to get started.
                </div>
              ) : (
                folders.map((folder) => (
                  <div key={folder.id} className="flex items-center justify-between p-2 border rounded-md">
                    {editingFolder?.id === folder.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editingFolder.name}
                          onChange={(e) => setEditingFolder({ ...editingFolder, name: e.target.value })}
                          className="h-8"
                        />
                        <Button size="icon" variant="ghost" onClick={handleUpdateFolder}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditingFolder(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <FolderIcon className="h-4 w-4" />
                          <span>{folder.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Button size="icon" variant="ghost" onClick={() => setEditingFolder(folder)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteFolder(folder.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
