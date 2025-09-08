"use client"

import { MapPin, Thermometer, Droplets, Cloud, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/lib/types"

interface PropertyCardProps {
  property: any
}

const getWeatherDescription = (code?: number): string => {
  const weatherMap: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Moderate snow",
    75: "Heavy snow",
  }
  return code !== undefined ? weatherMap[code] || `Code ${code}` : "Unknown"
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatLastFetched = (dateString?: string) => {
    if (!dateString) return "Weather unavailable"
    try {
      const date = new Date(dateString)
      return `Updated ${date.toLocaleDateString()}`
    } catch {
      return "Weather unavailable"
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-balance group-hover:text-primary transition-colors">
            {property.property.name}
          </h3>
          {(property.property.city || property.property.state) && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{[property.property.city, property.property.state].filter(Boolean).join(", ")}</span>
            </div>
          )}
        </div>

        {property.property.tags && property.property.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {property.property.tags.slice(0, 3).map((tag:any, index:any) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {property.property.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{property.property.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <span>{property.weather.temperature !== undefined ? `${property.weather.temperature}°C` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span>{property.weather.humidity !== undefined ? `${property.weather.humidity}%` : "N/A"}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Cloud className="h-4 w-4 text-gray-500" />
            <span>{getWeatherDescription(property.weather.weatherCode)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatLastFetched(property.weather.fetchedAt)}</span>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
