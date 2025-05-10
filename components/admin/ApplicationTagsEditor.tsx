"use client"

import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

interface Tag {
  id: string
  name: string
  color: string
}

interface ApplicationTagsEditorProps {
  applicationId: string
  onTagsChange?: (tags: Tag[]) => void
  className?: string
  showLabel?: boolean
}

export default function ApplicationTagsEditor({
  applicationId,
  onTagsChange,
  className = "",
  showLabel = true,
}: ApplicationTagsEditorProps) {
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#3b82f6")
  const [isCreatingTag, setIsCreatingTag] = useState(false)

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    if (applicationId) {
      fetchApplicationTags()
    }
  }, [applicationId, allTags.length])

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase.from("application_tags").select("*").order("name")

      if (error) throw error
      setAllTags(data || [])
    } catch (error) {
      console.error("Error fetching tags:", error)
      toast({
        title: "Error",
        description: "Failed to load tags. Please refresh the page.",
        variant: "destructive",
      })
    }
  }

  const fetchApplicationTags = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("application_tag_relations")
        .select("tag_id")
        .eq("application_id", applicationId)

      if (error) throw error

      const tagIds = data.map((relation) => relation.tag_id)

      // Get tag details
      if (tagIds.length > 0) {
        const { data: tagData, error: tagError } = await supabase.from("application_tags").select("*").in("id", tagIds)

        if (tagError) throw tagError

        setSelectedTags(tagData || [])

        if (onTagsChange) {
          onTagsChange(tagData || [])
        }
      } else {
        setSelectedTags([])

        if (onTagsChange) {
          onTagsChange([])
        }
      }
    } catch (error) {
      console.error("Error fetching application tags:", error)
      toast({
        title: "Error",
        description: "Failed to load application tags",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTagToggle = async (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id)

    try {
      // Set loading state for better UX
      setIsLoading(true)

      if (isSelected) {
        // Remove tag
        const { error } = await supabase
          .from("application_tag_relations")
          .delete()
          .eq("application_id", applicationId)
          .eq("tag_id", tag.id)

        if (error) throw error

        const updatedTags = selectedTags.filter((t) => t.id !== tag.id)
        setSelectedTags(updatedTags)

        if (onTagsChange) {
          onTagsChange(updatedTags)
        }

        toast({
          title: "Tag removed",
          description: `"${tag.name}" tag has been removed`,
        })
      } else {
        // Add tag
        const { error } = await supabase
          .from("application_tag_relations")
          .insert([{ application_id: applicationId, tag_id: tag.id }])

        if (error) {
          // Check for duplicate key violation
          if (error.code === "23505") {
            // Tag already exists, just update the UI
            const updatedTags = [...selectedTags, tag]
            setSelectedTags(updatedTags)

            if (onTagsChange) {
              onTagsChange(updatedTags)
            }
            return
          }
          throw error
        }

        const updatedTags = [...selectedTags, tag]
        setSelectedTags(updatedTags)

        if (onTagsChange) {
          onTagsChange(updatedTags)
        }

        toast({
          title: "Tag added",
          description: `"${tag.name}" tag has been added`,
        })
      }
    } catch (error) {
      console.error("Error updating tags:", error)
      toast({
        title: "Error",
        description: "Failed to update tags",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from("application_tag_relations")
        .delete()
        .eq("application_id", applicationId)
        .eq("tag_id", tagId)

      if (error) throw error

      const tagToRemove = selectedTags.find((tag) => tag.id === tagId)
      const updatedTags = selectedTags.filter((tag) => tag.id !== tagId)
      setSelectedTags(updatedTags)

      if (onTagsChange) {
        onTagsChange(updatedTags)
      }

      if (tagToRemove) {
        toast({
          title: "Tag removed",
          description: `"${tagToRemove.name}" tag has been removed from this application`,
        })
      }
    } catch (error) {
      console.error("Error removing tag:", error)
      toast({
        title: "Error",
        description: "Failed to remove tag",
        variant: "destructive",
      })
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
      setIsCreatingTag(true)

      const { data, error } = await supabase
        .from("application_tags")
        .insert([{ name: newTagName.trim(), color: newTagColor }])
        .select()
        .single()

      if (error) throw error

      // Add the new tag to allTags
      setAllTags([...allTags, data])

      // Also add it to selectedTags and create the relation
      await supabase.from("application_tag_relations").insert([{ application_id: applicationId, tag_id: data.id }])

      setSelectedTags([...selectedTags, data])

      if (onTagsChange) {
        onTagsChange([...selectedTags, data])
      }

      // Reset form
      setNewTagName("")
      setNewTagColor("#3b82f6")
      setIsCreatingTag(false)

      toast({
        title: "Success",
        description: `Tag "${data.name}" created and added to application`,
      })
    } catch (error) {
      console.error("Error creating tag:", error)
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      })
      setIsCreatingTag(false)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && <label className="text-sm font-medium">Tags</label>}

      <div className="flex flex-wrap gap-2 items-center min-h-[36px]">
        {isLoading ? (
          <div className="flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            Loading tags...
          </div>
        ) : (
          <>
            {selectedTags.length === 0 && <span className="text-sm text-gray-500">No tags assigned</span>}

            {selectedTags.map((tag) => (
              <Badge
                key={tag.id}
                style={{ backgroundColor: tag.color }}
                className="text-white flex items-center gap-1 px-2 py-1"
              >
                {tag.name}
                <button
                  onClick={() => removeTag(tag.id)}
                  className="ml-1 hover:bg-black/20 rounded-full p-0.5"
                  aria-label={`Remove ${tag.name} tag`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 rounded-full hover:bg-gray-100"
                  aria-label="Add tag"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Add Tag</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="start">
                <div className="p-2 border-b">
                  <h3 className="font-medium">Select Tags</h3>
                </div>
                <div className="p-2 max-h-60 overflow-y-auto">
                  {allTags.length === 0 ? (
                    <p className="text-sm text-gray-500 p-2">No tags available</p>
                  ) : (
                    <div className="space-y-2">
                      {allTags.map((tag) => (
                        <div key={tag.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${applicationId}-${tag.id}`}
                            checked={selectedTags.some((t) => t.id === tag.id)}
                            onCheckedChange={() => handleTagToggle(tag)}
                          />
                          <label
                            htmlFor={`tag-${applicationId}-${tag.id}`}
                            className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                            {tag.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  <Separator className="my-2" />

                  <div className="space-y-2 pt-2">
                    <h4 className="text-sm font-medium">Create New Tag</h4>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Tag name"
                        className="w-full px-3 py-1 text-sm border rounded-md"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newTagColor}
                          onChange={(e) => setNewTagColor(e.target.value)}
                          className="w-8 h-8 p-0 border rounded"
                        />
                        <div className="flex-1">
                          <Button
                            size="sm"
                            className="w-full text-xs"
                            onClick={handleCreateTag}
                            disabled={isCreatingTag || !newTagName.trim()}
                          >
                            {isCreatingTag ? (
                              <>
                                <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                Creating...
                              </>
                            ) : (
                              <>
                                <Plus className="h-3 w-3 mr-1" />
                                Create Tag
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t flex justify-end">
                  <Button size="sm" onClick={() => setIsOpen(false)} className="text-xs">
                    Done
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>
    </div>
  )
}
