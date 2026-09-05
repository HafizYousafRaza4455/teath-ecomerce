import { useEffect, useState } from 'react'
import { admin } from '../../api'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    admin.getCustomers().then((r) => setCustomers(r.data.results || r.data)).catch(() => {})
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customers</h1>
      <div className="bg-white border border-gray-100 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs text-gray-400 uppercase">
            <tr>
              <th className="px-4 py-3">Customer</th><th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Orders</th><th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{c.first_name} {c.last_name}</td>
                <td className="px-4 py-3 text-gray-500">{c.email}</td>
                <td className="px-4 py-3"><span className="bg-brand-50 text-brand-700 font-bold px-2.5 py-1 rounded-full text-xs">{c.order_count}</span></td>
                <td className="px-4 py-3 text-gray-400">{new Date(c.date_joined).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">No customers yet.</div>}
      </div>
    </div>
  )
}
