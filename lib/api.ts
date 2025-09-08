import axios from "axios"
import type { PropertyResponse, SearchFilters } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const api = axios.create({
  baseURL: API_BASE_URL,
})

export const getProperties = async (filters: SearchFilters): Promise<PropertyResponse> => {
  const params = new URLSearchParams()

  if (filters.searchText) params.append("searchText", filters.searchText)
  if (filters.minTemp !== undefined) params.append("temp_min", filters.minTemp.toString())
  if (filters.maxTemp !== undefined) params.append("temp_max", filters.maxTemp.toString())
  if (filters.minHumidity !== undefined) params.append("hum_min", filters.minHumidity.toString())
  if (filters.maxHumidity !== undefined) params.append("hum_max", filters.maxHumidity.toString())
  if (filters.weatherCodes) params.append("weather_codes", filters.weatherCodes)

  const response = await api.get(`/get-properties?${params.toString()}`)
  console.log(response.data,"res")
  return response.data
}
