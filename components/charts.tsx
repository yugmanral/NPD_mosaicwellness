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
  Legend
} from 'recharts'

const platformData = [
  { name: 'App', value: 400, color: 'hsl(var(--primary))' },
  { name: 'Web', value: 300, color: 'hsl(var(--primary) / 0.8)' },
  { name: 'Retail', value: 200, color: 'hsl(var(--primary) / 0.5)' },
  { name: 'Other', value: 100, color: 'hsl(var(--primary) / 0.2)' },
]

export function PlatformDistributionChart() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="font-semibold text-lg tracking-tight mb-4">Platform Distribution</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={platformData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {platformData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const brandData = [
  { name: 'Bodywise', revenue: 4000, products: 2400 },
  { name: 'Man Matters', revenue: 3000, products: 1398 },
  { name: 'Little Joy', revenue: 2000, products: 9800 },
]

export function BrandDistributionChart() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="font-semibold text-lg tracking-tight mb-4">Brand Performance</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={brandData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="products" fill="hsl(var(--primary) / 0.4)" radius={[4, 4, 0, 0]} />
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
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="font-semibold text-lg tracking-tight mb-4">Rating Distribution</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ratingData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis dataKey="rating" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const trendData = [
  { month: 'Jan', users: 4000, sales: 2400 },
  { month: 'Feb', users: 3000, sales: 1398 },
  { month: 'Mar', users: 2000, sales: 9800 },
  { month: 'Apr', users: 2780, sales: 3908 },
  { month: 'May', users: 1890, sales: 4800 },
  { month: 'Jun', users: 2390, sales: 3800 },
  { month: 'Jul', users: 3490, sales: 4300 },
]

export function TrendAnalysisChart() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="font-semibold text-lg tracking-tight mb-4">Growth Trend Analysis</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 4, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="hsl(var(--primary) / 0.5)"
              strokeWidth={3}
              dot={{ r: 4, fill: 'hsl(var(--primary) / 0.5)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
