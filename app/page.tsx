import React from 'react';
import { Activity, ArrowRight, HeartPulse, Stethoscope, Users } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center py-6">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Mosaic Wellness</h1>
        </div>
        <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
          <a href="#" className="text-foreground transition-colors hover:text-primary">Dashboard</a>
          <a href="#" className="transition-colors hover:text-primary">Products</a>
          <a href="#" className="transition-colors hover:text-primary">Analytics</a>
          <a href="#" className="transition-colors hover:text-primary">Settings</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-6xl mt-24 flex flex-col items-start gap-6">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
          <Activity className="mr-2 h-4 w-4" />
          New Product Development v2.0 Live
        </div>
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter max-w-3xl leading-tight">
          Innovating healthcare <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            one product at a time.
          </span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mt-4">
          The central hub for tracking, managing, and launching new health and wellness products for Bodywise and Man Matters.
        </p>
        <div className="flex gap-4 mt-8">
          <button className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            Launch NPD Dashboard
          </button>
          <button className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            View Analytics <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Stats/Cards Section */}
      <section className="w-full max-w-6xl mt-32 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active NPDs</h3>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">24</div>
          <p className="text-xs text-muted-foreground mt-1">+4 from last month</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Products Launched</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">128</div>
          <p className="text-xs text-muted-foreground mt-1">+12% year over year</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">User Feedback Score</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">4.8/5.0</div>
          <p className="text-xs text-muted-foreground mt-1">Based on 12k reviews</p>
        </div>
      </section>
    </main>
  );
}
