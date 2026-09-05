import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastHost } from './components/Toast'
import ErrorBoundary from './components/ErrorBoundary'
import { useAuthStore } from './store/auth'
import { useCartStore } from './store/cart'

import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCustomers from './pages/admin/AdminCustomers'

function App() {
  const { init, initialized } = useAuthStore()
  const { fetchCart } = useCartStore()

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    if (initialized && localStorage.getItem('access')) fetchCart()
  }, [initialized, fetchCart])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar />
        <ToastHost />
      <main className="min-h-[60vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="customers" element={<AdminCustomers />} />
          </Route>
          <Route path="*" element={<div className="py-24 text-center text-gray-400">404 — Page not found</div>} />
        </Routes>
      </main>
      <Footer />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
