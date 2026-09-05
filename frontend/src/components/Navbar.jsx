import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useCartStore } from '../store/cart'

const links = [
  ['/', 'Home', false],
  ['/shop', 'Shop', false],
  ['/shop?category=whitening-kits', 'Kits', true],
  ['/shop?category=led-lights', 'LED Lights', true],
  ['/shop?category=whitening-strips', 'Strips', true],
]

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { cart } = useCartStore()
  const count = cart?.total_items || 0
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(!open)} className="md:hidden p-1.5 -ml-1.5 text-gray-600" aria-label="Menu">
            <div className="w-5 space-y-1.5">
              <div className={`h-0.5 bg-current transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <div className={`h-0.5 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
              <div className={`h-0.5 bg-current transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
          <Link to="/" className="font-display font-extrabold text-xl text-gray-900">
            <span className="text-brand-500">✦</span> SparkleSmile
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
          {links.map(([to, label]) => (
            <NavLink key={label} to={to} className={({ isActive }) => (isActive && !to.includes('?') ? 'text-brand-600' : 'hover:text-brand-600')}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <Link to="/account" className="hidden sm:block text-sm font-semibold text-gray-700 hover:text-brand-600 max-w-40 truncate">
                {user.first_name || user.email.split('@')[0]}
              </Link>
              <button onClick={logout} className="hidden sm:block text-sm text-gray-400 hover:text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-brand-600">Login</Link>
              <Link to="/register" className="hidden sm:block text-sm font-semibold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition">
                Sign Up
              </Link>
            </>
          )}
          <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-brand-50 transition group" aria-label="Cart">
            <svg className="w-5 h-5 text-gray-700 group-hover:text-brand-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.784 2.806-7.6M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-brand-500 text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-fade-up">
          {links.map(([to, label]) => (
            <NavLink key={label} to={to} onClick={() => setOpen(false)}
              className={({ isActive }) => `block px-3 py-2.5 rounded-xl text-sm font-medium ${isActive && !to.includes('?') ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              {label}
            </NavLink>
          ))}
          {user ? (
            <>
              <NavLink to="/account" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">My Account</NavLink>
              <button onClick={() => { logout(); setOpen(false) }} className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">Logout</button>
            </>
          ) : (
            <NavLink to="/register" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold bg-gray-900 text-white text-center">Sign Up</NavLink>
          )}
        </nav>
      )}
    </header>
  )
}
