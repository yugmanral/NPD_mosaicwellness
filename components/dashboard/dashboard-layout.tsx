'use client'

import React from 'react'
import { DataProvider } from '@/context/data-context'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { GlobalFilters } from './global-filters'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <DataProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="ml-64 flex flex-col">
          <Header />
          <GlobalFilters />
          <main className="flex-1 p-6">
            {/* Executive Strategic Insight Banner */}
            <div className="mb-6 relative overflow-hidden rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 shadow-sm backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-500/20 p-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-foreground tracking-tight">Executive Strategic Insight</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    <strong className="text-foreground font-medium">Market Gap Identified:</strong> Customers are not simply dissatisfied with products — they are dissatisfied with the lack of guidance, transparency, and measurable outcomes. Trust-related deficits present the highest whitespace opportunity across all analyzed categories.
                  </p>
                </div>
              </div>
            </div>
            
            {children}
          </main>
        </div>
      </div>
    </DataProvider>
  )
}
