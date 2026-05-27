"use client"

import React from 'react'
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
  Area,
  AreaChart
} from 'recharts'

const platformData = [
  { name: 'App', value: 400, color: 'hsl(var(--primary))' },
  { name: 'Web', value: 300, color: 'hsl(210, 100%, 65%)' },
  { name: 'Retail', value: 200, color: 'hsl(280, 80%, 70%)' },
  { name: 'Other', value: 100, color: 'hsl(320, 80%, 70%)' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/50 bg-background/90 backdrop-blur-md p-3 shadow-xl">
        {label && <p className="mb-1 text-sm font-medium text-foreground">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="font-medium text-foreground">{entry.value}</span>
            <span className="capitalize">{entry.name}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function PlatformDistributionChart() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <h3 className="font-semibold text-base tracking-tight mb-6">Platform Distribution</h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={platformData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={6}
              dataKey="value"
              stroke="none"
            >
              {platformData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const brandData = [
  { name: 'Bodywise', revenue: 4000, products: 2400 },
  { name: 'Man Matters', revenue: 3000, products: 1398 },
  { name: 'Little Joy', revenue: 2000, products: 3800 },
]

export function BrandDistributionChart() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <h3 className="font-semibold text-base tracking-tight mb-6">Brand Performance</h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={brandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={32} />
            <Bar dataKey="products" fill="hsl(210, 100%, 65%)" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const ratingData = [
  { rating: '5 Stars', count: 12000 },
  { rating: '4 Stars', count: 3000 },
  { rating: '3 Stars', count: 800 },
  { rating: '2 Stars', count: 200 },
  { rating: '1 Star', count: 100 },
]

export function RatingDistributionChart() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <h3 className="font-semibold text-base tracking-tight mb-6">Rating Distribution</h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ratingData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis dataKey="rating" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} />
            <Bar dataKey="count" fill="hsl(280, 80%, 70%)" radius={[0, 4, 4, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const trendData = [
  { month: 'Jan', users: 1000, sales: 2400 },
  { month: 'Feb', users: 2000, sales: 1398 },
  { month: 'Mar', users: 3500, sales: 4800 },
  { month: 'Apr', users: 4780, sales: 3908 },
  { month: 'May', users: 5890, sales: 4800 },
  { month: 'Jun', users: 7390, sales: 6800 },
  { month: 'Jul', users: 8490, sales: 8300 },
]

export function TrendAnalysisChart() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <h3 className="font-semibold text-base tracking-tight mb-6">Growth Trend Analysis</h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSales)"
              activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="hsl(210, 100%, 65%)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: 'hsl(210, 100%, 65%)', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
