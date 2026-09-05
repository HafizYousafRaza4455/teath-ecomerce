import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategories, getProducts } from '../api'
import ProductCard from '../components/ProductCard'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const category = searchParams.get('category') || ''
  const ordering = searchParams.get('ordering') || '-created_at'

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data.results || r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { ordering }
    if (category) params.category = category
    if (search.trim()) params.search = search.trim()
    const t = setTimeout(() => {
      getProducts(params)
        .then((r) => setProducts(r.data.results || r.data))
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(t)
  }, [category, ordering, search])

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  const activeCat = categories.find((c) => c.slug === category)

  return (
    <div>
      {/* Header band */}
      <div className="bg-gradient-to-b from-brand-50/70 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            {activeCat ? activeCat.name : 'All Products'}
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            {activeCat ? activeCat.description : 'Professional-grade whitening, delivered to your door.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
          <div className="relative w-full md:w-96">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search" placeholder="Search products..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-full pl-11 pr-5 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
            />
          </div>
          <select value={ordering} onChange={(e) => setParam('ordering', e.target.value)}
            className="border border-gray-200 rounded-full px-5 py-3 bg-white text-sm font-medium outline-none focus:border-brand-500 cursor-pointer">
            <option value="-created_at">Newest first</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* Category chips */}
        <div className="flex gap-2.5 mb-10 overflow-x-auto no-scrollbar pb-1">
          <button onClick={() => setParam('category', '')}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${!category ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
            All Products
          </button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setParam('category', c.slug)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${category === c.slug ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {c.name} <span className={category === c.slug ? 'text-gray-400' : 'text-gray-300'}>{c.product_count}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-3xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-28">
            <div className="text-6xl mb-5">🔍</div>
            <h3 className="font-display font-bold text-xl text-gray-900">No products found</h3>
            <p className="text-gray-400 text-sm mt-2">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${(i % 4) * 70}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
