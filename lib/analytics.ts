import type { Review, Filters, CategoryScore, BrandAnalysis, ComplaintTheme, RATING_BINS } from './types'

// Filter reviews based on global filters
export function filterReviews(reviews: Review[], filters: Filters): Review[] {
  return reviews.filter(review => {
    // Brand filter
    if (filters.competitor_brand.length > 0 && !filters.competitor_brand.includes(review.competitor_brand)) {
      return false
    }
    
    // Category filter
    if (filters.competitor_category.length > 0 && !filters.competitor_category.includes(review.competitor_category)) {
      return false
    }
    
    // Platform filter
    if (filters.platform.length > 0 && !filters.platform.includes(review.platform)) {
      return false
    }
    
    // Rating bin filter
    if (filters.rating_bin.length > 0) {
      const bin = getRatingBin(review.rating)
      if (!filters.rating_bin.includes(bin)) return false
    }
    
    // Verified purchase filter
    if (filters.verified_purchase.length > 0) {
      const isVerified = review.verified_purchase === 1 || review.verified_purchase === true || String(review.verified_purchase) === '1' || String(review.verified_purchase) === 'true';
      const verified = isVerified ? 'Yes' : 'No';
      if (!filters.verified_purchase.includes(verified)) return false
    }
    
    // Date range filter
    if (filters.date_range[0] || filters.date_range[1]) {
      const reviewDate = new Date(review.review_date)
      if (filters.date_range[0] && reviewDate < filters.date_range[0]) return false
      if (filters.date_range[1] && reviewDate > filters.date_range[1]) return false
    }

    // Product filter (partial match)
    if (filters.product_reviewed && filters.product_reviewed.length > 0) {
      const searchTerm = filters.product_reviewed[0].toLowerCase();
      const productName = (review.product_reviewed || '').toLowerCase();
      if (!productName.includes(searchTerm)) return false;
    }
    
    return true
  })
}

export function getRatingBin(rating: number): string {
  if (rating < 1.5) return 'Low'
  if (rating <= 3.5) return 'Moderate'
  return 'High'
}

export function getUniqueValues(reviews: Review[]) {
  return {
    brands: [...new Set(reviews.map(r => r.competitor_brand))].sort(),
    categories: [...new Set(reviews.map(r => r.competitor_category))].sort(),
    platforms: [...new Set(reviews.map(r => r.platform))].sort(),
    products: [...new Set(reviews.map(r => r.product_reviewed))].filter(Boolean).sort(),
    dateRange: getDateRange(reviews),
  }
}

function getDateRange(reviews: Review[]): [Date, Date] {
  const dates = reviews.map(r => new Date(r.review_date)).sort((a, b) => a.getTime() - b.getTime())
  return [dates[0], dates[dates.length - 1]]
}

// Calculate Customer Frustration Index (0-100)
export function calculateFrustrationIndex(reviews: Review[]): number {
  if (reviews.length === 0) return 0
  
  // Rating Severity (40%) - lower ratings = higher severity
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const ratingSeverity = ((5 - avgRating) / 5) * 100
  
  // Complaint Frequency (30%) - percentage of low-rated reviews
  const lowRatedCount = reviews.filter(r => r.rating <= 2).length
  const complaintFrequency = (lowRatedCount / reviews.length) * 100
  
  // Helpful Votes Intensity (20%) - normalized helpful votes on complaints
  const complaints = reviews.filter(r => r.rating <= 2)
  const avgHelpfulVotes = complaints.length > 0 
    ? complaints.reduce((sum, r) => sum + r.helpful_votes, 0) / complaints.length 
    : 0
  const maxHelpfulVotes = Math.max(...reviews.map(r => r.helpful_votes), 1)
  const helpfulIntensity = (avgHelpfulVotes / maxHelpfulVotes) * 100
  
  // Verified Purchase Weight (10%)
  const verifiedComplaints = complaints.filter(r => r.verified_purchase === 1 || r.verified_purchase === true || String(r.verified_purchase) === '1' || String(r.verified_purchase) === 'true').length
  const verifiedWeight = complaints.length > 0 ? (verifiedComplaints / complaints.length) * 100 : 0
  
  const frustrationIndex = 
    (ratingSeverity * 0.4) + 
    (complaintFrequency * 0.3) + 
    (helpfulIntensity * 0.2) + 
    (verifiedWeight * 0.1)
  
  return Math.round(frustrationIndex * 10) / 10
}

// Calculate High-Impact Complaint Ratio
export function calculateHighImpactRatio(reviews: Review[]): number {
  if (reviews.length === 0) return 0
  
  const avgHelpfulVotes = reviews.reduce((sum, r) => sum + (Number(r.helpful_votes) || 0), 0) / reviews.length
  
  const highImpactComplaints = reviews.filter(r => 
    r.rating <= 2 && 
    (Number(r.helpful_votes) || 0) > avgHelpfulVotes && 
    (r.verified_purchase === 1 || r.verified_purchase === true || String(r.verified_purchase) === '1' || String(r.verified_purchase) === 'true')
  ).length
  
  const totalComplaints = reviews.filter(r => r.rating <= 2).length
  
  if (totalComplaints === 0) return 0
  
  return Math.round((highImpactComplaints / totalComplaints) * 1000) / 10
}

// Seeded random for consistent jitter
function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  const x = Math.sin(hash) * 10000
  return x - Math.floor(x)
}

// Calculate Category Scores with better spread for visualization
export function calculateCategoryScores(reviews: Review[]): CategoryScore[] {
  const categoryMap = new Map<string, Review[]>()
  
  reviews.forEach(review => {
    const category = review.competitor_category
    if (!categoryMap.has(category)) {
      categoryMap.set(category, [])
    }
    categoryMap.get(category)!.push(review)
  })
  
  const rawScores: Array<{
    category: string
    rawOpportunity: number
    rawDissatisfaction: number
    rawSaturation: number
    complaints: number
    avgRating: number
    trendGrowth: number
  }> = []
  
  categoryMap.forEach((categoryReviews, category) => {
    const complaints = categoryReviews.filter(r => r.rating <= 2)
    const avgRating = categoryReviews.reduce((sum, r) => sum + r.rating, 0) / categoryReviews.length
    
    // Raw Opportunity Score components
    const complaintFreq = complaints.length / categoryReviews.length
    const avgHelpfulOnComplaints = complaints.length > 0 
      ? complaints.reduce((sum, r) => sum + (Number(r.helpful_votes) || 0), 0) / complaints.length 
      : 0
    const verifiedComplaintRatio = complaints.length > 0
      ? complaints.filter(r => r.verified_purchase === 1 || r.verified_purchase === true || String(r.verified_purchase) === '1' || String(r.verified_purchase) === 'true').length / complaints.length
      : 0
    
    const rawOpportunity = 
      (complaintFreq * 3.5) + 
      (avgHelpfulOnComplaints / 10) * 2.5 + 
      (verifiedComplaintRatio * 2) + 
      ((5 - avgRating) / 5) * 2
    
    // Raw Dissatisfaction Score
    const rawDissatisfaction = 
      ((5 - avgRating) / 5) * 4 +
      (complaintFreq * 4) +
      (avgHelpfulOnComplaints / 20) * 2
    
    // Raw Saturation Score - based on review volume and brand diversity
    const uniqueBrands = new Set(categoryReviews.map(r => r.competitor_brand)).size
    const rawSaturation = 
      (categoryReviews.length / reviews.length) * 5 +
      (uniqueBrands / 5) * 3
    
    // Trend Growth - month-over-month
    const trendGrowth = calculateTrendGrowth(categoryReviews)
    
    rawScores.push({
      category,
      rawOpportunity,
      rawDissatisfaction,
      rawSaturation,
      complaints: complaints.length,
      avgRating,
      trendGrowth,
    })
  })
  
  // Normalize scores to spread them across 1-9 range (leaving margins)
  const oppMin = Math.min(...rawScores.map(s => s.rawOpportunity))
  const oppMax = Math.max(...rawScores.map(s => s.rawOpportunity))
  const disMin = Math.min(...rawScores.map(s => s.rawDissatisfaction))
  const disMax = Math.max(...rawScores.map(s => s.rawDissatisfaction))
  const satMin = Math.min(...rawScores.map(s => s.rawSaturation))
  const satMax = Math.max(...rawScores.map(s => s.rawSaturation))
  
  const normalize = (val: number, min: number, max: number, jitter: number): number => {
    if (max === min) return 5 + jitter
    // Spread from 1.5 to 8.5 for better visual distribution
    return 1.5 + ((val - min) / (max - min)) * 7 + jitter
  }
  
  const scores: CategoryScore[] = rawScores.map(raw => {
    // Use category name as seed for consistent jitter
    const jitterOpp = (seededRandom(raw.category + 'opp') - 0.5) * 1.2
    const jitterDis = (seededRandom(raw.category + 'dis') - 0.5) * 1.2
    const jitterSat = (seededRandom(raw.category + 'sat') - 0.5) * 1.2
    
    return {
      category: raw.category,
      opportunityScore: Math.round(Math.max(0.5, Math.min(9.5, normalize(raw.rawOpportunity, oppMin, oppMax, jitterOpp))) * 10) / 10,
      dissatisfactionScore: Math.round(Math.max(0.5, Math.min(9.5, normalize(raw.rawDissatisfaction, disMin, disMax, jitterDis))) * 10) / 10,
      saturationScore: Math.round(Math.max(0.5, Math.min(9.5, normalize(raw.rawSaturation, satMin, satMax, jitterSat))) * 10) / 10,
      complaintCount: raw.complaints,
      avgRating: Math.round(raw.avgRating * 100) / 100,
      trendGrowth: Math.round(raw.trendGrowth * 10) / 10,
    }
  })
  
  return scores.sort((a, b) => b.opportunityScore - a.opportunityScore)
}

function calculateTrendGrowth(reviews: Review[]): number {
  const sortedByDate = [...reviews].sort((a, b) => 
    new Date(a.review_date).getTime() - new Date(b.review_date).getTime()
  )
  
  if (sortedByDate.length < 10) return 0
  
  const midpoint = Math.floor(sortedByDate.length / 2)
  const firstHalf = sortedByDate.slice(0, midpoint)
  const secondHalf = sortedByDate.slice(midpoint)
  
  const firstHalfComplaints = firstHalf.filter(r => r.rating <= 2).length
  const secondHalfComplaints = secondHalf.filter(r => r.rating <= 2).length
  
  if (firstHalfComplaints === 0) return secondHalfComplaints > 0 ? 100 : 0
  
  return ((secondHalfComplaints - firstHalfComplaints) / firstHalfComplaints) * 100
}

// Calculate Brand Analysis
export function calculateBrandAnalysis(reviews: Review[]): BrandAnalysis[] {
  const brandMap = new Map<string, Review[]>()
  
  reviews.forEach(review => {
    const brand = review.competitor_brand
    if (!brandMap.has(brand)) {
      brandMap.set(brand, [])
    }
    brandMap.get(brand)!.push(review)
  })
  
  const analysis: BrandAnalysis[] = []
  
  brandMap.forEach((brandReviews, brand) => {
    const complaints = brandReviews.filter(r => r.rating <= 2)
    const avgRating = brandReviews.reduce((sum, r) => sum + r.rating, 0) / brandReviews.length
    const avgHelpfulVotes = brandReviews.reduce((sum, r) => sum + (Number(r.helpful_votes) || 0), 0) / brandReviews.length
    
    const dissatisfactionScore = Math.min(10,
      ((5 - avgRating) / 5) * 5 +
      (complaints.length / brandReviews.length) * 5
    )
    
    analysis.push({
      brand,
      avgRating: Math.round(avgRating * 100) / 100,
      complaintVolume: complaints.length,
      dissatisfactionScore: Math.round(dissatisfactionScore * 10) / 10,
      helpfulVotes: Math.round(avgHelpfulVotes),
      verifiedComplaints: complaints.filter(r => r.verified_purchase === 1 || r.verified_purchase === true || String(r.verified_purchase) === '1' || String(r.verified_purchase) === 'true').length,
    })
  })
  
  return analysis.sort((a, b) => b.complaintVolume - a.complaintVolume)
}

// Extract complaint themes using keyword analysis
export function extractComplaintThemes(reviews: Review[]): ComplaintTheme[] {
  const complaints = reviews.filter(r => r.rating <= 3)
  
  const themeKeywords: Record<string, string[]> = {
    'Trust & Transparency Issues': ['questionable', 'doubt', 'trust', 'fake', 'misleading', 'scam', 'genuine', 'authentic'],
    'Ingredient Concerns': ['ingredient', 'chemical', 'allergen', 'allergy', 'reaction', 'sensitive', 'natural', 'artificial'],
    'Personalization Needs': ['one size', 'doesn\'t fit', 'not for me', 'skin type', 'combination', 'personalize', 'customize'],
    'Side Effects': ['side effect', 'reaction', 'irritation', 'breakout', 'burning', 'rash', 'adverse', 'harm'],
    'Packaging Issues': ['packaging', 'plastic', 'sustainable', 'eco', 'waste', 'leak', 'broken', 'damaged'],
    'Dosage & Usage Confusion': ['dosage', 'how much', 'instructions', 'confusing', 'unclear', 'direction', 'routine'],
    'Efficacy Doubts': ['doesn\'t work', 'no result', 'ineffective', 'waste', 'disappointed', 'not working', 'useless'],
    'Price & Value': ['expensive', 'price', 'cost', 'value', 'overpriced', 'not worth', 'money'],
    'Product Quality': ['quality', 'cheap', 'poor', 'defective', 'expired', 'smell', 'texture'],
    'Customer Experience': ['service', 'delivery', 'return', 'refund', 'support', 'response', 'shipping'],
  }
  
  const themeCounts: Record<string, { count: number; keywords: Set<string> }> = {}
  
  Object.keys(themeKeywords).forEach(theme => {
    themeCounts[theme] = { count: 0, keywords: new Set() }
  })
  
  complaints.forEach(review => {
    const text = review.review_text.toLowerCase()
    
    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          themeCounts[theme].count++
          themeCounts[theme].keywords.add(keyword)
        }
      })
    })
  })
  
  const totalComplaints = complaints.length || 1
  
  return Object.entries(themeCounts)
    .filter(([_, data]) => data.count > 0)
    .map(([theme, data]) => ({
      theme,
      count: data.count,
      percentage: Math.round((data.count / totalComplaints) * 1000) / 10,
      keywords: Array.from(data.keywords).slice(0, 5),
      sentiment: 'negative' as const,
    }))
    .sort((a, b) => b.count - a.count)
}

// Get distribution data
export function getPlatformDistribution(reviews: Review[]) {
  const platformCounts = new Map<string, number>()
  
  reviews.forEach(review => {
    platformCounts.set(review.platform, (platformCounts.get(review.platform) || 0) + 1)
  })
  
  const total = reviews.length || 1
  
  return Array.from(platformCounts.entries())
    .map(([platform, count]) => ({
      name: platform,
      value: count,
      percentage: Math.round((count / total) * 10000) / 100,
    }))
    .sort((a, b) => b.value - a.value)
}

export function getBrandDistribution(reviews: Review[]) {
  const brandCounts = new Map<string, number>()
  
  reviews.forEach(review => {
    brandCounts.set(review.competitor_brand, (brandCounts.get(review.competitor_brand) || 0) + 1)
  })
  
  const total = reviews.length || 1
  
  return Array.from(brandCounts.entries())
    .map(([brand, count]) => ({
      name: brand,
      value: count,
      percentage: Math.round((count / total) * 10000) / 100,
    }))
    .sort((a, b) => b.value - a.value)
}

export function getRatingDistribution(reviews: Review[]) {
  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  
  reviews.forEach(review => {
    const rating = Math.round(review.rating)
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating]++
    }
  })
  
  const total = reviews.length || 1
  
  return [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} Star`,
    count: ratingCounts[rating],
    percentage: Math.round((ratingCounts[rating] / total) * 1000) / 10,
  }))
}

export function getCategoryComplaintVolume(reviews: Review[]) {
  const complaints = reviews.filter(r => r.rating <= 2)
  const categoryCounts = new Map<string, number>()
  
  complaints.forEach(review => {
    categoryCounts.set(review.competitor_category, (categoryCounts.get(review.competitor_category) || 0) + 1)
  })
  
  return Array.from(categoryCounts.entries())
    .map(([category, count]) => ({
      name: category,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
}

// Get trend data over time
export function getTrendData(reviews: Review[]) {
  const monthlyData = new Map<string, { reviews: number; complaints: number; avgRating: number; ratings: number[] }>()
  
  reviews.forEach(review => {
    const date = new Date(review.review_date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { reviews: 0, complaints: 0, avgRating: 0, ratings: [] })
    }
    
    const data = monthlyData.get(monthKey)!
    data.reviews++
    if (review.rating <= 2) data.complaints++
    data.ratings.push(review.rating)
  })
  
  return Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      reviews: data.reviews,
      complaints: data.complaints,
      avgRating: Math.round((data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length) * 100) / 100,
      complaintRate: Math.round((data.complaints / data.reviews) * 1000) / 10,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

// Generate sparkline data from reviews
export function generateSparklineData(reviews: Review[], metric: 'rating' | 'complaints' | 'helpful'): number[] {
  const sortedReviews = [...reviews].sort((a, b) => 
    new Date(a.review_date).getTime() - new Date(b.review_date).getTime()
  )
  
  const bucketSize = Math.max(1, Math.floor(sortedReviews.length / 12))
  const sparkline: number[] = []
  
  for (let i = 0; i < sortedReviews.length; i += bucketSize) {
    const bucket = sortedReviews.slice(i, i + bucketSize)
    
    if (metric === 'rating') {
      sparkline.push(bucket.reduce((sum, r) => sum + r.rating, 0) / bucket.length)
    } else if (metric === 'complaints') {
      sparkline.push(bucket.filter(r => r.rating <= 2).length)
    } else {
      sparkline.push(bucket.reduce((sum, r) => sum + r.helpful_votes, 0) / bucket.length)
    }
  }
  
  return sparkline.slice(0, 12)
}

// Find highest risk and potential categories
export function findHighestRiskCategory(scores: CategoryScore[]): string {
  if (scores.length === 0) return 'N/A'
  const sorted = [...scores].sort((a, b) => b.dissatisfactionScore - a.dissatisfactionScore)
  return sorted[0].category
}

export interface HighestPotentialInsight {
  category: string;
  score: number;
  insight: string;
}

export function findHighestPotentialCategory(scores: CategoryScore[]): HighestPotentialInsight {
  if (scores.length === 0) return { category: 'N/A', score: 0, insight: 'Insufficient data' };
  const sorted = [...scores].sort((a, b) => b.opportunityScore - a.opportunityScore);
  const top = sorted[0];
  
  return {
    category: top.category,
    score: Math.round(top.opportunityScore * 10), // Scale 10 to 100
    insight: 'Driven by elevated trust-deficit, personalization, and progress-tracking complaints.'
  };
}
