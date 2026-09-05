import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuthStore()
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    setBusy(true)
    setError('')
    try {
      await register({
        ...form,
        username: form.email.split('@')[0] + Math.floor(Math.random() * 1000),
      })
      navigate('/')
    } catch (err) {
      const msg = err.response?.data
      setError(
        msg?.email?.[0] || msg?.password?.[0] || msg?.username?.[0] || 'Registration failed. Please try again.'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">✨</div>
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="text-gray-500 text-sm mt-1">Join 50,000+ brighter smiles</p>
      </div>
      <form onSubmit={submit} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4">{error}</div>}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input required placeholder="First name" value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500" />
          <input placeholder="Last name" value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500" />
        </div>
        <input type="email" required placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mb-3 outline-none focus:border-brand-500" />
        <input type="password" required placeholder="Password (min 8 characters)" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mb-6 outline-none focus:border-brand-500" />
        <button disabled={busy}
          className="w-full bg-brand-600 text-white font-semibold py-3 rounded-full hover:bg-brand-700 disabled:bg-gray-300">
          {busy ? 'Creating account…' : 'Create Account'}
        </button>
        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account? <Link to="/login" className="text-brand-600 font-medium hover:underline">Login</Link>
        </p>
      </form>
    </div>
  )
}
