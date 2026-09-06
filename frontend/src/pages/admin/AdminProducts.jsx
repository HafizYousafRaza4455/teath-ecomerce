import { useEffect, useState } from 'react'
import { admin } from '../../api'
import { getProductImage } from '../../utils/productImages'

const EMPTY = {
  name: '',
  description: '',
  price: '',
  discount_price: '',
  stock: 50,
  category: '',
  is_active: true,
  is_featured: false,
  image: '',
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [stockFilter, setStockFilter] = useState('all')

  useEffect(() => {
    admin.getProducts().then((r) => setProducts(r.data.results || r.data)).catch(() => {})
    admin.getCategories().then((r) => setCategories(r.data.results || r.data)).catch(() => {})
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY, category: categories[0]?.id || '' })
    setShowForm(true)
    setError('')
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      discount_price: p.discount_price || '',
      stock: p.stock,
      category: p.category,
      is_active: p.is_active,
      is_featured: p.is_featured,
      image: p.image || '',
    })
    setShowForm(true)
    setError('')
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) {
        await admin.updateProduct(editing.id, form)
      } else {
        await admin.createProduct(form)
      }
      setShowForm(false)
      const res = await admin.getProducts()
      setProducts(res.data.results || res.data)
    } catch (err) {
      setError(Object.values(err.response?.data || {}).flat()[0] || 'Could not save product.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    await admin.deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  // Filter products by search, category, and stock
  const filtered = products.filter((p) => {
    const matchSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(search.toLowerCase()))
    const matchCat = !selectedCat || String(p.category) === String(selectedCat) || p.category_slug === selectedCat
    const matchStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && p.stock < 20) ||
      (stockFilter === 'out' && p.stock <= 0) ||
      (stockFilter === 'in' && p.stock > 0)
    return matchSearch && matchCat && matchStock
  })

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage pricing, stock levels, and merchandise details.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-brand-700 transition shadow-lg shadow-brand-200"
        >
          <span>+</span> Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-brand-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-brand-500"
          >
            <option value="">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-brand-500"
          >
            <option value="all">All Inventory</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock (&lt;20)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-gray-400">
          <span>SHOWING {filtered.length} OF {products.length} PRODUCTS</span>
          {search && (
            <button onClick={() => setSearch('')} className="text-brand-600 hover:underline">
              Clear filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/70 text-left text-[11px] text-gray-400 font-extrabold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => {
                const onSale = p.discount_price !== null && p.discount_price !== undefined
                const isLow = p.stock > 0 && p.stock < 20
                const isOut = p.stock <= 0
                return (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={getProductImage(p)}
                          alt={p.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-gray-100 shrink-0 bg-gray-50"
                        />
                        <div className="min-w-0">
                          <div className="font-display font-bold text-gray-900 leading-snug truncate max-w-xs">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-gray-400 truncate max-w-xs">
                            {p.slug || p.name.toLowerCase().replace(/\s+/g, '-')}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                        {p.category_name || 'General'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-extrabold text-gray-900">
                        ${Number(p.effective_price || p.price).toFixed(2)}
                      </div>
                      {onSale && (
                        <span className="text-xs text-gray-400 line-through">
                          ${Number(p.price).toFixed(2)}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                          isOut
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : isLow
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        {p.stock} units
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${p.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        {p.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {p.is_featured ? (
                        <span className="text-amber-500 text-base" title="Featured product">⭐</span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-brand-600 hover:text-brand-700 font-bold text-xs mr-3 px-2.5 py-1.5 rounded-lg hover:bg-brand-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="text-red-500 hover:text-red-600 font-bold text-xs px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-xl w-full p-7 md:p-8 shadow-2xl animate-pop-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h2 className="font-display font-extrabold text-xl text-gray-900">
                  {editing ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Fill in product information and inventory numbers.</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-2xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={save} className="space-y-4">
              {/* Image Preview Box */}
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <img
                  src={form.image || getProductImage({ slug: form.name.toLowerCase().replace(/\s+/g, '-'), category_name: categories.find(c => c.id === form.category)?.name })}
                  alt="Preview"
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 bg-white"
                />
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-bold text-gray-700 block mb-1">Product Image URL / Path</label>
                  <input
                    type="text"
                    placeholder="/images/kit-deluxe.jpg or https://..."
                    value={form.image || ''}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Product Name *</label>
                <input
                  required
                  placeholder="e.g. Sparkle Pro Whitening Kit"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-2xl px-3 py-2.5 text-sm bg-white outline-none focus:border-brand-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Stock Quantity *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Regular Price ($) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="49.99"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Sale Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="39.99 (optional)"
                    value={form.discount_price}
                    onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed product features, benefits, and ingredients..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl p-3.5 text-sm outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 accent-brand-600 rounded"
                  />
                  Active in Store
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="w-4 h-4 accent-brand-600 rounded"
                  />
                  Feature on Homepage
                </label>
              </div>

              <div className="flex gap-3 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 rounded-full py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-brand-600 text-white rounded-full py-3 text-sm font-bold hover:bg-brand-700 transition disabled:opacity-50 shadow-lg shadow-brand-200"
                >
                  {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
