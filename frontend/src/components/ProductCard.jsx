import { Link } from 'react-router-dom'
import { getProductImage } from '../utils/productImages'

export function Stars({ rating, size = 'text-sm' }) {
  return (
    <div className="flex gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className={`${size} ${i <= Math.round(rating || 0) ? 'text-accent-500' : 'text-gray-200'}`} fill="currentColor">
          <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.28 3.95a1 1 0 00.95.69h4.15c.97 0 1.37 1.24.59 1.81l-3.36 2.44a1 1 0 00-.36 1.12l1.28 3.95c.3.92-.75 1.69-1.54 1.12l-3.36-2.44a1 1 0 00-1.18 0l-3.36 2.44c-.78.57-1.84-.2-1.54-1.12l1.28-3.95a1 1 0 00-.36-1.12L2.08 9.38c-.78-.57-.38-1.81.6-1.81h4.14a1 1 0 00.95-.69l1.28-3.95z" />
        </svg>
      ))}
    </div>
  )
}

export default function ProductCard({ product }) {
  const onSale = product.discount_price !== null && product.discount_price !== undefined
  const off = onSale ? Math.round((1 - product.effective_price / product.price) * 100) : 0
  const imageUrl = getProductImage(product)

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-brand-100/50 hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {onSale && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
            -{off}%
          </span>
        )}
        {product.in_stock === false && (
          <span className="absolute inset-x-3 bottom-3 bg-gray-900/80 text-white text-xs font-bold py-1.5 rounded-full text-center backdrop-blur">
            Out of stock
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-[11px] text-brand-600 font-bold uppercase tracking-wider">{product.category_name}</div>
        <h3 className="font-display font-bold text-gray-900 mt-1 leading-snug group-hover:text-brand-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-1.5">
          {product.avg_rating ? (
            <>
              <Stars rating={product.avg_rating} size="text-xs" />
              <span className="text-[11px] text-gray-400">({product.review_count})</span>
            </>
          ) : (
            <span className="text-[11px] text-gray-300">No reviews yet</span>
          )}
        </div>
        <div className="flex items-baseline gap-2 mt-2.5">
          <span className="text-lg font-extrabold text-gray-900">${Number(product.effective_price).toFixed(2)}</span>
          {onSale && <span className="text-sm text-gray-400 line-through">${Number(product.price).toFixed(2)}</span>}
        </div>
      </div>
    </Link>
  )
}
