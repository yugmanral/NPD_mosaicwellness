import type { Review, ReviewsResponse } from './types'
import rawData from './data.json'

// Load and correctly format the raw JSON data
const allReviews = rawData as unknown as Review[]

export async function fetchAllReviews(): Promise<Review[]> {
  // Simulate network delay to maintain realistic UX
  await new Promise(resolve => setTimeout(resolve, 500))
  return allReviews
}

export async function fetchReviewsPage(page: number = 1, limit: number = 100): Promise<ReviewsResponse> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = allReviews.slice(startIndex, endIndex)
  
  return {
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(allReviews.length / limit),
      totalRecords: allReviews.length,
      hasNextPage: endIndex < allReviews.length,
      hasPrevPage: page > 1
    }
  }
}
