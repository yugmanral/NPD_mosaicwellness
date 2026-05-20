import { DashboardLayout } from '@/components/dashboard'
import { ExecutiveKPIs } from '@/components/dashboard'
import {
  PlatformDistributionChart,
  BrandDistributionChart,
  RatingDistributionChart,
  TrendAnalysisChart,
} from '@/components/charts'

export default function ExecutiveKPIsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Executive KPIs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            High-level performance indicators and strategic metrics
          </p>
        </div>

        <ExecutiveKPIs />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PlatformDistributionChart />
          <BrandDistributionChart />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RatingDistributionChart />
          <TrendAnalysisChart />
        </div>
      </div>
    </DashboardLayout>
  )
}
