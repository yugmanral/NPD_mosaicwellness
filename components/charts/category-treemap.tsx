'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/context/data-context'
import { getCategoryComplaintVolume } from '@/lib/analytics'
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899']

interface TreemapContentProps {
  x: number
  y: number
  width: number
  height: number
  index: number
  name: string
  value: number
}

const CustomContent = ({ x, y, width, height, index, name, value }: TreemapContentProps) => {
  if (width < 50 || height < 30) return null

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={COLORS[index % COLORS.length]}
        stroke="#fff"
        strokeWidth={2}
        rx={4}
      />
      {width > 80 && height > 45 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 6}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight={500}
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="rgba(255,255,255,0.8)"
            fontSize={10}
          >
            {value} complaints
          </text>
        </>
      )}
    </g>
  )
}

export function CategoryTreemap() {
  const { filteredReviews, isLoading } = useData()

  const data = useMemo(() => {
    return getCategoryComplaintVolume(filteredReviews)
  }, [filteredReviews])

  if (isLoading) {
    return (
      <Card className="h-80">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Category Complaint Volume</CardTitle>
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
          <CardTitle className="text-sm font-medium">Category Complaint Volume</CardTitle>
        </CardHeader>
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-sm text-muted-foreground">No complaint data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="h-80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Category Complaint Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={data}
                dataKey="value"
                stroke="#fff"
                fill="#8884d8"
                content={<CustomContent x={0} y={0} width={0} height={0} index={0} name="" value={0} />}
              >
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const item = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-popover px-3 py-2 shadow-md">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.value.toLocaleString()} complaints
                        </p>
                      </div>
                    )
                  }}
                />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
