'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/context/data-context'
import { getTrendData } from '@/lib/analytics'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Area,
  ComposedChart,
} from 'recharts'

export function TrendAnalysisChart() {
  const { filteredReviews, isLoading } = useData()

  const data = useMemo(() => {
    return getTrendData(filteredReviews)
  }, [filteredReviews])

  if (isLoading) {
    return (
      <Card className="h-80">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="h-80">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-sm text-muted-foreground">No trend data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
    >
      <Card className="h-80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Complaint & Rating Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-')
                    return `${month}/${year.slice(2)}`
                  }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 5]}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="rounded-lg border bg-popover px-3 py-2 shadow-md">
                        <p className="text-xs font-medium mb-1">{label}</p>
                        {payload.map((item, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground">
                            {item.name}: {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
                          </p>
                        ))}
                      </div>
                    )
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="complaints"
                  fill="hsl(var(--destructive) / 0.2)"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  name="Complaints"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgRating"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Avg Rating"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="text-xs text-muted-foreground">Complaints</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-4 bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Avg Rating</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
