import { useEffect, useState } from 'react'
import { admin } from '../../api'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    admin.getCustomers()
      .then((r) => setCustomers(r.data.results || r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    const name = `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase()
    return name.includes(q) || (c.email && c.email.toLowerCase().includes(q))
  })

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Customer Directory
          </h1>
          <p className="text-gray-500 text-sm mt-1">Review accounts, purchase frequencies, and loyalty records.</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="search"
            placeholder="Search by customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-brand-500"
          />
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">
          {filtered.length} Registered Accounts
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-sm">
            <div className="text-4xl mb-2">👥</div>
            No customers match your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/70 text-left text-[11px] text-gray-400 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Orders Placed</th>
                  <th className="px-6 py-4">Total Spend</th>
                  <th className="px-6 py-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => {
                  const initial = (c.first_name ? c.first_name[0] : (c.email ? c.email[0] : 'U')).toUpperCase()
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-50 border border-brand-200 text-brand-700 font-bold flex items-center justify-center text-xs">
                            {initial}
                          </div>
                          <span className="font-display font-bold text-gray-900">
                            {c.first_name || c.last_name ? `${c.first_name || ''} ${c.last_name || ''}`.trim() : 'Customer'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{c.email}</td>
                      <td className="px-6 py-4">
                        <span className="bg-brand-50 text-brand-700 font-extrabold px-3 py-1 rounded-full text-xs border border-brand-100">
                          {c.order_count || 0} {c.order_count === 1 ? 'order' : 'orders'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-gray-900">
                        {c.total_spent || '$0.00'}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-medium">
                        {c.date_joined ? new Date(c.date_joined).toLocaleDateString() : 'Recent'}
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
