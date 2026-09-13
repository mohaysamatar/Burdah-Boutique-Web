import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import StatCard from '@/components/admin/StatCard'

export default async function AdminDashboardPage() {
  await connectDB()

  const products = await Product.find({})

  const totalProducts = products.length
  const totalStock = products.reduce(
    (sum, p) => sum + p.variants.reduce((vSum, v) => vSum + v.stock, 0),
    0
  )
  const lowStockCount = products.reduce((count, p) => {
    const hasLowStock = p.variants.some((v) => v.stock <= v.lowStockThreshold)
    return hasLowStock ? count + 1 : count
  }, 0)

  return (
    <div>
      <h1 className="font-display text-2xl italic text-navy">Dashboard</h1>
      <p className="mt-1 text-sm text-navyText/60">A quick look at where things stand.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total products" value={totalProducts} />
        <StatCard label="Units in stock" value={totalStock} />
        <StatCard
          label="Products low on stock"
          value={lowStockCount}
          tone={lowStockCount > 0 ? 'danger' : 'success'}
        />
      </div>

      {totalProducts === 0 && (
        <p className="mt-8 text-sm text-navyText/60">
          No products yet.{' '}
          <a href="/admin/products/new" className="text-gold hover:underline">
            Add your first product
          </a>{' '}
          to get started.
        </p>
      )}
    </div>
  )
}
