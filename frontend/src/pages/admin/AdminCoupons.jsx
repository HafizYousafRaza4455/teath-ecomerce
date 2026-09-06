import { useState } from 'react'

const INITIAL_COUPONS = [
  { id: 1, code: 'SPARKLE10', discount_percent: 10, is_active: true, max_uses: 500, uses_count: 142, created_at: '2026-01-01' },
  { id: 2, code: 'WELCOME15', discount_percent: 15, is_active: true, max_uses: 200, uses_count: 89, created_at: '2026-02-15' },
  { id: 3, code: 'WHITEN20', discount_percent: 20, is_active: false, max_uses: 100, uses_count: 100, created_at: '2025-11-20' },
  { id: 4, code: 'VIP25', discount_percent: 25, is_active: true, max_uses: 50, uses_count: 18, created_at: '2026-03-01' },
]

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ code: '', discount_percent: 10, max_uses: 100, is_active: true })

  const handleCreate = (e) => {
    e.preventDefault()
    const newCoupon = {
      id: Date.now(),
      code: form.code.toUpperCase().trim(),
      discount_percent: Number(form.discount_percent),
      max_uses: Number(form.max_uses),
      uses_count: 0,
      is_active: form.is_active,
      created_at: new Date().toISOString().split('T')[0],
    }
    setCoupons([newCoupon, ...coupons])
    setShowModal(false)
    setForm({ code: '', discount_percent: 10, max_uses: 100, is_active: true })
  }

  const toggleStatus = (id) => {
    setCoupons(coupons.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c)))
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this coupon?')) return
    setCoupons(coupons.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Promotional Coupons
          </h1>
          <p className="text-gray-500 text-sm mt-1">Create discount codes to boost customer conversion and campaign sales.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-brand-700 transition shadow-lg shadow-brand-200"
        >
          <span>+</span> Create New Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/70 text-left text-[11px] text-gray-400 font-extrabold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Coupon Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Redemptions</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-extrabold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
                      {c.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs border border-emerald-200">
                      {c.discount_percent}% OFF
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-700">
                      {c.uses_count} <span className="text-gray-400 text-xs">/ {c.max_uses} used</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(c.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition ${
                        c.is_active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${c.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      {c.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 font-medium">{c.created_at}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-500 hover:text-red-600 font-bold text-xs px-3 py-1 rounded-lg hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-7 shadow-2xl animate-pop-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h2 className="font-display font-extrabold text-xl text-gray-900">Create Coupon</h2>
                <p className="text-xs text-gray-400">Configure promotional discount settings.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Coupon Code *</label>
                <input
                  required
                  placeholder="e.g. SUMMER20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full uppercase font-mono border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Discount % *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="100"
                    value={form.discount_percent}
                    onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Max Redemptions *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.max_uses}
                    onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 accent-brand-600 rounded"
                  />
                  Activate Immediately
                </label>
              </div>

              <div className="flex gap-3 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 rounded-full py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-600 text-white rounded-full py-3 text-sm font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-200"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
