"use client"

import type React from "react"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TopbarProps {
  searchText: string
  onSearchChange: (value: string) => void
  onSearch: () => void
}

export function Topbar({ searchText, onSearchChange, onSearch }: TopbarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Property Search</h1>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search properties by location..."
                value={searchText}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
          </div>
          <Button onClick={onSearch} className="bg-primary hover:bg-primary/90">
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
