'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useData } from '@/context/data-context'

export function ProductSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentProduct = searchParams.get('product') || ''
  const [searchTerm, setSearchTerm] = useState(currentProduct)
  const { uniqueValues } = useData()

  // We could use uniqueValues to provide an autocomplete dropdown if we wanted,
  // but a simple text search updating the URL is sufficient for now.
  
  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchTerm) {
        params.set('product', searchTerm)
      } else {
        params.delete('product')
      }
      router.push(`/review-intelligence?${params.toString()}`)
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchTerm, router, searchParams])

  return (
    <div className="relative w-full max-w-sm mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        placeholder="Search for a specific product..."
        className="pl-10 bg-card/50 border-border/50"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}
