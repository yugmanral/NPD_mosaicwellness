import type { Review, ReviewsResponse } from './types'
const API_BASE = 'https://mosaicfellowship.in/api/data/npd/reviews'

export async function fetchAllReviews(): Promise<Review[]> {
  // Fetch the first page to get pagination info
  const firstResponse = await fetch(`${API_BASE}?page=1&limit=100`)
  if (!firstResponse.ok) {
    throw new Error(`Failed to fetch reviews: ${firstResponse.statusText}`)
  }
  
  const firstData = await firstResponse.json()
  const totalPages = firstData.pagination.total_pages || 1
  const allReviews: Review[] = [...firstData.data]
  
  // Fetch remaining pages in batches of 5 to avoid connection limits and rate limiting
  if (totalPages > 1) {
    const BATCH_SIZE = 5;
    const fetchPage = async (page: number) => {
      const res = await fetch(`${API_BASE}?page=${page}&limit=100`);
      if (!res.ok) throw new Error(`Failed to fetch page ${page}`);
      const data = await res.json();
      return data.data;
    };

    for (let i = 2; i <= totalPages; i += BATCH_SIZE) {
      const batchPromises = [];
      for (let j = 0; j < BATCH_SIZE && i + j <= totalPages; j++) {
        batchPromises.push(fetchPage(i + j));
      }
      
      try {
        const batchResults = await Promise.all(batchPromises);
        for (const pageData of batchResults) {
          allReviews.push(...pageData);
        }
      } catch (err) {
        console.error("Error fetching a batch of reviews", err);
        // Continue even if a batch fails, to at least have partial data,
        // or we could throw here. We will throw to ensure it is retried if completely failed.
        throw err;
      }
    }
  }

  return allReviews
}

export async function fetchReviewsPage(page: number = 1, limit: number = 100): Promise<ReviewsResponse> {
  const response = await fetch(`${API_BASE}?page=${page}&limit=${limit}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch reviews: ${response.statusText}`)
  }
  return response.json()
}
