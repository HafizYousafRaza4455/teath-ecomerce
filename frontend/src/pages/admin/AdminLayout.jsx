import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  if (user && !user.is_staff) {
    return (
      <div className="max-w-md mx-auto text-center py-28 px-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-sm">
          🛡️
        </div>
        <h2 className="font-display text-2xl font-extrabold text-gray-900">Admin Access Restricted</h2>
        <p className="text-gray-400 text-sm mt-2">Your account does not have staff permissions to view this panel.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-brand-600 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-brand-700 transition"
        >
          ← Return to Storefront
        </button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-28 px-4">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-sm">
          🔐
        </div>
        <h2 className="font-display text-2xl font-extrabold text-gray-900">Admin Login Required</h2>
        <p className="text-gray-400 text-sm mt-2">Please log in with your administrator credentials to access this control suite.</p>
        <Link
          to="/admin/login"
          className="mt-6 inline-block bg-brand-600 text-white px-10 py-3.5 rounded-full font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-200"
        >
          Go to Admin Sign In →
        </Link>
      </div>
    )
  }

  const links = [
    { to: 'dashboard', icon: '📊', label: 'Dashboard' },
    { to: 'orders', icon: '📦', label: 'Orders' },
    { to: 'products', icon: '🧴', label: 'Products' },
    { to: 'customers', icon: '👥', label: 'Customers' },
    { to: 'coupons', icon: '🏷️', label: 'Coupons' },
  ]

  const userInitial = user.first_name ? user.first_name[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'A')

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-950 text-gray-300 p-5 md:p-6 flex flex-col justify-between shrink-0 shadow-xl z-20">
        <div>
          {/* Logo & Header */}
          <div className="flex items-center justify-between mb-8 px-2">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                ✦
              </span>
              <div>
                <div className="font-display font-black text-white text-base tracking-tight leading-tight">SparkleSmile</div>
                <div className="text-[10px] uppercase tracking-widest text-brand-400 font-extrabold">Admin Suite</div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {links.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500 text-gray-950 font-bold shadow-lg shadow-brand-500/25 translate-x-1'
                      : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`
                }
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-gray-900 mt-8 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center font-bold text-sm">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{user.first_name || user.email.split('@')[0]}</div>
              <div className="text-[10px] text-gray-400 truncate">{user.email}</div>
            </div>
            <span className="text-[10px] font-extrabold bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full">
              STAFF
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gray-900 text-gray-300 hover:text-white hover:bg-gray-800 transition text-center font-medium"
            >
              <span>🏪</span> Store
            </Link>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition font-medium"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-100 px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gray-900 font-semibold capitalize">Overview</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Store Active
            </span>
            <Link
              to="/shop"
              className="bg-brand-50 text-brand-700 text-xs font-bold px-3.5 py-1.5 rounded-full hover:bg-brand-100 transition"
            >
              View Catalog →
            </Link>
          </div>
        </header>

        {/* Subpage View */}
        <main className="p-6 md:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
