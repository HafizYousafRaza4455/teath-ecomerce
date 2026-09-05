import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, getFeaturedProducts } from '../api'
import ProductCard from '../components/ProductCard'

const catEmoji = { 'Whitening Kits': '🧰', 'LED Lights': '💡', 'Whitening Strips': '🪥', 'Gels & Pens': '🧴', 'Accessories': '✨' }

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    getFeaturedProducts().then((r) => setFeatured(r.data.results || r.data)).catch(() => {})
    getCategories().then((r) => setCategories(r.data.results || r.data)).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-32 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 bg-white border border-brand-200 text-brand-700 text-[13px] font-bold px-4 py-2 rounded-full shadow-sm">
              🦷 Dentist-approved · Enamel-safe
            </span>
            <h1 className="font-display text-4xl md:text-[56px] font-extrabold text-gray-900 leading-[1.08] mt-6 tracking-tight">
              A brighter smile in <span className="text-brand-600">3 days</span>, not 3 weeks
            </h1>
            <p className="text-gray-500 mt-5 text-lg leading-relaxed max-w-md">
              Professional whitening kits, LED accelerators, and sensitivity-safe formulas — everything the dentist uses, minus the appointment.
            </p>
            <div className="flex flex-wrap gap-4 mt-9">
              <Link to="/shop" className="bg-brand-600 text-white font-bold px-9 py-4 rounded-full hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-200 transition-all">
                Shop Bestsellers →
              </Link>
              <a href="#how" className="border-2 border-gray-200 font-bold px-9 py-4 rounded-full hover:border-brand-500 hover:text-brand-600 transition-all">
                How it works
              </a>
            </div>
            <div className="flex gap-10 mt-11 text-sm">
              {[['50k+', 'happy smiles'], ['4.8★', 'average rating'], ['30-day', 'money-back']].map(([v, l]) => (
                <div key={l}><strong className="font-display block text-2xl text-gray-900">{v}</strong><span className="text-gray-400">{l}</span></div>
              ))}
            </div>
          </div>
          <div className="hidden md:flex justify-center animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="relative">
              <div className="w-[340px] h-[340px] bg-gradient-to-br from-brand-400 to-brand-600 rounded-[48px] rotate-6 flex items-center justify-center shadow-2xl shadow-brand-300/60">
                <span className="text-[150px] -rotate-6">😁</span>
              </div>
              <div className="absolute -top-4 -left-8 bg-white rounded-2xl px-5 py-3 shadow-xl animate-pop-in">
                <div className="text-xs text-gray-400 font-medium">Shade improvement</div>
                <div className="font-display font-extrabold text-brand-600 text-xl">6× whiter ✓</div>
              </div>
              <div className="absolute -bottom-4 -right-6 bg-white rounded-2xl px-5 py-3 shadow-xl animate-pop-in" style={{ animationDelay: '0.1s' }}>
                <div className="text-xs text-gray-400 font-medium">Visible results</div>
                <div className="font-display font-extrabold text-accent-600 text-xl">Day 3</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['🚚', 'Free shipping over $50'], ['🛡️', 'Enamel-safe formula'], ['⚡', 'Results in 3 days'], ['↩️', '30-day guarantee']].map(([e, t]) => (
            <div key={t} className="flex items-center justify-center gap-2.5 text-sm font-semibold text-gray-600">
              <span className="text-lg">{e}</span> {t}
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Shop by Category</h2>
            <p className="text-gray-400 text-sm mt-1.5">Find the perfect whitening solution for you</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((c, i) => (
            <Link key={c.id} to={`/shop?category=${c.slug}`}
              className="group bg-white border border-gray-100 rounded-3xl p-6 text-center hover:shadow-lg hover:border-brand-200 hover:-translate-y-0.5 transition-all animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="text-4xl group-hover:scale-125 transition-transform duration-300">{catEmoji[c.name] || '✨'}</div>
              <div className="font-display font-bold text-sm mt-3 text-gray-800 group-hover:text-brand-600">{c.name}</div>
              <div className="text-[11px] text-gray-400">{c.product_count} items</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Bestsellers</h2>
            <p className="text-gray-400 text-sm mt-1.5">Loved by thousands of customers</p>
          </div>
          <Link to="/shop" className="text-brand-600 font-bold text-sm hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p, i) => (
            <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Whiter teeth, 3 easy steps</h2>
            <p className="text-gray-400 text-sm mt-2">15 minutes a day is all it takes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ['01', '🧰', 'Choose your kit', 'Pick the whitening system matching your goals and sensitivity level.'],
              ['02', '💡', 'Whiten at home', 'Apply the gel, use the LED light for 15-30 minutes a day while you relax.'],
              ['03', '😁', 'Show it off', 'Visibly whiter teeth in 3-14 days. Maintain easily with our aftercare line.'],
            ].map(([n, e, t, d], i) => (
              <div key={t} className="relative bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="absolute top-6 right-7 font-display text-4xl font-extrabold text-gray-100">{n}</span>
                <div className="text-4xl">{e}</div>
                <h3 className="font-display font-bold text-gray-900 mt-5 text-lg">{t}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Real results, real smiles</h2>
          <p className="text-gray-400 text-sm mt-2">Over 4,000 five-star reviews and counting</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ['Coffee drinker for 10 years — after one week of the Pro Kit, my teeth are 4 shades whiter. Absolutely incredible.', 'Sarah M.', 'Verified Buyer'],
            ['I was skeptical, but the LED light + gel combo genuinely works. Zero sensitivity, which shocked me.', 'James T.', 'Verified Buyer'],
            ['The whitening pen is perfect for touch-ups before events. It lives in my purse now!', 'Priya K.', 'Verified Buyer'],
          ].map(([q, n, b], i) => (
            <div key={n} className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-md transition-shadow animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="text-accent-500 mb-3 tracking-widest">★★★★★</div>
              <p className="text-gray-700 text-[15px] leading-relaxed">“{q}”</p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700 text-sm">{n[0]}</div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{n}</div>
                  <div className="text-[11px] text-gray-400">{b}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="relative overflow-hidden bg-gray-900 rounded-[40px] px-8 py-16 md:py-20 text-center">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight">Ready for your brightest smile?</h2>
            <p className="text-gray-400 mt-3 max-w-lg mx-auto">Use code <span className="font-bold text-accent-400">SPARKLE10</span> for 10% off your first order.</p>
            <Link to="/shop" className="inline-block bg-brand-500 text-gray-950 font-bold px-10 py-4 rounded-full mt-8 hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/20 transition-all">
              Start Whitening →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
