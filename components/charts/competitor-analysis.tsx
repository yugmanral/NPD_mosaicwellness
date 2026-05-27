'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/context/data-context'
import { calculateBrandAnalysis } from '@/lib/analytics'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type SortKey = 'avgRating' | 'complaintVolume' | 'dissatisfactionScore' | 'helpfulVotes' | 'verifiedComplaints'

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'complaintVolume', label: 'Complaint Volume' },
  { value: 'avgRating', label: 'Average Rating' },
  { value: 'dissatisfactionScore', label: 'Dissatisfaction Score' },
  { value: 'helpfulVotes', label: 'Helpful Votes' },
  { value: 'verifiedComplaints', label: 'Verified Complaints' },
]

export function CompetitorAnalysisTable() {
  const { filteredReviews, isLoading } = useData()
  const [sortBy, setSortBy] = useState<SortKey>('complaintVolume')

  const data = useMemo(() => {
    const analysis = calculateBrandAnalysis(filteredReviews)
    return [...analysis].sort((a, b) => {
      if (sortBy === 'avgRating') return b.avgRating - a.avgRating
      return b[sortBy] - a[sortBy]
    })
  }, [filteredReviews, sortBy])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Competitor Brand Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Competitor Brand Analysis</CardTitle>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
            <SelectTrigger className="h-8 w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.map((brand, index) => (
              <div
                key={brand.brand}
                className={cn(
                  'flex items-center justify-between rounded-lg p-3 transition-colors',
                  index % 2 === 0 ? 'bg-muted/50' : 'bg-background'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                  <span className="font-medium text-sm">{brand.brand}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="text-sm font-medium">{brand.avgRating.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Complaints</p>
                    <p className="text-sm font-medium">{brand.complaintVolume}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Dissatisfaction</p>
                    <Badge
                      variant={
                        brand.dissatisfactionScore > 6
                          ? 'destructive'
                          : brand.dissatisfactionScore > 4
                            ? 'secondary'
                            : 'default'
                      }
                      className="text-xs"
                    >
                      {brand.dissatisfactionScore.toFixed(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
