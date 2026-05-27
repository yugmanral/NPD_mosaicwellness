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
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Executive KPIs</h1>
            <p className="text-sm text-muted-foreground mt-1">
              High-level performance indicators and strategic metrics
            </p>
          </div>
          
          {/* Executive Strategic Insight Banner */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-sm">
            <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Strategic Insight</h2>
            <p className="text-lg font-medium leading-relaxed">
              &ldquo;Customers are not simply dissatisfied with products — they are dissatisfied with the lack of guidance, transparency, and measurable outcomes.&rdquo;
            </p>
          </div>
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
