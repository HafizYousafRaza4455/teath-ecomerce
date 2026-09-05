import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  if (user && !user.is_staff) {
    return (
      <div className="max-w-md mx-auto text-center py-28">
        <div className="text-6xl mb-5">🚫</div>
        <h2 className="font-display text-2xl font-extrabold text-gray-900">Admin access only</h2>
        <p className="text-gray-400 text-sm mt-2">This area is for store administrators.</p>
        <button onClick={() => navigate('/')} className="mt-6 text-brand-600 font-bold hover:underline">← Back to store</button>
      </div>
    )
  }
  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-28">
        <div className="text-6xl mb-5">🔐</div>
        <h2 className="font-display text-2xl font-extrabold text-gray-900">Login required</h2>
        <Link to="/login" className="mt-6 inline-block bg-brand-600 text-white px-10 py-3.5 rounded-full font-bold hover:bg-brand-700 transition">Login</Link>
      </div>
    )
  }

  const links = [
    ['dashboard', '📊', 'Dashboard'],
    ['orders', '📦', 'Orders'],
    ['products', '🧴', 'Products'],
    ['customers', '👥', 'Customers'],
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-60 bg-gray-950 text-gray-400 p-5 hidden md:flex flex-col shrink-0">
        <div className="font-display font-extrabold text-white mb-8 px-2 tracking-tight">✦ Admin Panel</div>
        <nav className="space-y-1.5 flex-1">
          {links.map(([to, e, label]) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${isActive ? 'bg-brand-500 text-gray-950 shadow-lg shadow-brand-500/20' : 'hover:bg-gray-800/60 hover:text-white'}`
              }>
              <span className="text-base">{e}</span> {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => navigate('/')} className="text-xs text-gray-500 hover:text-white px-4 py-2.5 text-left transition">← View Store</button>
        <button onClick={logout} className="text-xs text-gray-500 hover:text-red-400 px-4 py-2 text-left transition">Logout</button>
      </aside>
      <div className="flex-1 p-6 md:p-10 max-w-6xl min-w-0">
        <div className="md:hidden flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
          {links.map(([to, e, label]) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition ${isActive ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
              {e} {label}
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </div>
  )
}
