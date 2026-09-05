import { useEffect, useState } from 'react'
import { admin } from '../../api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    admin.getDashboard().then((r) => setStats(r.data)).catch(() => {})
  }, [])

  if (!stats) return <div className="p-8"><div className="h-64 bg-gray-100 rounded-3xl animate-pulse" /></div>

  const cards = [
    ['💰', 'Total Revenue', `$${Number(stats.total_revenue || 0).toFixed(2)}`, 'from-green-500 to-emerald-500'],
    ['📦', 'Total Orders', stats.total_orders, 'from-blue-500 to-sky-500'],
    ['⏳', 'Pending Orders', stats.pending_orders, 'from-amber-400 to-orange-500'],
    ['👥', 'Customers', stats.total_customers, 'from-violet-500 to-purple-500'],
    ['🧴', 'Products', stats.total_products, 'from-brand-500 to-teal-500'],
    ['⚠️', 'Low Stock', stats.low_stock_products, 'from-red-400 to-rose-500'],
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">Dashboard Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {cards.map(([emoji, label, value, grad], i) => (
          <div key={label} className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-lg transition-shadow animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-br ${grad} shadow-lg`}>{emoji}</div>
            <div className="font-display text-3xl font-extrabold text-gray-900 mt-4">{value}</div>
            <div className="text-xs text-gray-400 font-semibold mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-bold text-gray-900">Recent Orders</h2>
      </div>
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
        {stats.recent_orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No orders yet — they'll appear here as customers buy.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 text-left text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              <tr><th className="px-6 py-4">Order</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Date</th></tr>
            </thead>
            <tbody>
              {stats.recent_orders.map((o) => (
                <tr key={o.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-display font-bold">#{o.id}</td>
                  <td className="px-6 py-4 text-gray-500">{o.user_email}</td>
                  <td className="px-6 py-4 font-bold">${Number(o.total).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-full ${o.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
