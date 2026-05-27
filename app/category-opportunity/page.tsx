import { DashboardLayout, ExecutiveKPIs } from '@/components/dashboard'
import {
  CategoryTreemap,
  TrendAnalysisChart,
  OpportunityDissatisfactionMatrix,
} from '@/components/charts'

export default function CategoryOpportunityPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Category Opportunity Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Identify high-potential categories and whitespace opportunities
          </p>
        </div>

        <ExecutiveKPIs />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CategoryTreemap />
          <TrendAnalysisChart />
        </div>

        <OpportunityDissatisfactionMatrix />
      </div>
    </DashboardLayout>
  )
}
