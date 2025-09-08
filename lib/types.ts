export interface Property {
  id: string
  name: string
  city?: string
  state?: string
  tags?: string[]
  temperature?: number
  humidity?: number
  weatherCode?: number
  lastFetched?: string
  image?: string
  price?: number
}

export interface PropertyResponse {
  data: Property[]
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    totalPages?: number
  }
}

export interface SearchFilters {
  searchText?: string
  minTemp?: number
  maxTemp?: number
  minHumidity?: number
  maxHumidity?: number
  weatherCodes?: string
  page?: number
  pageSize?: number
}
