import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProduct, createReview } from '../api'
import { useAuthStore } from '../store/auth'
import { useCartStore } from '../store/cart'
import { Stars } from '../components/ProductCard'
import { toast } from '../components/Toast'
import { getProductImage } from '../utils/productImages'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addItem } = useCartStore()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [review, setReview] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    getProduct(slug).then((r) => setProduct(r.data)).catch(() => navigate('/shop'))
  }, [slug, navigate])

  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20"><div className="bg-gray-100 rounded-3xl h-96 animate-pulse" /></div>

  const onSale = product.discount_price !== null && product.discount_price !== undefined
  const off = onSale ? Math.round((1 - product.effective_price / product.price) * 100) : 0

  const handleAdd = async () => {
    if (!user) {
      toast.info('Login to add items to your cart')
      return navigate('/login')
    }
    setAdding(true)
    try {
      await addItem(product.id, qty)
      toast.success('Added to cart!')
      navigate('/cart')
    } catch {
      toast.error('Could not add to cart')
    } finally {
      setAdding(false)
    }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    try {
      await createReview(slug, review)
      toast.success('Thanks for your review!')
      setReview({ rating: 5, comment: '' })
      const { data } = await getProduct(slug)
      setProduct(data)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'You already reviewed this product.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-[13px] text-gray-400 mb-8">
        <Link to="/" className="hover:text-brand-600">Home</Link> /{' '}
        <Link to={`/shop?category=${product.category_slug}`} className="hover:text-brand-600">{product.category_name}</Link> /{' '}
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-50 rounded-[36px] overflow-hidden flex items-center justify-center relative animate-fade-up shadow-sm border border-gray-100">
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {onSale && (
            <span className="absolute top-6 left-6 bg-red-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md">-{off}% OFF</span>
          )}
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">{product.category_name}</div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 leading-tight tracking-tight">{product.name}</h1>
          <div className="flex items-center gap-2.5 mt-3">
            {product.avg_rating ? (
              <>
                <Stars rating={product.avg_rating} />
                <span className="text-sm text-gray-500 font-medium">{product.avg_rating} · {product.review_count} reviews</span>
              </>
            ) : (
              <span className="text-sm text-gray-400">No reviews yet — be the first!</span>
            )}
          </div>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="font-display text-4xl font-extrabold text-gray-900">${Number(product.effective_price).toFixed(2)}</span>
            {onSale && <span className="text-xl text-gray-400 line-through">${Number(product.price).toFixed(2)}</span>}
            {onSale && <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">Save ${(Number(product.price) - Number(product.effective_price)).toFixed(2)}</span>}
          </div>

          <p className="text-gray-600 mt-5 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4.5 py-3 hover:bg-gray-50 text-lg w-12">−</button>
              <span className="px-4 font-bold w-12 text-center">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4.5 py-3 hover:bg-gray-50 text-lg w-12">+</button>
            </div>
            <button onClick={handleAdd} disabled={adding || !product.in_stock}
              className="flex-1 bg-brand-600 text-white font-bold py-4 rounded-full hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-200 disabled:bg-gray-200 disabled:text-gray-400 transition-all">
              {!product.in_stock ? 'Out of Stock' : adding ? 'Adding…' : 'Add to Cart'}
            </button>
          </div>
          <div className="text-[13px] text-gray-400 mt-3 font-medium">
            {product.in_stock ? `✓ In stock — ${product.stock} available` : '✕ Currently unavailable'}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8">
            {[['🚚', 'Free shipping', 'Orders $50+'], ['🛡️', 'Enamel-safe', 'Dermatologist tested'], ['↩️', '30-day returns', 'No questions asked']].map(([e, t, s]) => (
              <div key={t} className="bg-gray-50 rounded-2xl p-3.5 text-center">
                <div className="text-xl">{e}</div>
                <div className="text-xs font-bold text-gray-800 mt-1">{t}</div>
                <div className="text-[10px] text-gray-400">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20">
        <h2 className="font-display text-2xl font-extrabold text-gray-900 mb-8">Customer Reviews</h2>
        {product.reviews?.length ? (
          <div className="space-y-4 mb-10">
            {product.reviews.map((r) => (
              <div key={r.id} className="bg-white border border-gray-100 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700 text-sm">
                      {(r.user_name || 'C')[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{r.user_name || 'Customer'}</div>
                      <Stars rating={r.rating} size="text-xs" />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 text-[15px] mt-3.5 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mb-10">Be the first to review this product!</p>
        )}

        <form onSubmit={submitReview} className="bg-gray-50 rounded-3xl p-7 max-w-2xl">
          <h3 className="font-display font-bold text-gray-900 mb-5 text-lg">Write a review</h3>
          <div className="flex gap-1.5 mb-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <button type="button" key={i} onClick={() => setReview((r) => ({ ...r, rating: i }))}
                className={`text-3xl transition-transform hover:scale-110 ${i <= review.rating ? 'text-accent-500' : 'text-gray-300'}`}>★</button>
            ))}
          </div>
          <textarea required rows={3} placeholder="Share your experience..." value={review.comment}
            onChange={(e) => setReview((r) => ({ ...r, comment: e.target.value }))}
            className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition resize-none" />
          <button className="mt-4 bg-gray-900 text-white font-bold px-8 py-3 rounded-full hover:bg-gray-800 transition">Submit Review</button>
        </form>
      </section>
    </div>
  )
}
