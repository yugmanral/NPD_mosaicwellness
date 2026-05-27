import { DashboardLayout, ExecutiveKPIs } from '@/components/dashboard'
import { OpportunityDissatisfactionMatrix, CategoryMaturityMatrix } from '@/components/charts'

export default function StrategicMatricesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Strategic Opportunity Matrices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Executive quadrant analysis for strategic decision-making
          </p>
        </div>

        <ExecutiveKPIs />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <OpportunityDissatisfactionMatrix />
          <CategoryMaturityMatrix />
        </div>
      </div>
    </DashboardLayout>
  )
}
