"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Thermometer, Droplets, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface FiltersProps {
  filters: {
    minTemp?: number
    maxTemp?: number
    minHumidity?: number
    maxHumidity?: number
    weatherCodes?: string
  }
  onFiltersChange: (filters: any) => void
  onApply: () => void
  onReset: () => void
  className?: string
}

const WEATHER_CODES = [
  { code: 0, label: "Clear sky" },
  { code: 1, label: "Mainly clear" },
  { code: 2, label: "Partly cloudy" },
  { code: 3, label: "Overcast" },
  { code: 61, label: "Light rain" },
  { code: 63, label: "Moderate rain" },
  { code: 65, label: "Heavy rain" },
  { code: 71, label: "Light snow" },
  { code: 73, label: "Moderate snow" },
  { code: 75, label: "Heavy snow" },
]

export function FiltersPanel({ filters, onFiltersChange, onApply, onReset, className }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [tempRange, setTempRange] = useState([filters.minTemp || -10, filters.maxTemp || 50])
  const [humidityRange, setHumidityRange] = useState([filters.minHumidity || 0, filters.maxHumidity || 100])
  const [selectedWeatherCodes, setSelectedWeatherCodes] = useState<number[]>(
    filters.weatherCodes ? filters.weatherCodes.split(",").map(Number) : [],
  )
  const [customWeatherCodes, setCustomWeatherCodes] = useState("")

  const handleTempChange = (values: number[]) => {
    setTempRange(values)
    onFiltersChange({
      ...filters,
      minTemp: values[0],
      maxTemp: values[1],
    })
  }

  const handleHumidityChange = (values: number[]) => {
    setHumidityRange(values)
    onFiltersChange({
      ...filters,
      minHumidity: values[0],
      maxHumidity: values[1],
    })
  }

  const handleWeatherCodeToggle = (code: number, checked: boolean) => {
    const newCodes = checked ? [...selectedWeatherCodes, code] : selectedWeatherCodes.filter((c) => c !== code)

    setSelectedWeatherCodes(newCodes)
    onFiltersChange({
      ...filters,
      weatherCodes: newCodes.length > 0 ? newCodes.join(",") : undefined,
    })
  }

  const handleCustomWeatherCodes = (value: string) => {
    setCustomWeatherCodes(value)
    onFiltersChange({
      ...filters,
      weatherCodes: value || undefined,
    })
  }

  const handleReset = () => {
    setTempRange([-10, 50])
    setHumidityRange([0, 100])
    setSelectedWeatherCodes([])
    setCustomWeatherCodes("")
    onReset()
  }

  return (
    <Card className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Filters
              </span>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Temperature Filter */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Thermometer className="h-4 w-4" />
                Temperature (°C)
              </Label>
              <div className="px-2">
                <Slider
                  value={tempRange}
                  onValueChange={handleTempChange}
                  min={-10}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{tempRange[0]}°C</span>
                  <span>{tempRange[1]}°C</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={tempRange[0]}
                  onChange={(e) => handleTempChange([Number(e.target.value), tempRange[1]])}
                  className="w-20 text-xs"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={tempRange[1]}
                  onChange={(e) => handleTempChange([tempRange[0], Number(e.target.value)])}
                  className="w-20 text-xs"
                />
              </div>
            </div>

            {/* Humidity Filter */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Droplets className="h-4 w-4" />
                Humidity (%)
              </Label>
              <div className="px-2">
                <Slider
                  value={humidityRange}
                  onValueChange={handleHumidityChange}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{humidityRange[0]}%</span>
                  <span>{humidityRange[1]}%</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={humidityRange[0]}
                  onChange={(e) => handleHumidityChange([Number(e.target.value), humidityRange[1]])}
                  className="w-20 text-xs"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={humidityRange[1]}
                  onChange={(e) => handleHumidityChange([humidityRange[0], Number(e.target.value)])}
                  className="w-20 text-xs"
                />
              </div>
            </div>

            {/* Weather Codes Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Weather Codes</Label>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {WEATHER_CODES.map((weather) => (
                  <div key={weather.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={`weather-${weather.code}`}
                      checked={selectedWeatherCodes.includes(weather.code)}
                      onCheckedChange={(checked) => handleWeatherCodeToggle(weather.code, checked as boolean)}
                    />
                    <Label htmlFor={`weather-${weather.code}`} className="text-xs cursor-pointer">
                      {weather.code}: {weather.label}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Custom codes (CSV)</Label>
                <Input
                  placeholder="e.g., 0,61,63"
                  value={customWeatherCodes}
                  onChange={(e) => handleCustomWeatherCodes(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={onApply} className="flex-1 bg-primary hover:bg-primary/90">
                Apply Filters
              </Button>
              <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
                Reset
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
