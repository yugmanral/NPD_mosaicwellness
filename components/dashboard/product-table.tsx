'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
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
import { ArrowUpDown, ArrowDown, ArrowUp, ExternalLink } from 'lucide-react'

interface ProductStat {
  productName: string
  brand: string
  category: string
  totalReviews: number
  avgRating: number
  verifiedCount: number
  complaintCount: number
  complaintRate?: number
  verifiedRate?: number
}

type SortKey = keyof ProductStat

export function ProductTable() {
  const { filteredReviews, isLoading } = useData()
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'complaintRate',
    direction: 'desc',
  })

  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
    }))
  }

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

    return result.sort((a, b) => {
      const valA = a[sortConfig.key]
      const valB = b[sortConfig.key]

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortConfig.direction === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA)
      }

      const numA = (valA as number) || 0
      const numB = (valB as number) || 0

      return sortConfig.direction === 'asc' ? numA - numB : numB - numA
    })
  }, [filteredReviews, sortConfig])

  const renderSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50 inline-block" />
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4 text-foreground inline-block" />
      : <ArrowDown className="ml-2 h-4 w-4 text-foreground inline-block" />
  }

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
                <TableHead 
                  className="w-[300px] text-foreground font-semibold cursor-pointer hover:bg-muted/80 transition-colors select-none"
                  onClick={() => handleSort('productName')}
                >
                  Product Name {renderSortIcon('productName')}
                </TableHead>
                <TableHead 
                  className="text-foreground font-semibold cursor-pointer hover:bg-muted/80 transition-colors select-none"
                  onClick={() => handleSort('brand')}
                >
                  Brand {renderSortIcon('brand')}
                </TableHead>
                <TableHead 
                  className="text-foreground font-semibold cursor-pointer hover:bg-muted/80 transition-colors select-none"
                  onClick={() => handleSort('category')}
                >
                  Category {renderSortIcon('category')}
                </TableHead>
                <TableHead 
                  className="text-right text-foreground font-semibold cursor-pointer hover:bg-muted/80 transition-colors select-none"
                  onClick={() => handleSort('totalReviews')}
                >
                  Total Reviews {renderSortIcon('totalReviews')}
                </TableHead>
                <TableHead 
                  className="text-right text-foreground font-semibold cursor-pointer hover:bg-muted/80 transition-colors select-none"
                  onClick={() => handleSort('avgRating')}
                >
                  Avg Rating {renderSortIcon('avgRating')}
                </TableHead>
                <TableHead 
                  className="text-right text-foreground font-semibold cursor-pointer hover:bg-muted/80 transition-colors select-none"
                  onClick={() => handleSort('verifiedRate')}
                >
                  Verified % {renderSortIcon('verifiedRate')}
                </TableHead>
                <TableHead 
                  className="text-right text-foreground font-semibold cursor-pointer hover:bg-muted/80 transition-colors select-none"
                  onClick={() => handleSort('complaintRate')}
                >
                  Complaint % {renderSortIcon('complaintRate')}
                </TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productStats.map((product, idx) => (
                <TableRow key={`${product.productName}-${idx}`} className="hover:bg-accent/50 transition-colors group">
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
                    <span className={(product.complaintRate || 0) > 20 ? 'text-red-500 font-medium' : 'text-muted-foreground'}>
                      {product.complaintRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link 
                      href={`/review-intelligence?product=${encodeURIComponent(product.productName)}`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title={`View Review Intelligence for ${product.productName}`}
                    >
                      <ExternalLink className="h-4 w-4 text-primary" />
                    </Link>
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
