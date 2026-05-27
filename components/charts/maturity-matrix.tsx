'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useData } from '@/context/data-context'
import { calculateCategoryScores } from '@/lib/analytics'
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Cell, ZAxis, LabelList } from 'recharts'

const QUADRANT_COLORS = {
  topRight: '#22c55e',    // Emerging Opportunity - High Opp / Low Saturation
  topLeft: '#f59e0b',     // Mature & Saturated - Low Opp / High Saturation
  bottomRight: '#3b82f6', // High Potential - High Opp / Low Saturation
  bottomLeft: '#6b7280',  // Low Priority - Low Opp / Low Saturation
}

export function CategoryMaturityMatrix() {
  const { filteredReviews, isLoading } = useData()

  const data = useMemo(() => {
    return calculateCategoryScores(filteredReviews).map((score) => ({
      name: score.category,
      x: score.saturationScore,
      y: score.opportunityScore,
      z: Math.max(80, Math.min(250, score.complaintCount * 3)),
      growth: score.trendGrowth,
    }))
  }, [filteredReviews])

  const getQuadrantColor = (x: number, y: number) => {
    if (x >= 5 && y >= 5) return QUADRANT_COLORS.topLeft    // Mature & Saturated
    if (x < 5 && y >= 5) return QUADRANT_COLORS.topRight    // Emerging Opportunity
    if (x >= 5 && y < 5) return QUADRANT_COLORS.bottomLeft  // High-Risk Saturated
    return QUADRANT_COLORS.bottomRight                       // Low-Priority
  }

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Category Maturity vs Opportunity Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[450px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Category Maturity vs Opportunity Matrix</CardTitle>
          <CardDescription className="text-xs">
            Identifying emerging categories vs saturated markets for strategic positioning
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Quadrant Labels */}
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-400">Emerging</span>
              <span className="text-[10px] text-emerald-400/70">High Opp / Low Sat</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-amber-400">Saturated</span>
              <span className="text-[10px] text-amber-400/70">High Opp / High Sat</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-blue-400">Low Priority</span>
              <span className="text-[10px] text-blue-400/70">Low Opp / Low Sat</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-gray-500/10 border border-gray-500/20 px-3 py-2">
              <div className="h-3 w-3 rounded-full bg-gray-500" />
              <span className="text-xs font-medium text-gray-400">High-Risk</span>
              <span className="text-[10px] text-gray-400/70">Low Opp / High Sat</span>
            </div>
          </div>

          <div className="h-[400px] relative">
            {/* Background Quadrants */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none rounded-lg overflow-hidden" style={{ zIndex: 0 }}>
              <div className="bg-emerald-500/5" />
              <div className="bg-amber-500/5" />
              <div className="bg-blue-500/5" />
              <div className="bg-gray-500/5" />
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 30, right: 30, bottom: 40, left: 40 }}>
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 5, 6, 8, 10]}
                  name="Saturation"
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  label={{
                    value: 'Category Saturation Score',
                    position: 'bottom',
                    offset: 15,
                    fontSize: 11,
                    fill: 'hsl(var(--muted-foreground))',
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 5, 6, 8, 10]}
                  name="Opportunity"
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  label={{
                    value: 'Market Opportunity Score',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 10,
                    fontSize: 11,
                    fill: 'hsl(var(--muted-foreground))',
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[80, 300]} />
                <ReferenceLine x={5} stroke="hsl(var(--border))" strokeDasharray="4 4" strokeWidth={1.5} />
                <ReferenceLine y={5} stroke="hsl(var(--border))" strokeDasharray="4 4" strokeWidth={1.5} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const item = payload[0].payload
                    return (
                      <div className="rounded-lg border border-border/50 bg-popover/95 backdrop-blur-sm px-3 py-2 shadow-xl">
                        <p className="text-sm font-medium text-popover-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Saturation: <span className="text-primary font-medium">{item.x.toFixed(1)}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Opportunity: <span className="text-primary font-medium">{item.y.toFixed(1)}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Trend: <span className={item.growth > 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {item.growth > 0 ? '+' : ''}{item.growth.toFixed(1)}%
                          </span>
                        </p>
                      </div>
                    )
                  }}
                />
                <Scatter name="Categories" data={data}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getQuadrantColor(entry.x, entry.y)}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth={2}
                    />
                  ))}
                  <LabelList 
                    dataKey="name" 
                    position="top" 
                    offset={12}
                    style={{ 
                      fontSize: '9px', 
                      fill: 'hsl(var(--muted-foreground))',
                      fontWeight: 500,
                    }} 
                  />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Executive Interpretation */}
          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Executive Insight:</strong> Focus resources on emerging opportunity categories
              (top-left) where market potential is high but competition is still developing.
              Saturated markets require differentiation strategies, while low-priority segments
              may warrant resource reallocation.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
