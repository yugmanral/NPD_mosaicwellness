'use client'

import { useEffect, useRef } from 'react'
import { useData } from '@/context/data-context'

export function SyncProductFilter({ product }: { product?: string }) {
  const { updateFilter } = useData()
  const hasSynced = useRef(false)

  useEffect(() => {
    if (product && !hasSynced.current) {
      updateFilter('product_reviewed', [product])
      hasSynced.current = true
    }
  }, [product, updateFilter])

  return null
}
