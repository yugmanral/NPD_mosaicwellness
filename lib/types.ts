export interface Review {
  review_id: string
  competitor_brand: string
  competitor_category: string
  product_reviewed: string
  platform: string
  rating: number
  review_date: string
  review_text: string
  detected_unmet_needs: string
  helpful_votes: number
  verified_purchase: number
}

export interface ReviewsResponse {
  data: Review[]
  pagination: {
    currentPage: number
    totalPages: number
    totalRecords: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface Filters {
  competitor_brand: string[]
  competitor_category: string[]
  platform: string[]
  rating_bin: string[]
  verified_purchase: string[]
  date_range: [Date | null, Date | null]
}

export interface KPIMetric {
  label: string
  value: string | number
  trend?: number
  insight: string
  sparklineData?: number[]
}

export interface CategoryScore {
  category: string
  opportunityScore: number
  dissatisfactionScore: number
  saturationScore: number
  complaintCount: number
  avgRating: number
  trendGrowth: number
}

export interface BrandAnalysis {
  brand: string
  avgRating: number
  complaintVolume: number
  dissatisfactionScore: number
  helpfulVotes: number
  verifiedComplaints: number
}

export interface ComplaintTheme {
  theme: string
  count: number
  percentage: number
  keywords: string[]
  sentiment: 'negative' | 'neutral' | 'mixed'
}

export type RatingBin = 'Low' | 'Moderate' | 'High'

export const RATING_BINS: Record<RatingBin, { label: string; range: string; min: number; max: number }> = {
  Low: { label: 'Low', range: '<1.5', min: 0, max: 1.5 },
  Moderate: { label: 'Moderate', range: '1.5-3.5', min: 1.5, max: 3.5 },
  High: { label: 'High', range: '>3.5', min: 3.5, max: 5 },
}
