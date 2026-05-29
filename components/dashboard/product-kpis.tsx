'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Star, AlertOctagon } from 'lucide-react'
import { useData } from '@/context/data-context'
import { KPICard } from './kpi-card'

export function ProductKPIs() {
  const { filteredReviews } = useData()

  const { avgRating, avgComplaintRate } = useMemo(() => {
    if (!filteredReviews || filteredReviews.length === 0) {
      return { avgRating: 0, avgComplaintRate: 0 }
    }

    const avgRating = filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length
    const complaints = filteredReviews.filter(r => r.rating <= 2).length
    const avgComplaintRate = (complaints / filteredReviews.length) * 100

    return {
      avgRating: Math.round(avgRating * 10) / 10,
      avgComplaintRate: Math.round(avgComplaintRate * 10) / 10,
    }
  }, [filteredReviews])

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <KPICard
          title="Average Rating"
          value={avgRating.toFixed(1)}
          icon={<Star className="h-4 w-4 text-emerald-500" />}
          description="Across filtered products"
          trend={avgRating >= 4 ? "+ Healthy" : avgRating <= 3 ? "- Critical" : "Stable"}
          trendDirection={avgRating >= 4 ? 'up' : avgRating <= 3 ? 'down' : 'neutral'}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <KPICard
          title="Average Complaint %"
          value={`${avgComplaintRate}%`}
          icon={<AlertOctagon className="h-4 w-4 text-red-500" />}
          description="Reviews rated 1-2 stars"
          trend={avgComplaintRate > 20 ? "+ High Risk" : "- Low Risk"}
          trendDirection={avgComplaintRate > 20 ? 'down' : 'up'}
        />
      </motion.div>
    </div>
  )
}
