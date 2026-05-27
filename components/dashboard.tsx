"use client"

import React from 'react'
import { Activity, BarChart, Home, Settings, ShoppingBag, Users, Bell, Search } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background/50">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border/40 bg-background/80 backdrop-blur-xl sm:flex">
        <div className="flex h-16 items-center border-b border-border/40 px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-lg tracking-tight">Mosaic Wellness</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-6">
          <nav className="grid items-start px-4 text-sm font-medium space-y-1">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-md bg-primary/10 px-3 py-2 text-primary transition-all hover:bg-primary/15"
            >
              <Home className="h-4 w-4" />
              Executive KPIs
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <ShoppingBag className="h-4 w-4" />
              Products
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <BarChart className="h-4 w-4" />
              Analytics
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              Customers
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t border-border/40">
          <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-all">
            <Settings className="h-4 w-4" />
            Workspace Settings
          </div>
        </div>
      </aside>

      <div className="flex flex-col sm:pl-64 w-full flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/60 backdrop-blur-xl px-4 sm:px-8">
          <div className="w-full flex-1 flex items-center gap-4">
            <div className="relative hidden md:flex items-center w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search metrics or products..."
                className="w-full rounded-full border border-border/50 bg-muted/30 pl-9 py-2 text-sm outline-none focus:border-primary/50 focus:bg-background transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary border-2 border-background"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-all">
              <span className="text-xs font-medium text-white">YM</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

const kpis = [
  { title: 'Total Revenue (YTD)', value: '₹45.2M', change: '+20.1% from last month', icon: '₹', color: 'text-primary' },
  { title: 'Active Products', value: '+2350', change: '+180 new this quarter', icon: <ShoppingBag className="h-4 w-4" />, color: 'text-blue-500' },
  { title: 'Customer Retention', value: '78.4%', change: '+4% from last quarter', icon: <Users className="h-4 w-4" />, color: 'text-emerald-500' },
  { title: 'Avg. Rating', value: '4.8', change: 'Based on 12k+ reviews', icon: <Activity className="h-4 w-4" />, color: 'text-orange-500' },
]

export function ExecutiveKPIs() {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
      {kpis.map((kpi, idx) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all hover:shadow-md hover:border-border"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center justify-between pb-4">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{kpi.title}</h3>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-background shadow-sm border border-border/50 ${kpi.color}`}>
              {typeof kpi.icon === 'string' ? <span className="text-lg font-semibold">{kpi.icon}</span> : kpi.icon}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-foreground">{kpi.value}</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">{kpi.change}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
