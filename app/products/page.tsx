import { DashboardLayout } from '@/components/dashboard'
import { ProductTable } from '@/components/dashboard/product-table'
import { ProductKPIs } from '@/components/dashboard/product-kpis'

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Detailed performance metrics and feedback analysis across all tracked products
          </p>
        </div>

        <ProductKPIs />

        <ProductTable />
      </div>
    </DashboardLayout>
  )
}
