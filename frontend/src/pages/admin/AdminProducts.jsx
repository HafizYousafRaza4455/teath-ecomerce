import { useEffect, useState } from 'react'
import { admin } from '../../api'

const EMPTY = {
  name: '', description: '', price: '', discount_price: '', stock: 0,
  category: '', is_active: true, is_featured: false, image: null,
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

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
      name: p.name, description: p.description, price: p.price, discount_price: p.discount_price || '',
      stock: p.stock, category: p.category, is_active: p.is_active, is_featured: p.is_featured, image: null,
    })
    setShowForm(true)
    setError('')
  }

  const save = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        const { image, ...data } = form
        await admin.updateProduct(editing.id, data)
      } else {
        const data = new FormData()
        Object.entries(form).forEach(([k, v]) => {
          if (v !== '' && v !== null) data.append(k, v)
        })
        await admin.createProduct(data)
      }
      setShowForm(false)
      admin.getProducts().then((r) => setProducts(r.data.results || r.data))
    } catch (err) {
      setError(Object.values(err.response?.data || {}).flat()[0] || 'Save failed.')
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return
    await admin.deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button onClick={openCreate} className="bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-brand-700">
          + Add Product
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs text-gray-400 uppercase">
            <tr>
              <th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Active</th><th className="px-4 py-3">Featured</th><th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3 font-semibold text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category_name}</td>
                <td className="px-4 py-3">
                  ${Number(p.effective_price).toFixed(2)}
                  {p.discount_price && <span className="text-xs text-gray-400 line-through ml-1">${Number(p.price).toFixed(2)}</span>}
                </td>
                <td className={`px-4 py-3 font-semibold ${p.stock < 5 ? 'text-red-500' : ''}`}>{p.stock}</td>
                <td className="px-4 py-3">{p.is_active ? '✅' : '❌'}</td>
                <td className="px-4 py-3">{p.is_featured ? '⭐' : '—'}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(p)} className="text-brand-600 font-semibold text-xs hover:underline mr-3">Edit</button>
                  <button onClick={() => remove(p.id)} className="text-red-400 font-semibold text-xs hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={save} className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">{editing ? `Edit: ${editing.name}` : 'New Product'}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4">{error}</div>}
            <input required placeholder="Product name" value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mb-3 outline-none focus:border-brand-500" />
            <textarea required rows={3} placeholder="Description" value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mb-3 outline-none focus:border-brand-500" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <input required type="number" step="0.01" min="0" placeholder="Price" value={form.price}
                onChange={(e) => setForm({...form, price: e.target.value})}
                className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500" />
              <input type="number" step="0.01" min="0" placeholder="Discount price" value={form.discount_price}
                onChange={(e) => setForm({...form, discount_price: e.target.value})}
                className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500" />
              <input required type="number" min="0" placeholder="Stock" value={form.stock}
                onChange={(e) => setForm({...form, stock: e.target.value})}
                className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500" />
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                className="border border-gray-200 rounded-xl px-3 py-2.5 bg-white">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {!editing && (
              <input type="file" accept="image/*" onChange={(e) => setForm({...form, image: e.target.files[0]})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mb-3 text-sm" />
            )}
            <div className="flex gap-6 mb-5 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active}
                onChange={(e) => setForm({...form, is_active: e.target.checked})} className="accent-brand-600" /> Active</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_featured}
                onChange={(e) => setForm({...form, is_featured: e.target.checked})} className="accent-brand-600" /> Featured</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-brand-600 text-white font-semibold py-2.5 rounded-full hover:bg-brand-700">
                {editing ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-8 bg-gray-100 font-semibold py-2.5 rounded-full hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
