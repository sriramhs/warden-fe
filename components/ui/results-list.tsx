"use client"

import { useState } from "react"
import { Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PropertyCard } from "./property-card"
import type { Property } from "@/lib/types"

interface ResultsListProps {
  properties: any
  isLoading: boolean
  error: Error | null
  total?: number
  onRetry: () => void
}

export function ResultsList({ properties, isLoading, error, total, onRetry }: ResultsListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("name")

  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.property.name.localeCompare(b.property.name)
      case "temperature":
        return (b.weather.temperature || 0) - (a.weather.temperature || 0)
      case "humidity":
        return (b.weather.humidity || 0) - (a.weather.humidity || 0)
      default:
        return 0
    }
  })

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>Failed to load properties. Please check your connection and try again.</AlertDescription>
        </Alert>
        <Button onClick={onRetry} variant="outline" className="w-full bg-transparent">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {isLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            `${properties.length} properties${total ? ` of ${total}` : ""}`
          )}
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="temperature">Temperature</SelectItem>
              <SelectItem value="humidity">Humidity</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div
          className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && properties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Grid className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No properties found</h3>
            <p className="text-sm">Try adjusting your search criteria or filters</p>
          </div>
        </div>
      )}

      {/* Results grid */}
      {!isLoading && properties.length > 0 && (
        <div
          className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {sortedProperties.map((property) => (
            <PropertyCard key={property.property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
