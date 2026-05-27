'use client'

import React, { useMemo } from 'react'
import { useData } from '@/context/data-context'
import { KPICard, KPIGrid } from './kpi-card'
import {
  calculateFrustrationIndex,
  calculateHighImpactRatio,
  calculateCategoryScores,
  findHighestRiskCategory,
  findHighestPotentialCategory,
  generateSparklineData,
} from '@/lib/analytics'

export function ExecutiveKPIs() {
  const { filteredReviews, isLoading } = useData()

  const kpis = useMemo(() => {
    if (filteredReviews.length === 0) {
      return {
        totalReviews: 0,
        avgRating: 0,
        highestRiskCategory: 'N/A',
        highestPotentialCategory: 'N/A',
        verifiedPurchasePercent: 0,
        avgHelpfulVotes: 0,
        frustrationIndex: 0,
        highImpactRatio: 0,
        ratingSparkline: [],
        complaintsSparkline: [],
        helpfulSparkline: [],
      }
    }

    const totalReviews = filteredReviews.length
    const avgRating = filteredReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    const categoryScores = calculateCategoryScores(filteredReviews)
    const verifiedCount = filteredReviews.filter((r) => r.verified_purchase === 1).length
    const avgHelpfulVotes = filteredReviews.reduce((sum, r) => sum + r.helpful_votes, 0) / totalReviews

    return {
      totalReviews,
      avgRating: Math.round(avgRating * 100) / 100,
      highestRiskCategory: findHighestRiskCategory(categoryScores),
      highestPotentialCategory: findHighestPotentialCategory(categoryScores),
      verifiedPurchasePercent: Math.round((verifiedCount / totalReviews) * 1000) / 10,
      avgHelpfulVotes: Math.round(avgHelpfulVotes * 10) / 10,
      frustrationIndex: calculateFrustrationIndex(filteredReviews),
      highImpactRatio: calculateHighImpactRatio(filteredReviews),
      ratingSparkline: generateSparklineData(filteredReviews, 'rating'),
      complaintsSparkline: generateSparklineData(filteredReviews, 'complaints'),
      helpfulSparkline: generateSparklineData(filteredReviews, 'helpful'),
    }
  }, [filteredReviews])

  if (isLoading) {
    return (
      <KPIGrid>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </KPIGrid>
    )
  }

  return (
    <KPIGrid>
      <KPICard
        label="Total Reviews"
        value={kpis.totalReviews.toLocaleString()}
        insight="Total customer reviews analyzed across all platforms and categories."
        sparklineData={kpis.complaintsSparkline}
        delay={0}
      />
      <KPICard
        label="Average Rating"
        value={`${kpis.avgRating}/5`}
        trend={kpis.avgRating >= 3 ? 5 : -5}
        insight={`Overall sentiment is ${kpis.avgRating >= 3.5 ? 'positive' : kpis.avgRating >= 2.5 ? 'mixed' : 'concerning'}. Monitor low-rated reviews for insights.`}
        sparklineData={kpis.ratingSparkline}
        delay={0.05}
      />
      <KPICard
        label="Highest Risk Category"
        value={kpis.highestRiskCategory}
        insight="Category with highest dissatisfaction intensity requiring immediate attention."
        delay={0.1}
      />
      <KPICard
        label="Highest Potential Category"
        value={kpis.highestPotentialCategory}
        insight="Category showing strongest whitespace opportunity for innovation."
        delay={0.15}
      />
      <KPICard
        label="Verified Purchase %"
        value={`${kpis.verifiedPurchasePercent}%`}
        trend={kpis.verifiedPurchasePercent >= 50 ? 8 : -3}
        insight="Percentage of reviews from verified purchasers. Higher rates indicate more reliable feedback."
        delay={0.2}
      />
      <KPICard
        label="Avg Helpful Votes"
        value={kpis.avgHelpfulVotes}
        insight="Average community engagement per review. High votes indicate impactful feedback."
        sparklineData={kpis.helpfulSparkline}
        delay={0.25}
      />
      <KPICard
        label="Frustration Index"
        value={`${kpis.frustrationIndex}/100`}
        trend={kpis.frustrationIndex > 50 ? -8 : 5}
        insight={`${kpis.frustrationIndex > 60 ? 'High customer dissatisfaction detected.' : kpis.frustrationIndex > 40 ? 'Moderate frustration levels.' : 'Customer satisfaction is healthy.'}`}
        delay={0.3}
      />
      <KPICard
        label="High-Impact Complaint %"
        value={`${kpis.highImpactRatio}%`}
        trend={kpis.highImpactRatio > 30 ? -10 : 3}
        insight="Percentage of complaints that are verified, low-rated, and highly engaged. Priority issues."
        delay={0.35}
      />
    </KPIGrid>
  )
}
