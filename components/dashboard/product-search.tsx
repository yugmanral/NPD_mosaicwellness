"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useData } from '@/context/data-context'

export function ProductSearch({ initialProduct = '' }: { initialProduct?: string }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(initialProduct)
  const { uniqueValues, updateFilter } = useData()

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        updateFilter('product_reviewed', [searchTerm])
        router.push(`/review-intelligence?product=${encodeURIComponent(searchTerm)}`)
      } else {
        updateFilter('product_reviewed', [])
        router.push(`/review-intelligence`)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchTerm, router, updateFilter])

  return (
    <div className="relative w-full max-w-sm mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        list="product-list"
        placeholder="Search or select a product..."
        className="pl-10 bg-card/50 border-border/50"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <datalist id="product-list">
        {uniqueValues?.products?.map((product) => (
          <option key={product} value={product} />
        ))}
      </datalist>
    </div>
  )
}
