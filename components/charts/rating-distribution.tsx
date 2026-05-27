'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/context/data-context'
import { getRatingDistribution } from '@/lib/analytics'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'

const RATING_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981']

export function RatingDistributionChart() {
  const { filteredReviews, isLoading } = useData()

  const data = useMemo(() => {
    return getRatingDistribution(filteredReviews)
  }, [filteredReviews])

  if (isLoading) {
    return (
      <Card className="h-80">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="h-80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="rating"
                  width={60}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const item = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-popover px-3 py-2 shadow-md">
                        <p className="text-sm font-medium">{item.rating}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.count.toLocaleString()} reviews ({item.percentage}%)
                        </p>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={RATING_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
