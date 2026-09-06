import { useEffect, useState } from 'react'
import { admin } from '../../api'

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  paid: { label: 'Paid', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  shipped: { label: 'Shipped', bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  delivered: { label: 'Delivered', bg: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    admin.getOrders(filter)
      .then((r) => setOrders(r.data.results || r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filter])

  const changeStatus = async (id, status) => {
    await admin.updateOrderStatus(id, status)
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const filtered = orders.filter((o) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return String(o.id).includes(q) || (o.user_email && o.user_email.toLowerCase().includes(q))
  })

  const tabs = [
    { key: '', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'paid', label: 'Paid' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ]

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Customer Orders
          </h1>
          <p className="text-gray-500 text-sm mt-1">Review orders, update shipping progress, and inspect line items.</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {tabs.map(({ key, label }) => {
            const active = filter === key
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-gray-950 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <div className="w-full md:w-72 relative">
          <input
            type="search"
            placeholder="Search by order # or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-xs outline-none focus:border-brand-500 shadow-sm"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-white border border-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="font-display font-bold text-gray-900 text-base">No orders found</h3>
            <p className="text-gray-400 text-xs mt-1">Try selecting a different status filter or clearing your search.</p>
          </div>
        ) : (
          filtered.map((o) => {
            const isExp = expanded === o.id
            const st = STATUS_CONFIG[o.status] || STATUS_CONFIG.pending
            return (
              <div
                key={o.id}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Order ID & Customer */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center font-display font-black text-gray-900 text-sm">
                      #{o.id}
                    </div>
                    <div>
                      <div className="font-display font-bold text-gray-900 text-base flex items-center gap-2">
                        {o.user_email}
                        {o.coupon_code && (
                          <span className="text-[10px] font-extrabold bg-accent-50 text-accent-600 px-2 py-0.5 rounded-full border border-accent-200">
                            {o.coupon_code}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(o.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex flex-wrap items-center gap-4 justify-between md:justify-end">
                    {/* Payment Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border ${
                        o.payment_status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${o.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {o.payment_status}
                    </span>

                    {/* Order Total */}
                    <div className="font-display font-black text-gray-900 text-lg">
                      ${Number(o.total).toFixed(2)}
                    </div>

                    {/* Status Changer */}
                    <select
                      value={o.status}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                      className="border border-gray-200 bg-gray-50 rounded-full px-3.5 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>

                    <button
                      onClick={() => setExpanded(isExp ? null : o.id)}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3.5 py-1.5 rounded-full transition"
                    >
                      {isExp ? 'Hide Details' : 'View Details →'}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExp && (
                  <div className="border-t border-gray-100 bg-gray-50/70 p-6 space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Order Items</h4>
                    <div className="space-y-2 bg-white rounded-2xl p-4 border border-gray-100">
                      {o.items?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                          <span className="font-semibold text-gray-800">
                            {item.product_name} <strong className="text-gray-400 text-xs">× {item.quantity}</strong>
                          </span>
                          <span className="font-bold text-gray-900">${Number(item.total_price).toFixed(2)}</span>
                        </div>
                      ))}
                      {o.discount > 0 && (
                        <div className="flex justify-between text-xs font-bold text-emerald-600 pt-2">
                          <span>Discount Applied:</span>
                          <span>-${Number(o.discount).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                        <span>Grand Total:</span>
                        <span>${Number(o.total).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
