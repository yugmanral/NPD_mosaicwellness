'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  label: string
  value: string | number
  trend?: number
  insight?: string
  sparklineData?: number[]
  className?: string
  delay?: number
}

export function KPICard({
  label,
  value,
  trend,
  insight,
  sparklineData,
  className,
  delay = 0,
}: KPICardProps) {
  const trendIcon =
    trend === undefined ? null : trend > 0 ? (
      <TrendingUp className="h-3 w-3 text-emerald-500" />
    ) : trend < 0 ? (
      <TrendingDown className="h-3 w-3 text-red-500" />
    ) : (
      <Minus className="h-3 w-3 text-muted-foreground" />
    )

  const trendColor =
    trend === undefined
      ? ''
      : trend > 0
        ? 'text-emerald-500'
        : trend < 0
          ? 'text-red-500'
          : 'text-muted-foreground'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className={cn('h-full overflow-hidden', className)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {label}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold tracking-tight text-foreground">
                  {value}
                </span>
                {trend !== undefined && (
                  <div className={cn('flex items-center gap-0.5 text-xs font-medium', trendColor)}>
                    {trendIcon}
                    <span>{Math.abs(trend).toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>
            
            {sparklineData && sparklineData.length > 0 && (
              <Sparkline data={sparklineData} />
            )}
          </div>
          {insight && (
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {insight}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 60
      const y = 24 - ((value - min) / range) * 20
      return `${x},${y}`
    })
    .join(' ')

  const isPositive = data[data.length - 1] >= data[0]

  return (
    <svg width="60" height="28" className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? '#10b981' : '#ef4444'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface KPIGridProps {
  children: React.ReactNode
}

export function KPIGrid({ children }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  )
}
