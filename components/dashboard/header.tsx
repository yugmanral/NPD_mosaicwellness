'use client'

import React from 'react'
import { useData } from '@/context/data-context'
import { Spinner } from '@/components/ui/spinner'

export function Header() {
  const { filteredReviews, reviews, isLoading } = useData()

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Consumer Intelligence Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Strategic insights from customer reviews
          </p>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="h-4 w-4" />
              <span>Loading data...</span>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex flex-col items-end">
                <span className="font-medium text-foreground">
                  {filteredReviews.length.toLocaleString()} reviews
                </span>
                {filteredReviews.length !== reviews.length && (
                  <span className="text-xs text-muted-foreground">
                    of {reviews.length.toLocaleString()} total
                  </span>
                )}
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-xs font-medium">X</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
