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
        <div className="ml-64">
          <Header />
          <GlobalFilters />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </DataProvider>
  )
}
