import { DashboardLayout, ExecutiveKPIs } from '@/components/dashboard'
import {
  BrandDistributionChart,
  CompetitorAnalysisTable,
  RatingDistributionChart,
} from '@/components/charts'

export default function CompetitorIntelligencePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Competitor Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Deep-dive analysis of competitor brands and market positioning
          </p>
        </div>

        <ExecutiveKPIs />

        <CompetitorAnalysisTable />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BrandDistributionChart />
          <RatingDistributionChart />
        </div>
      </div>
    </DashboardLayout>
  )
}
