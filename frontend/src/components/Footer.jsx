import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-xl font-extrabold text-white mb-3"><span className="text-brand-400">✦</span> SparkleSmile</div>
          <p className="text-sm leading-relaxed">Professional-grade teeth whitening from the comfort of your home. Dentist-approved, enamel-safe.</p>
          <div className="flex gap-3 mt-5">
            {['𝕏', 'f', 'ig', 'yt'].map((s) => (
              <a key={s} href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-sm hover:bg-brand-600 hover:text-white transition">{s}</a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-bold text-white mb-4 text-sm">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/shop" className="hover:text-white transition">All Products</Link></li>
            <li><Link to="/shop?category=whitening-kits" className="hover:text-white transition">Whitening Kits</Link></li>
            <li><Link to="/shop?category=led-lights" className="hover:text-white transition">LED Lights</Link></li>
            <li><Link to="/shop?category=whitening-strips" className="hover:text-white transition">Strips</Link></li>
            <li><Link to="/shop?category=gels-pens" className="hover:text-white transition">Gels & Pens</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-white mb-4 text-sm">Support</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
            <li><Link to="/account" className="hover:text-white transition">Track Order</Link></li>
            <li><Link to="/account" className="hover:text-white transition">My Account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-white mb-4 text-sm">Get 10% off</h4>
          <p className="text-sm mb-3">Join 50,000+ subscribers for exclusive deals.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex">
            <input placeholder="Your email" className="flex-1 bg-gray-800 rounded-l-full px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-500" />
            <button className="bg-brand-500 rounded-r-full px-4 text-sm font-semibold text-gray-950 hover:bg-brand-400 transition">Join</button>
          </form>
          <div className="mt-6 text-[11px] text-gray-500 leading-relaxed">
            🔒 Secure checkout · 🚚 Free shipping $50+<br />↩️ 30-day money-back guarantee
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800/60 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 max-w-7xl mx-auto px-4">
        <div>© {new Date().getFullYear()} SparkleSmile. All rights reserved. · Privacy · Terms</div>
        <div>
          <Link to="/admin/login" className="text-gray-400 hover:text-brand-400 transition flex items-center gap-1">
            <span>🔐</span> Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  )
}
