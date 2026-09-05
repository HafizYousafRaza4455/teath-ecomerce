import { useEffect, useState } from 'react'
import { admin } from '../../api'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    admin.getOrders(filter).then((r) => setOrders(r.data.results || r.data)).catch(() => {})
  }, [filter])

  const changeStatus = async (id, status) => {
    await admin.updateOrderStatus(id, status)
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-gray-200 rounded-full px-4 py-2 text-sm bg-white">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="space-y-3">
        {orders.length === 0 && <div className="text-center py-16 text-gray-400 text-sm">No orders found.</div>}
        {orders.map((o) => (
          <div key={o.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="p-5 flex flex-wrap items-center gap-4 justify-between">
              <div>
                <div className="font-bold text-gray-900">#{o.id} <span className="text-sm font-normal text-gray-400">· {o.user_email}</span></div>
                <div className="text-xs text-gray-400">{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${o.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {o.payment_status}
              </span>
              <div className="font-bold">${Number(o.total).toFixed(2)}</div>
              <select
                value={o.status}
                onChange={(e) => changeStatus(o.id, e.target.value)}
                className="border border-gray-200 rounded-full px-3 py-1.5 text-xs font-semibold bg-white"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
              <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="text-xs text-brand-600 font-semibold hover:underline">
                {expanded === o.id ? 'Hide' : 'Details'}
              </button>
            </div>
            {expanded === o.id && (
              <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 text-sm">
                {o.items.map((i) => (
                  <div key={i.id} className="flex justify-between py-1">
                    <span className="text-gray-600">{i.product_name} × {i.quantity} @ ${Number(i.price).toFixed(2)}</span>
                    <span className="font-medium">${Number(i.total_price).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-green-600 pt-2 border-t border-gray-200 mt-2">
                  <span>Discount {o.coupon_code ? `(${o.coupon_code})` : ''}</span><span>-${Number(o.discount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-1"><span>Total</span><span>${Number(o.total).toFixed(2)}</span></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
