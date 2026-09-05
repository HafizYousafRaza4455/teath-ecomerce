import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createAddress, getAddresses, createOrder, createCheckoutSession } from '../api'
import { useCartStore } from '../store/cart'
import { toast } from '../components/Toast'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, coupon } = useCartStore()
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({
    full_name: '', phone: '', address_line1: '', address_line2: '',
    city: '', state: '', postal_code: '', country: 'US',
  })

  useEffect(() => {
    if (localStorage.getItem('access')) {
      getAddresses().then((r) => {
        const list = r.data.results || r.data
        setAddresses(list)
        if (list.length) setSelectedAddress(list[0].id)
        else setShowForm(true)
      }).catch(() => {})
    }
  }, [])

  if (!localStorage.getItem('access')) {
    return (
      <div className="max-w-md mx-auto text-center py-28">
        <div className="text-6xl mb-5">🔐</div>
        <h2 className="font-display text-2xl font-extrabold text-gray-900">Login to checkout</h2>
        <Link to="/login" className="inline-block mt-6 bg-brand-600 text-white px-10 py-3.5 rounded-full font-bold hover:bg-brand-700 transition">Login</Link>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-28">
        <div className="text-6xl mb-5">🛒</div>
        <h2 className="font-display text-2xl font-extrabold text-gray-900">Your cart is empty</h2>
        <Link to="/shop" className="inline-block mt-6 bg-brand-600 text-white px-10 py-3.5 rounded-full font-bold hover:bg-brand-700 transition">Shop Products</Link>
      </div>
    )
  }

  const subtotal = Number(cart.total_price)
  const discount = coupon ? subtotal * (coupon.discount_percent / 100) : 0
  const total = subtotal - discount

  const saveAddress = async (e) => {
    e.preventDefault()
    try {
      const { data } = await createAddress(form)
      setAddresses((prev) => [...prev, data])
      setSelectedAddress(data.id)
      setShowForm(false)
      toast.success('Address saved')
    } catch {
      toast.error('Please fill all required fields')
    }
  }

  const placeOrder = async () => {
    if (!selectedAddress) return toast.error('Please add a shipping address first')
    setPlacing(true)
    try {
      const { data: order } = await createOrder({
        address_id: selectedAddress,
        coupon_code: coupon?.code || '',
      })
      const { data } = await createCheckoutSession(order.id)
      window.location.href = data.checkout_url
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not place order. Try again.')
      setPlacing(false)
    }
  }

  const input = 'border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition'

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Checkout</h1>
      <p className="text-gray-400 text-sm mb-10">Almost there — where should we ship your smile kit?</p>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm">
            <h2 className="font-display font-bold text-gray-900 mb-5 text-lg">Shipping Address</h2>
            <div className="space-y-3">
              {addresses.map((a) => (
                <label key={a.id} className={`flex items-start gap-4 border rounded-2xl p-5 cursor-pointer transition-all ${selectedAddress === a.id ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-100' : 'border-gray-100 hover:border-gray-300'}`}>
                  <input type="radio" checked={selectedAddress === a.id} onChange={() => setSelectedAddress(a.id)} className="mt-1 accent-brand-600" />
                  <div className="text-sm flex-1">
                    <div className="font-bold text-gray-900">{a.full_name}</div>
                    <div className="text-gray-500 mt-0.5">{a.address_line1} {a.address_line2}</div>
                    <div className="text-gray-500">{a.city}, {a.state} {a.postal_code}, {a.country}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{a.phone}</div>
                  </div>
                </label>
              ))}
            </div>
            {showForm ? (
              <form onSubmit={saveAddress} className="grid grid-cols-2 gap-3 mt-5">
                <input required placeholder="Full name *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={`col-span-2 ${input}`} />
                <input required placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
                <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={input} />
                <input required placeholder="Address line 1 *" value={form.address_line1} onChange={(e) => setForm({ ...form, address_line1: e.target.value })} className={`col-span-2 ${input}`} />
                <input placeholder="Apartment, suite, etc. (optional)" value={form.address_line2} onChange={(e) => setForm({ ...form, address_line2: e.target.value })} className={`col-span-2 ${input}`} />
                <input required placeholder="City *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={input} />
                <input required placeholder="State *" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={input} />
                <input required placeholder="Postal code *" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} className={input} />
                <button className="col-span-2 bg-gray-900 text-white rounded-full py-3.5 font-bold text-sm hover:bg-gray-800 transition">Save Address</button>
              </form>
            ) : (
              <button onClick={() => setShowForm(true)} className="text-brand-600 text-sm font-bold hover:underline mt-4">+ Add new address</button>
            )}
          </section>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-7 h-fit shadow-sm sticky top-24">
          <h2 className="font-display font-bold text-gray-900 mb-5 text-lg">Order Summary</h2>
          <div className="space-y-3 text-sm">
            {cart.items.map((i) => (
              <div key={i.id} className="flex justify-between gap-4">
                <span className="text-gray-500 leading-snug">{i.product.name} <strong className="text-gray-800">×{i.quantity}</strong></span>
                <span className="font-bold whitespace-nowrap">${Number(i.total_price).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-4 border-t border-gray-100"><span className="text-gray-500">Subtotal</span><span className="font-bold">${subtotal.toFixed(2)}</span></div>
            {coupon && (
              <div className="flex justify-between text-green-600 font-semibold"><span>Coupon {coupon.code}</span><span>−${discount.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between font-display font-extrabold text-lg pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <button onClick={placeOrder} disabled={placing}
            className="w-full bg-brand-600 text-white font-bold py-4 rounded-full hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-200 transition-all mt-6 disabled:bg-gray-300">
            {placing ? 'Creating order…' : 'Pay with Stripe →'}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">🔒 You'll be redirected to Stripe's secure checkout</p>
        </div>
      </div>
    </div>
  )
}
