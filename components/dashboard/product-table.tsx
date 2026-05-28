'use client'

import React, { useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useData } from '@/context/data-context'
import type { Review } from '@/lib/types'

interface ProductStat {
  productName: string
  brand: string
  category: string
  totalReviews: number
  avgRating: number
  verifiedCount: number
  complaintCount: number
}

export function ProductTable() {
  const { filteredReviews, isLoading } = useData()

  const productStats = useMemo(() => {
    if (!filteredReviews || filteredReviews.length === 0) return []

    const map = new Map<string, ProductStat>()

    filteredReviews.forEach((r) => {
      const name = r.product_reviewed || 'Unknown Product'
      if (!map.has(name)) {
        map.set(name, {
          productName: name,
          brand: r.competitor_brand,
          category: r.competitor_category,
          totalReviews: 0,
          avgRating: 0,
          verifiedCount: 0,
          complaintCount: 0,
        })
      }

      const stat = map.get(name)!
      stat.totalReviews += 1
      stat.avgRating += r.rating
      
      const isVerified = r.verified_purchase === 1 || r.verified_purchase === true || String(r.verified_purchase) === '1' || String(r.verified_purchase) === 'true'
      if (isVerified) stat.verifiedCount += 1
      if (r.rating <= 2) stat.complaintCount += 1
    })

    const result = Array.from(map.values()).map(stat => ({
      ...stat,
      avgRating: Number((stat.avgRating / stat.totalReviews).toFixed(1)),
      complaintRate: Number(((stat.complaintCount / stat.totalReviews) * 100).toFixed(1)),
      verifiedRate: Number(((stat.verifiedCount / stat.totalReviews) * 100).toFixed(1)),
    }))

    // Sort by total reviews descending
    return result.sort((a, b) => b.totalReviews - a.totalReviews)
  }, [filteredReviews])

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Product Intelligence</CardTitle>
          <CardDescription>Loading product details...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  if (productStats.length === 0) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Product Intelligence</CardTitle>
          <CardDescription>No products match the selected filters.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Product Intelligence</CardTitle>
        <CardDescription>
          Detailed metrics across {productStats.length} analyzed products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[300px] text-foreground font-semibold">Product Name</TableHead>
                <TableHead className="text-foreground font-semibold">Brand</TableHead>
                <TableHead className="text-foreground font-semibold">Category</TableHead>
                <TableHead className="text-right text-foreground font-semibold">Total Reviews</TableHead>
                <TableHead className="text-right text-foreground font-semibold">Avg Rating</TableHead>
                <TableHead className="text-right text-foreground font-semibold">Verified %</TableHead>
                <TableHead className="text-right text-foreground font-semibold">Complaint %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productStats.map((product, idx) => (
                <TableRow key={`${product.productName}-${idx}`} className="hover:bg-accent/50 transition-colors">
                  <TableCell className="font-medium text-foreground">
                    {product.productName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.brand}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">{product.totalReviews.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className={product.avgRating >= 4 ? 'text-emerald-500 font-medium' : product.avgRating <= 2.5 ? 'text-red-500 font-medium' : ''}>
                      {product.avgRating.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{product.verifiedRate}%</TableCell>
                  <TableCell className="text-right">
                    <span className={product.complaintRate > 20 ? 'text-red-500 font-medium' : 'text-muted-foreground'}>
                      {product.complaintRate}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
