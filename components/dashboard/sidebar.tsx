'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Target,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Grid3X3,
} from 'lucide-react'

const navigation = [
  { name: 'Executive KPIs', href: '/', icon: LayoutDashboard },
  { name: 'Competitor Intelligence', href: '/competitor-intelligence', icon: Target },
  { name: 'Category Opportunity', href: '/category-opportunity', icon: BarChart3 },
  { name: 'Ratings & Sentiment', href: '/ratings-sentiment', icon: TrendingUp },
  { name: 'Review Intelligence', href: '/review-intelligence', icon: MessageSquare },
  { name: 'Strategic Matrices', href: '/strategic-matrices', icon: Grid3X3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">X</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Consumer Intel</h1>
            <p className="text-xs text-muted-foreground">Executive Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-accent"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground">
            Powered by Consumer Intelligence
          </p>
        </div>
      </div>
    </aside>
  )
}
