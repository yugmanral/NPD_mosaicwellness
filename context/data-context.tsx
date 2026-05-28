'use client'

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import useSWR from 'swr'
import type { Review, Filters } from '@/lib/types'
import { fetchAllReviews } from '@/lib/api'
import { filterReviews, getUniqueValues } from '@/lib/analytics'

interface DataContextType {
  reviews: Review[]
  filteredReviews: Review[]
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  clearFilters: () => void
  uniqueValues: ReturnType<typeof getUniqueValues> | null
  isLoading: boolean
  error: Error | null
}

const initialFilters: Filters = {
  competitor_brand: [],
  competitor_category: [],
  platform: [],
  rating_bin: [],
  verified_purchase: [],
  date_range: [null, null],
  product_reviewed: [],
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { data: reviews = [], error, isLoading } = useSWR('reviews', fetchAllReviews, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const [filters, setFilters] = useState<Filters>(initialFilters)

  const uniqueValues = useMemo(() => {
    if (reviews.length === 0) return null
    return getUniqueValues(reviews)
  }, [reviews])

  const filteredReviews = useMemo(() => {
    return filterReviews(reviews, filters)
  }, [reviews, filters])

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  return (
    <DataContext.Provider
      value={{
        reviews,
        filteredReviews,
        filters,
        setFilters,
        updateFilter,
        clearFilters,
        uniqueValues,
        isLoading,
        error: error as Error | null,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
