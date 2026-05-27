'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useData } from '@/context/data-context'
import { calculateCategoryScores } from '@/lib/analytics'
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Cell, ZAxis, LabelList } from 'recharts'

const QUADRANT_COLORS = {
  topRight: '#ef4444',    // High Opportunity / High Dissatisfaction - Priority
  topLeft: '#22c55e',     // High Opportunity / Low Dissatisfaction - Quick Win
  bottomRight: '#f59e0b', // Low Opportunity / High Dissatisfaction - Monitor
  bottomLeft: '#6b7280',  // Low Opportunity / Low Dissatisfaction - Deprioritize
}

export function OpportunityDissatisfactionMatrix() {
  const { filteredReviews, isLoading } = useData()

  const data = useMemo(() => {
    return calculateCategoryScores(filteredReviews).map((score) => ({
      name: score.category,
      x: score.opportunityScore,
      y: score.dissatisfactionScore,
      z: Math.max(80, Math.min(250, score.complaintCount * 3)),
    }))
  }, [filteredReviews])

  const getQuadrantColor = (x: number, y: number) => {
    if (x >= 5 && y >= 5) return QUADRANT_COLORS.topRight
    if (x >= 5 && y < 5) return QUADRANT_COLORS.topLeft
    if (x < 5 && y >= 5) return QUADRANT_COLORS.bottomRight
    return QUADRANT_COLORS.bottomLeft
  }

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Opportunity vs Dissatisfaction Matrix</CardTitle>
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
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Opportunity vs Dissatisfaction Matrix</CardTitle>
          <CardDescription className="text-xs">
            Strategic quadrant analysis identifying whitespace opportunities and risk areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Quadrant Labels */}
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-400">Quick Win</span>
              <span className="text-[10px] text-emerald-400/70">High Opp / Low Dis</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-red-400">Priority</span>
              <span className="text-[10px] text-red-400/70">High Opp / High Dis</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-gray-500/10 border border-gray-500/20 px-3 py-2">
              <div className="h-3 w-3 rounded-full bg-gray-500" />
              <span className="text-xs font-medium text-gray-400">Deprioritize</span>
              <span className="text-[10px] text-gray-400/70">Low Opp / Low Dis</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-amber-400">Monitor</span>
              <span className="text-[10px] text-amber-400/70">Low Opp / High Dis</span>
            </div>
          </div>

          <div className="h-[400px] relative">
            {/* Background Quadrants */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none rounded-lg overflow-hidden" style={{ zIndex: 0 }}>
              <div className="bg-emerald-500/5" />
              <div className="bg-red-500/5" />
              <div className="bg-gray-500/5" />
              <div className="bg-amber-500/5" />
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 30, right: 30, bottom: 40, left: 40 }}>
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 5, 6, 8, 10]}
                  name="Opportunity"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  label={{
                    value: 'Market Opportunity Score',
                    position: 'bottom',
                    offset: 15,
                    fontSize: 13,
                    fill: 'hsl(var(--foreground))',
                    fontWeight: 500,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 5, 6, 8, 10]}
                  name="Dissatisfaction"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  label={{
                    value: 'Dissatisfaction Score',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 10,
                    fontSize: 13,
                    fill: 'hsl(var(--foreground))',
                    fontWeight: 500,
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
                          Opportunity: <span className="text-primary font-medium">{item.x.toFixed(1)}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Dissatisfaction: <span className="text-primary font-medium">{item.y.toFixed(1)}</span>
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
                      fontSize: '12px', 
                      fill: 'hsl(var(--foreground))',
                      fontWeight: 600,
                      textShadow: '0 0 4px hsl(var(--background)), 0 0 4px hsl(var(--background))'
                    }} 
                  />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Executive Interpretation */}
          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Executive Insight:</strong> Categories in the top-right quadrant represent
              the highest priority opportunities where significant customer dissatisfaction exists
              alongside strong market potential. Quick wins in the top-left should be addressed
              immediately for rapid satisfaction gains.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
