import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

export default function AdminLogin() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'admin@sparkle.com', password: 'Admin@12345' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form)
      if (user?.is_staff) {
        navigate('/admin/dashboard')
      } else {
        setError('This account does not have administrator privileges.')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemo = () => {
    setForm({ email: 'admin@sparkle.com', password: 'Admin@12345' })
    setTimeout(() => {
      handleSubmit()
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
            ✦
          </span>
          <span className="font-display font-black text-2xl text-white tracking-tight">
            Sparkle<span className="text-brand-400">Smile</span>
          </span>
        </Link>
        
        <div className="inline-flex items-center gap-1.5 bg-gray-900 border border-gray-800 text-brand-400 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          Administrator Portal
        </div>
        <h2 className="font-display text-2xl font-black text-white tracking-tight">
          Control Center Access
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Sign in to manage catalog merchandise, orders, and customer accounts.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-gray-900/90 border border-gray-800/80 rounded-[32px] p-7 sm:p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-2xl font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition placeholder-gray-600"
                placeholder="admin@sparkle.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-brand-500 hover:bg-brand-400 text-gray-950 font-extrabold py-3.5 rounded-full text-sm transition-all duration-200 shadow-lg shadow-brand-500/20 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In as Administrator →'}
            </button>
          </form>

          {/* Quick Demo Access Box */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="bg-gray-950/70 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Default Admin Credentials</span>
                <span className="text-[10px] font-extrabold bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded-full">Pre-configured</span>
              </div>
              <div className="text-xs text-gray-300 space-y-1 font-mono">
                <div>Email: <span className="text-white font-bold">admin@sparkle.com</span></div>
                <div>Password: <span className="text-white font-bold">Admin@12345</span></div>
              </div>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="mt-3 w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded-xl text-xs transition"
              >
                ⚡ 1-Click Instant Admin Login
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs font-semibold text-gray-500 hover:text-white transition">
            ← Return to Consumer Storefront
          </Link>
        </div>
      </div>
    </div>
  )
}
