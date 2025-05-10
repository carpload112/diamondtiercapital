"use client"

import { useState, useEffect } from "react"
import { Search, TagIcon, Folder, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"

interface Tag {
  id: string
  name: string
  color: string
}

interface AppFolder {
  id: string
  name: string
}

interface ApplicationFiltersProps {
  onSearchChange: (value: string) => void
  onTagsChange: (tagIds: string[]) => void
  onFolderChange: (folderId: string | null) => void
  searchValue: string
  selectedTags: string[]
  selectedFolder: string | null
}

export default function ApplicationFilters({
  onSearchChange,
  onTagsChange,
  onFolderChange,
  searchValue,
  selectedTags,
  selectedFolder,
}: ApplicationFiltersProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [folders, setFolders] = useState<AppFolder[]>([])
  const [isTagsOpen, setIsTagsOpen] = useState(false)
  const [isFoldersOpen, setIsFoldersOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

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
    } finally {
      setIsLoading(false)
    }
  }

  const handleTagToggle = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId]

    onTagsChange(newSelectedTags)
  }

  const handleFolderSelect = (folderId: string | null) => {
    onFolderChange(folderId)
    setIsFoldersOpen(false)
  }

  const clearAllFilters = () => {
    onSearchChange("")
    onTagsChange([])
    onFolderChange(null)
  }

  const getSelectedTagsNames = () => {
    return tags.filter((tag) => selectedTags.includes(tag.id)).map((tag) => tag.name)
  }

  const getSelectedFolderName = () => {
    if (!selectedFolder) return null
    const folder = folders.find((f) => f.id === selectedFolder)
    return folder ? folder.name : null
  }

  const hasActiveFilters = searchValue || selectedTags.length > 0 || selectedFolder

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search applications..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Popover open={isTagsOpen} onOpenChange={setIsTagsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`flex items-center gap-1 ${selectedTags.length > 0 ? "bg-blue-50 border-blue-200" : ""}`}
              >
                <TagIcon className="h-4 w-4" />
                <span>Tags</span>
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedTags.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="end">
              <div className="p-2 border-b">
                <h3 className="font-medium">Filter by Tags</h3>
              </div>
              <div className="p-2 max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-sm">Loading tags...</span>
                  </div>
                ) : tags.length === 0 ? (
                  <p className="text-sm text-gray-500 p-2">No tags available</p>
                ) : (
                  <div className="space-y-2">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={() => handleTagToggle(tag.id)}
                        />
                        <label
                          htmlFor={`tag-${tag.id}`}
                          className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                          {tag.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-2 border-t flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => onTagsChange([])} disabled={selectedTags.length === 0}>
                  Clear
                </Button>
                <Button size="sm" onClick={() => setIsTagsOpen(false)}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={isFoldersOpen} onOpenChange={setIsFoldersOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`flex items-center gap-1 ${selectedFolder ? "bg-blue-50 border-blue-200" : ""}`}
              >
                <Folder className="h-4 w-4" />
                <span>Folders</span>
                {selectedFolder && (
                  <Badge variant="secondary" className="ml-1">
                    1
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="end">
              <div className="p-2 border-b">
                <h3 className="font-medium">Filter by Folder</h3>
              </div>
              <div className="p-2 max-h-60 overflow-y-auto">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="folder-none"
                      checked={selectedFolder === null}
                      onCheckedChange={() => handleFolderSelect(null)}
                    />
                    <label
                      htmlFor="folder-none"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      All Folders
                    </label>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-sm">Loading folders...</span>
                    </div>
                  ) : folders.length === 0 ? (
                    <p className="text-sm text-gray-500 p-2">No folders available</p>
                  ) : (
                    <div className="space-y-2 mt-2">
                      {folders.map((folder) => (
                        <div key={folder.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`folder-${folder.id}`}
                            checked={selectedFolder === folder.id}
                            onCheckedChange={() => handleFolderSelect(folder.id)}
                          />
                          <label
                            htmlFor={`folder-${folder.id}`}
                            className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            <Folder className="h-3 w-3 mr-2" />
                            {folder.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-2 border-t flex justify-end">
                <Button size="sm" onClick={() => setIsFoldersOpen(false)}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={clearAllFilters} title="Clear all filters">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-gray-500">Active filters:</span>

          {searchValue && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Search: {searchValue}</span>
              <button onClick={() => onSearchChange("")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {getSelectedTagsNames().map((tagName) => (
            <Badge key={tagName} variant="outline" className="flex items-center gap-1">
              <TagIcon className="h-3 w-3" />
              <span>{tagName}</span>
            </Badge>
          ))}

          {getSelectedFolderName() && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Folder className="h-3 w-3" />
              <span>{getSelectedFolderName()}</span>
              <button onClick={() => onFolderChange(null)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
