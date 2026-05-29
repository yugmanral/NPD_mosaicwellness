import { DashboardLayout, ExecutiveKPIs } from '@/components/dashboard'
import { ComplaintThemesAnalysis, TrendAnalysisChart } from '@/components/charts'
import { SyncProductFilter } from '@/components/dashboard/sync-product-filter'
import { ProductSearch } from '@/components/dashboard/product-search'

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Customer Review Intelligence</h1>
            <p className="text-sm text-muted-foreground mt-1">
              AI-powered analysis of customer feedback themes and patterns
            </p>
          </div>
          <ProductSearch />
        </div>

        <ExecutiveKPIs />

        <ComplaintThemesAnalysis />

        <TrendAnalysisChart />
      </div>
    </DashboardLayout>
  )
}
