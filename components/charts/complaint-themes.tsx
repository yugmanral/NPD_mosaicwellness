'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useData } from '@/context/data-context'
import { extractComplaintThemes } from '@/lib/analytics'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, TrendingUp, MessageSquare } from 'lucide-react'

export function ComplaintThemesAnalysis() {
  const { filteredReviews, isLoading } = useData()

  const themes = useMemo(() => {
    return extractComplaintThemes(filteredReviews)
  }, [filteredReviews])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Customer Review Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (themes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Customer Review Intelligence</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">No complaint themes detected</p>
        </CardContent>
      </Card>
    )
  }

  const topTheme = themes[0]
  const maxPercentage = Math.max(...themes.map((t) => t.percentage))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-sm font-medium">Customer Review Intelligence</CardTitle>
              <CardDescription className="mt-1 text-xs">
                AI-extracted complaint themes from {filteredReviews.filter((r) => r.rating <= 3).length} reviews
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 dark:bg-amber-950/30">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                Top Issue: {topTheme.theme}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {themes.slice(0, 8).map((theme, index) => (
              <motion.div
                key={theme.theme}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{theme.theme}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {theme.count} mentions
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground">
                      {theme.percentage}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={(theme.percentage / maxPercentage) * 100}
                  className="h-2"
                />
                <div className="flex flex-wrap gap-1">
                  {theme.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Strategic Insight */}
          <div className="mt-6 rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Strategic Insight</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Primary customer concerns center around <strong>{topTheme.theme.toLowerCase()}</strong>,
              appearing in {topTheme.percentage}% of analyzed complaints. Secondary issues include{' '}
              {themes[1]?.theme.toLowerCase() || 'product quality'} and{' '}
              {themes[2]?.theme.toLowerCase() || 'customer experience'}. Addressing these themes
              could significantly improve customer satisfaction and reduce churn.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
