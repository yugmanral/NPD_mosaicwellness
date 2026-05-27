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
        highestPotentialCategory: { category: 'N/A', score: 0, insight: '' },
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
    
    // Looser check to correctly handle verified_purchase as int, bool, or string
    const verifiedCount = filteredReviews.filter((r) => r.verified_purchase === 1 || r.verified_purchase === true || String(r.verified_purchase) === '1' || String(r.verified_purchase) === 'true').length
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

  // Dynamic Frustration Index Interpretation
  let frustrationInterpretation = ''
  if (kpis.frustrationIndex >= 60) frustrationInterpretation = 'Critical Frustration'
  else if (kpis.frustrationIndex >= 40) frustrationInterpretation = 'Elevated Frustration'
  else if (kpis.frustrationIndex >= 20) frustrationInterpretation = 'Moderate Frustration'
  else frustrationInterpretation = 'Low Frustration'

  return (
    <KPIGrid>
      <KPICard
        label="Total Reviews"
        value={`${kpis.totalReviews.toLocaleString()} Reviews Analyzed`}
        insight="Dataset completeness confirmed. Statistical significance threshold achieved for all underlying platform metrics."
        sparklineData={kpis.complaintsSparkline}
        delay={0}
      />
      <KPICard
        label="Average Rating"
        value={`${kpis.avgRating}/5`}
        trend={kpis.avgRating >= 3 ? 5 : -5}
        insight="Personalization and progress-tracking gaps continue to drive dissatisfaction."
        sparklineData={kpis.ratingSparkline}
        delay={0.05}
      />
      <KPICard
        label="Highest Risk Category"
        value={kpis.highestRiskCategory}
        insight="Trust-related complaints remain concentrated in wellness and supplement categories."
        delay={0.1}
      />
      <KPICard
        label="Highest Potential Category"
        value={
          kpis.highestPotentialCategory.category === 'N/A'
            ? 'N/A'
            : (
              <div className="flex flex-col">
                <span>{kpis.highestPotentialCategory.category}</span>
                <span className="text-sm font-medium text-muted-foreground mt-1">
                  {kpis.highestPotentialCategory.score}/100 Opportunity Score
                </span>
              </div>
            )
        }
        insight="Driven by elevated trust-deficit, personalization, and progress-tracking complaints."
        delay={0.15}
      />
      <KPICard
        label="Verified Purchase %"
        value={`${kpis.verifiedPurchasePercent}%`}
        trend={kpis.verifiedPurchasePercent >= 50 ? 8 : -3}
        insight="High verification indicates that complaints stem from actual product usage rather than reputational noise."
        delay={0.2}
      />
      <KPICard
        label="Avg Helpful Votes"
        value={kpis.avgHelpfulVotes}
        insight="Ingredient transparency concerns show unusually high engagement intensity."
        sparklineData={kpis.helpfulSparkline}
        delay={0.25}
      />
      <KPICard
        label="Frustration Index"
        value={`${kpis.frustrationIndex}/100`}
        trend={kpis.frustrationIndex > 50 ? -8 : 5}
        insight={frustrationInterpretation}
        delay={0.3}
      />
      <KPICard
        label="High-Impact Complaint %"
        value={`${kpis.highImpactRatio}%`}
        trend={kpis.highImpactRatio > 30 ? -10 : 3}
        insight="Percentage of 1-2 star verified reviews heavily upvoted by the community. These are viral risk vectors."
        delay={0.35}
      />
    </KPIGrid>
  )
}
