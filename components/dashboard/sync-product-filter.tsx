'use client'

import { useEffect, useRef } from 'react'
import { useData } from '@/context/data-context'

export function SyncProductFilter({ product }: { product?: string }) {
  const { updateFilter } = useData()
  useEffect(() => {
    if (product) {
      updateFilter('product_reviewed', [product])
    } else {
      // If we navigate here without a product, clear it so we see all products
      updateFilter('product_reviewed', [])
    }
  }, [product, updateFilter])

  return null
}
