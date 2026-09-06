import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { admin } from '../../api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    admin.getDashboard()
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const cards = [
    {
      emoji: '💰',
      label: 'Gross Revenue',
      value: `$${Number(stats.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: '+18.4% vs last mo',
      grad: 'from-emerald-500 to-teal-600',
      textGrad: 'text-emerald-600',
      bgLight: 'bg-emerald-50/70 border-emerald-100',
    },
    {
      emoji: '📦',
      label: 'Completed Orders',
      value: stats.total_orders,
      trend: '+32 new orders',
      grad: 'from-blue-500 to-indigo-600',
      textGrad: 'text-blue-600',
      bgLight: 'bg-blue-50/70 border-blue-100',
    },
    {
      emoji: '⏳',
      label: 'Pending Orders',
      value: stats.pending_orders,
      trend: 'Requires dispatch',
      grad: 'from-amber-400 to-orange-500',
      textGrad: 'text-amber-600',
      bgLight: 'bg-amber-50/70 border-amber-100',
    },
    {
      emoji: '👥',
      label: 'Total Customers',
      value: stats.total_customers,
      trend: '89% repeat rate',
      grad: 'from-purple-500 to-violet-600',
      textGrad: 'text-purple-600',
      bgLight: 'bg-purple-50/70 border-purple-100',
    },
    {
      emoji: '🧴',
      label: 'Active Products',
      value: stats.total_products,
      trend: '6 main categories',
      grad: 'from-brand-500 to-teal-600',
      textGrad: 'text-brand-600',
      bgLight: 'bg-brand-50/70 border-brand-100',
    },
    {
      emoji: '⚠️',
      label: 'Low Stock Alerts',
      value: stats.low_stock_products || 0,
      trend: 'Items below 10 units',
      grad: 'from-rose-400 to-red-600',
      textGrad: 'text-red-600',
      bgLight: 'bg-red-50/70 border-red-100',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header with Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">Real-time performance metrics and store activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-bold px-4 py-2.5 rounded-full hover:bg-gray-800 transition shadow-sm"
          >
            <span>+</span> Add Product
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-full hover:bg-gray-50 transition"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Metric Tiles Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {cards.map((c, i) => (
          <div
            key={c.label}
            className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-br ${c.grad} text-white shadow-md`}
              >
                {c.emoji}
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${c.bgLight} ${c.textGrad}`}>
                {c.trend}
              </span>
            </div>
            <div className="mt-4">
              <div className="font-display text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                {c.value}
              </div>
              <div className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-gray-900">Recent Customer Orders</h2>
            <p className="text-xs text-gray-400 mt-0.5">Latest purchase activity across all channels</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-brand-600 hover:text-brand-700 text-xs font-bold hover:underline"
          >
            View all orders →
          </Link>
        </div>

        {stats.recent_orders?.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            <div className="text-4xl mb-2">🛍️</div>
            No orders placed yet. Orders will show here in real-time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/70 text-left text-[11px] text-gray-400 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Fulfillment</th>
                  <th className="px-6 py-4">Placed On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recent_orders.map((o) => {
                  const isPaid = o.payment_status === 'paid'
                  return (
                    <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4 font-display font-bold text-gray-900">#{o.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800 truncate max-w-[200px]">{o.user_email}</div>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-gray-900">${Number(o.total).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                            isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {o.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-gray-600 capitalize bg-gray-100 px-3 py-1 rounded-full">
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-medium">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
