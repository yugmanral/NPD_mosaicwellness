import { DashboardLayout, ExecutiveKPIs } from '@/components/dashboard'
import { ComplaintThemesAnalysis, TrendAnalysisChart } from '@/components/charts'

export default function ReviewIntelligencePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customer Review Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered analysis of customer feedback themes and patterns
          </p>
        </div>

        <ExecutiveKPIs />

        <ComplaintThemesAnalysis />

        <TrendAnalysisChart />
      </div>
    </DashboardLayout>
  )
}
