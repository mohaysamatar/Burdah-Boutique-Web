import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import StatCard from '@/components/admin/StatCard'
import CategorySalesChart from '@/components/admin/CategorySalesChart'
import RevenueTrendChart from '@/components/admin/RevenueTrendChart'

export const dynamic = 'force-dynamic'

const CATEGORY_LABELS = {
  abayas: 'Abayas',
  scarves: 'Scarves',
  shoes: 'Shoes',
  perfumes: 'Perfumes',
  bags: 'Bags',
}

// Orders in these statuses count as real sales. Pending/cancelled/refunded don't.
const PAID_STATUSES = ['paid', 'shipped', 'delivered']

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export default async function AnalyticsPage() {
  await connectDB()

  const [revenueStats] = await Order.aggregate([
    { $match: { status: { $in: PAID_STATUSES } } },
    { $group: { _id: null, totalRevenue: { $sum: '$total' }, orderCount: { $sum: 1 } } },
  ])

  const [unitsStats] = await Order.aggregate([
    { $match: { status: { $in: PAID_STATUSES } } },
    { $unwind: '$items' },
    { $group: { _id: null, totalUnits: { $sum: '$items.quantity' } } },
  ])

  const categorySales = await Order.aggregate([
    { $match: { status: { $in: PAID_STATUSES } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: { $ifNull: ['$items.category', 'uncategorized'] },
        unitsSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
  ])

  const categoryMap = Object.fromEntries(categorySales.map((c) => [c._id, c]))
  const categoryChartData = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    label,
    unitsSold: categoryMap[key]?.unitsSold || 0,
    revenue: categoryMap[key]?.revenue || 0,
  }))

  const topProducts = await Order.aggregate([
    { $match: { status: { $in: PAID_STATUSES } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.name',
        unitsSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    { $sort: { unitsSold: -1 } },
    { $limit: 5 },
  ])

  const monthlyTrendRaw = await Order.aggregate([
    { $match: { status: { $in: PAID_STATUSES } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$total' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ])

  const revenueTrendData = monthlyTrendRaw.map((m) => ({
    label: `${MONTH_NAMES[m._id.month - 1]} ${m._id.year}`,
    revenue: m.revenue,
  }))

  const totalRevenue = revenueStats?.totalRevenue || 0
  const totalOrders = revenueStats?.orderCount || 0
  const totalUnits = unitsStats?.totalUnits || 0
  const hasSales = totalOrders > 0

  return (
    <div>
      <h1 className="font-display text-2xl italic text-navy">Analytics</h1>
      <p className="mt-1 text-sm text-navyText/60">Sales performance across the store.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total revenue" value={`KSh ${totalRevenue.toLocaleString()}`} />
        <StatCard label="Orders" value={totalOrders} />
        <StatCard label="Units sold" value={totalUnits} />
      </div>

      {!hasSales ? (
        <p className="mt-8 text-sm text-navyText/60">
          No paid orders yet. Once checkout is wired up and orders start coming in, revenue,
          units sold, and the category breakdown below will populate automatically.
        </p>
      ) : (
        <>
          <div className="mt-10">
            <h2 className="font-display text-lg italic text-navy">Units sold by category</h2>
            <div className="mt-4 border border-navy/10 bg-white p-4">
              <CategorySalesChart data={categoryChartData} />
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-lg italic text-navy">Revenue over time</h2>
            <div className="mt-4 border border-navy/10 bg-white p-4">
              <RevenueTrendChart data={revenueTrendData} />
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-lg italic text-navy">Top products</h2>
            <table className="mt-4 w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-navy/10 text-navyText/50">
                  <th className="py-3 font-normal">Product</th>
                  <th className="py-3 font-normal">Units sold</th>
                  <th className="py-3 font-normal">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p._id} className="border-b border-navy/5">
                    <td className="py-3 text-navyText">{p._id}</td>
                    <td className="py-3 text-navyText/70">{p.unitsSold}</td>
                    <td className="py-3 text-navyText/70">KSh {p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
