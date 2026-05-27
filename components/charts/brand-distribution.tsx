'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/context/data-context'
import { getBrandDistribution } from '@/lib/analytics'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#6366f1', '#22c55e', '#eab308', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6']

export function BrandDistributionChart() {
  const { filteredReviews, isLoading } = useData()

  const data = useMemo(() => {
    return getBrandDistribution(filteredReviews)
  }, [filteredReviews])

  if (isLoading) {
    return (
      <Card className="h-80">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Competitor Brand Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center">
            <div className="h-40 w-40 animate-pulse rounded-full bg-muted" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <Card className="h-80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Competitor Brand Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ percentage }) => `${percentage.toFixed(1)}%`}
                  labelLine={false}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const item = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-popover px-3 py-2 shadow-md">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.value.toLocaleString()} reviews ({item.percentage}%)
                        </p>
                      </div>
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {data.slice(0, 5).map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
