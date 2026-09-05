import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">✨</div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-500 text-sm mt-1">Login to your SparkleSmile account</p>
      </div>
      <form onSubmit={submit} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4">{error}</div>}
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mb-4 outline-none focus:border-brand-500"
          placeholder="you@example.com"
        />
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password" required value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mb-6 outline-none focus:border-brand-500"
          placeholder="••••••••"
        />
        <button
          disabled={busy}
          className="w-full bg-brand-600 text-white font-semibold py-3 rounded-full hover:bg-brand-700 disabled:bg-gray-300"
        >
          {busy ? 'Logging in…' : 'Login'}
        </button>
        <p className="text-sm text-gray-500 text-center mt-4">
          New here? <Link to="/register" className="text-brand-600 font-medium hover:underline">Create an account</Link>
        </p>
      </form>
    </div>
  )
}
