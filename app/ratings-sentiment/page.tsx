import { DashboardLayout, ExecutiveKPIs } from '@/components/dashboard'
import {
  RatingDistributionChart,
  TrendAnalysisChart,
  PlatformDistributionChart,
} from '@/components/charts'

export default function RatingsSentimentPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ratings & Sentiment Trends</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track customer sentiment evolution and rating patterns over time
          </p>
        </div>

        <ExecutiveKPIs />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RatingDistributionChart />
          <PlatformDistributionChart />
        </div>

        <TrendAnalysisChart />
      </div>
    </DashboardLayout>
  )
}
