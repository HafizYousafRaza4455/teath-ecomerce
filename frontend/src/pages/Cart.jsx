import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cart'
import { toast } from '../components/Toast'
import { getProductImage } from '../utils/productImages'

export default function Cart() {
  const { cart, coupon, updateItem, removeItem, applyCoupon, clearCoupon } = useCartStore()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-28">
        <div className="text-6xl mb-5">🛒</div>
        <h2 className="font-display text-2xl font-extrabold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mt-2">Let's fix that — your smile is waiting.</p>
        <Link to="/shop" className="inline-block mt-6 bg-brand-600 text-white px-10 py-3.5 rounded-full font-bold hover:bg-brand-700 transition">Start Shopping →</Link>
      </div>
    )
  }

  const subtotal = Number(cart.total_price)
  const discount = coupon ? subtotal * (coupon.discount_percent / 100) : 0
  const total = subtotal - discount

  const handleApply = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const c = await applyCoupon(code)
      toast.success(`Coupon ${c.code} applied — ${c.discount_percent}% off!`)
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid coupon code'
      setError(msg)
      toast.error(msg)
    }
  }

  const changeQty = async (item, delta) => {
    try {
      await updateItem(item.id, item.quantity + delta)
    } catch {
      toast.error('Not enough stock')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Your Cart <span className="text-gray-300 font-bold text-2xl">({cart.total_items})</span></h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-3xl p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
              <Link to={`/product/${item.product.slug}`} className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                <img
                  src={getProductImage(item.product)}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.slug}`} className="font-display font-bold text-gray-900 hover:text-brand-600 leading-snug">
                  {item.product.name}
                </Link>
                <div className="text-sm text-gray-400 mt-0.5">${Number(item.product.effective_price).toFixed(2)} each</div>
              </div>
              <div className="flex items-center border border-gray-200 rounded-full">
                <button onClick={() => changeQty(item, -1)} className="px-3.5 py-2 hover:bg-gray-50 rounded-l-full">−</button>
                <span className="px-3.5 font-bold text-sm">{item.quantity}</span>
                <button onClick={() => changeQty(item, 1)} className="px-3.5 py-2 hover:bg-gray-50 rounded-r-full">+</button>
              </div>
              <div className="font-display font-extrabold text-gray-900 w-24 text-right">${Number(item.total_price).toFixed(2)}</div>
              <button onClick={() => removeItem(item.id).then(() => toast.info('Item removed'))} className="text-gray-300 hover:text-red-500 p-1 transition" aria-label="Remove">✕</button>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-7 h-fit shadow-sm sticky top-24">
          <h2 className="font-display font-bold text-gray-900 mb-5 text-lg">Order Summary</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-bold">${subtotal.toFixed(2)}</span></div>
            {coupon && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Coupon {coupon.code}</span><span>−${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-display font-extrabold text-lg pt-3 border-t border-gray-100">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleApply} className="mt-5">
            <div className="flex gap-2">
              <input placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-brand-500 uppercase font-mono" />
              <button className="bg-gray-100 px-5 rounded-full text-sm font-bold hover:bg-gray-200 transition">Apply</button>
            </div>
            {error && !coupon && <div className="text-red-500 text-xs mt-2">{error}</div>}
            {coupon && <button type="button" onClick={() => { clearCoupon(); setCode('') }} className="text-xs text-gray-400 hover:text-red-500 mt-2">Remove coupon</button>}
          </form>

          <div className="text-[11px] text-gray-400 mt-4 text-center bg-brand-50 rounded-xl py-2 font-medium">
            💡 Try <strong>SPARKLE10</strong> for 10% off
          </div>

          <button onClick={() => navigate('/checkout')} className="w-full bg-brand-600 text-white font-bold py-4 rounded-full hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-200 transition-all mt-6">
            Checkout →
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">🔒 Secure checkout powered by Stripe</p>
        </div>
      </div>
    </div>
  )
}
