"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Topbar } from "@/components/ui/topbar"
import { FiltersPanel } from "@/components/ui/filters-panel"
import { ResultsList } from "@/components/ui/results-list"
import { getProperties } from "@/lib/api"
import type { SearchFilters } from "@/lib/types"
import { useMobile } from "@/hooks/use-mobile"

export default function HomePage() {
  const isMobile = useMobile()
  const [searchText, setSearchText] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({
  })
  const [isFiltersOpen, setIsFiltersOpen] = useState(!isMobile)

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => getProperties(filters),
    enabled: false,
  })

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      searchText: searchText || undefined,
    }))
    refetch()
  }

  const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    refetch()
  }

  const handleApplyFilters = () => {
    setFilters((prev) => ({ ...prev,  }))
    refetch()
    if (isMobile) {
      setIsFiltersOpen(false)
    }
  }

  const handleResetFilters = () => {
    const resetFilters = {
      searchText: searchText || undefined,
    }
    setFilters(resetFilters)
  }

  return (
    <div className="min-h-screen bg-background">
      <Topbar searchText={searchText} onSearchChange={setSearchText} onSearch={handleSearch} />

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Mobile filters toggle */}
          {isMobile && (
            <div className="fixed bottom-4 right-4 z-50">
              <Button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="rounded-full h-12 w-12 shadow-lg">
                {isFiltersOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          )}

          {/* Filters Panel */}
          <div
            className={`
            ${isMobile ? "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" : "w-80 flex-shrink-0"}
            ${isMobile && !isFiltersOpen ? "hidden" : "block"}
          `}
          >
            <div
              className={`
              ${isMobile ? "absolute left-4 right-4 top-4 bottom-4 overflow-y-auto" : ""}
            `}
            >
              <FiltersPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                className={isMobile ? "h-full" : "sticky top-6"}
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <ResultsList
              properties={response|| []}
              isLoading={isLoading}
              error={error}
              total={response?.meta?.total}
              onRetry={refetch}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
