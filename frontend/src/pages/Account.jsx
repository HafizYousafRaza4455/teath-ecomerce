import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteAddress, getAddresses, getOrder, getOrderHistory, updateProfile } from '../api'
import { useAuthStore } from '../store/auth'

const STATUS_BADGE = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-brand-100 text-brand-700',
}

export default function Account() {
  const navigate = useNavigate()
  const { user, init } = useAuthStore()
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [detail, setDetail] = useState(null)
  const [profileMsg, setProfileMsg] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('access')) return navigate('/login')
    getOrderHistory().then((r) => setOrders(r.data.results || r.data)).catch(() => {})
    getAddresses().then((r) => setAddresses(r.data.results || r.data)).catch(() => {})
  }, [navigate])

  if (!user) return null

  const openOrder = async (id) => {
    const { data } = await getOrder(id)
    setDetail(data)
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    await updateProfile({ first_name: user.first_name, last_name: user.last_name, phone: user.phone || '' })
    await init()
    setProfileMsg('Profile updated!')
    setTimeout(() => setProfileMsg(''), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hello, {user.first_name || user.email.split('@')[0]}!</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your orders, addresses, and profile</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8 border-b border-gray-100 overflow-x-auto">
        {['orders', 'addresses', 'profile'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold capitalize whitespace-nowrap border-b-2 -mb-px ${tab === t ? 'text-brand-600 border-brand-600' : 'text-gray-400 border-transparent hover:text-gray-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📦</div>
              <p>No orders yet.</p>
              <Link to="/shop" className="text-brand-600 font-medium text-sm hover:underline">Start shopping →</Link>
            </div>
          )}
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-gray-900">Order #{o.id}</div>
                  <div className="text-xs text-gray-400">{new Date(o.created_at).toLocaleString()}</div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${STATUS_BADGE[o.status] || 'bg-gray-100 text-gray-600'}`}>
                  {o.status}
                </span>
                <div className="font-bold">${Number(o.total).toFixed(2)}</div>
                <button onClick={() => openOrder(o.id)} className="text-sm text-brand-600 font-medium hover:underline">
                  View details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'addresses' && (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.length === 0 && <p className="text-gray-400">No saved addresses. Add one during checkout.</p>}
          {addresses.map((a) => (
            <div key={a.id} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="font-semibold text-gray-900">{a.full_name} {a.is_default && <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full ml-1">Default</span>}</div>
              <div className="text-sm text-gray-500 mt-1">{a.address_line1} {a.address_line2}</div>
              <div className="text-sm text-gray-500">{a.city}, {a.state} {a.postal_code}, {a.country}</div>
              <div className="text-sm text-gray-400">{a.phone}</div>
              <button onClick={() => deleteAddress(a.id).then(() => setAddresses((prev) => prev.filter((x) => x.id !== a.id)))}
                className="text-xs text-gray-400 hover:text-red-500 mt-3">Delete</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'profile' && (
        <form onSubmit={saveProfile} className="bg-white border border-gray-100 rounded-2xl p-6 max-w-lg">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <label className="text-sm font-medium text-gray-700">First name
              <input value={user.first_name || ''} onChange={(e) => (user.first_name = e.target.value) || useAuthStore.setState({ user })}
                className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500" />
            </label>
            <label className="text-sm font-medium text-gray-700">Last name
              <input value={user.last_name || ''} onChange={(e) => (user.last_name = e.target.value) || useAuthStore.setState({ user })}
                className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500" />
            </label>
          </div>
          <label className="text-sm font-medium text-gray-700 block mb-3">Phone
            <input value={user.phone || ''} onChange={(e) => (user.phone = e.target.value) || useAuthStore.setState({ user })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500" />
          </label>
          <label className="text-sm font-medium text-gray-700 block mb-4">Email (read-only)
            <input value={user.email} readOnly disabled
              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50" />
          </label>
          {profileMsg && <div className="text-green-600 text-sm mb-3">{profileMsg}</div>}
          <button className="bg-brand-600 text-white font-semibold px-8 py-2.5 rounded-full hover:bg-brand-700">Save</button>
        </form>
      )}

      {/* Order detail modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Order #{detail.id}</h2>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-2 text-sm">
              {detail.items.map((i) => (
                <div key={i.id} className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-600">{i.product_name} × {i.quantity}</span>
                  <span className="font-medium">${Number(i.total_price).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-green-600"><span>Discount</span><span>-${Number(detail.discount).toFixed(2)}</span></div>
              <div className="flex justify-between font-bold"><span>Total</span><span>${Number(detail.total).toFixed(2)}</span></div>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              Status: <strong className="uppercase">{detail.status}</strong> · Payment: <strong className="uppercase">{detail.payment_status}</strong>
            </div>
            <button onClick={() => setDetail(null)} className="w-full mt-6 bg-gray-100 rounded-full py-2.5 font-semibold text-sm hover:bg-gray-200">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
