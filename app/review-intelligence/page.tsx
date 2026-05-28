import { DashboardLayout, ExecutiveKPIs } from '@/components/dashboard'
import { ComplaintThemesAnalysis, TrendAnalysisChart } from '@/components/charts'
import { SyncProductFilter } from '@/components/dashboard/sync-product-filter'

export default function ReviewIntelligencePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const product = typeof searchParams?.product === 'string' ? searchParams.product : undefined;

  return (
    <DashboardLayout>
      <SyncProductFilter product={product} />
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
