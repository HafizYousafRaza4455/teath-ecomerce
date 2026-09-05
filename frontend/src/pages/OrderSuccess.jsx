import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getOrder, verifyPayment } from '../api'
import { useCartStore } from '../store/cart'

export default function OrderSuccess() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const orderId = params.get('order_id')
  const { reset } = useCartStore()
  const [order, setOrder] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!orderId) return navigate('/')
    ;(async () => {
      try {
        const { data } = await verifyPayment(orderId)
        setOrder(data.order)
        if (data.paid) reset()
      } catch {
        /* order may still be processing */
      } finally {
        setChecking(false)
      }
    })()
  }, [orderId, navigate, reset])

  if (checking && !order) return <div className="py-24 text-center text-gray-400">Verifying payment…</div>

  const paid = order?.payment_status === 'paid'

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">{paid ? '🎉' : '⏳'}</div>
      <h1 className="text-3xl font-bold text-gray-900">
        {paid ? 'Payment Successful!' : 'Payment Processing'}
      </h1>
      <p className="text-gray-500 mt-2">
        {paid
          ? `Thanks for your order! Order #${orderId} is confirmed and on its way.`
          : `We're confirming your payment for order #${orderId}. This usually takes a moment.`}
      </p>
      {order && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-8 text-left">
          <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {order.items?.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span className="text-gray-600">{i.product_name} × {i.quantity}</span>
                <span className="font-medium">${Number(i.total_price).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t border-gray-100">
              <span>Total</span><span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-4 justify-center mt-8">
        <Link to="/account" className="bg-brand-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-700">
          View My Orders
        </Link>
        <Link to="/shop" className="border border-gray-300 px-8 py-3 rounded-full font-semibold hover:border-brand-600 hover:text-brand-600">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
