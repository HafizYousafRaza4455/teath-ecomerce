import { create } from 'zustand'
import * as api from '../api'
import { PRODUCTS_DATA } from '../data/catalog'

const LOCAL_CART_KEY = 'sparkle_guest_cart'

function loadGuestCart() {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { items: [], total_price: '0.00', total_items: 0 }
}

function saveGuestCart(cart) {
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart))
  } catch {}
}

function calculateTotals(items) {
  const total_items = items.reduce((sum, i) => sum + i.quantity, 0)
  const total_price = items.reduce((sum, i) => sum + (Number(i.price) * i.quantity), 0)
  return {
    items,
    total_items,
    total_price: total_price.toFixed(2),
  }
}

export const useCartStore = create((set, get) => ({
  cart: loadGuestCart(),
  coupon: null,
  loading: false,

  fetchCart: async () => {
    if (localStorage.getItem('access')) {
      set({ loading: true })
      try {
        const { data } = await api.getCart()
        set({ cart: data })
      } catch {
        set({ cart: loadGuestCart() })
      } finally {
        set({ loading: false })
      }
      return
    }
    set({ cart: loadGuestCart() })
  },

  addItem: async (productId, quantity = 1) => {
    if (localStorage.getItem('access')) {
      set({ loading: true })
      try {
        const { data } = await api.addToCart(productId, quantity)
        set({ cart: data })
        return
      } catch {
      } finally {
        set({ loading: false })
      }
    }

    const current = get().cart || loadGuestCart()
    const product = PRODUCTS_DATA.find((p) => p.id === Number(productId) || p.slug === productId)
    if (!product) throw new Error('Product not found')

    const items = [...(current.items || [])]
    const existingIndex = items.findIndex((i) => i.product.id === product.id)

    if (existingIndex > -1) {
      const newQty = items[existingIndex].quantity + quantity
      items[existingIndex] = {
        ...items[existingIndex],
        quantity: newQty,
        total_price: (Number(product.effective_price) * newQty).toFixed(2),
      }
    } else {
      items.push({
        id: 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        product,
        quantity,
        price: product.effective_price,
        total_price: (Number(product.effective_price) * quantity).toFixed(2),
      })
    }

    const updated = calculateTotals(items)
    saveGuestCart(updated)
    set({ cart: updated })
  },

  updateItem: async (itemId, quantity) => {
    if (localStorage.getItem('access')) {
      try {
        const { data } = await api.updateCartItem(itemId, quantity)
        set({ cart: data })
        return
      } catch {}
    }

    const current = get().cart || loadGuestCart()
    let items = [...(current.items || [])]

    if (quantity <= 0) {
      items = items.filter((i) => i.id !== itemId)
    } else {
      items = items.map((i) => {
        if (i.id === itemId) {
          return {
            ...i,
            quantity,
            total_price: (Number(i.price) * quantity).toFixed(2),
          }
        }
        return i
      })
    }

    const updated = calculateTotals(items)
    saveGuestCart(updated)
    set({ cart: updated })
  },

  removeItem: async (itemId) => {
    if (localStorage.getItem('access')) {
      try {
        const { data } = await api.removeCartItem(itemId)
        set({ cart: data })
        return
      } catch {}
    }

    const current = get().cart || loadGuestCart()
    const items = (current.items || []).filter((i) => i.id !== itemId)
    const updated = calculateTotals(items)
    saveGuestCart(updated)
    set({ cart: updated })
  },

  applyCoupon: async (code) => {
    try {
      const { data } = await api.validateCoupon(code)
      if (data.valid) {
        set({ coupon: data.coupon })
        return data.coupon
      }
    } catch {}

    const cleanCode = (code || '').trim().toUpperCase()
    const promoCodes = {
      SPARKLE10: { code: 'SPARKLE10', discount_percent: 10 },
      WELCOME10: { code: 'WELCOME10', discount_percent: 10 },
      WHITE20: { code: 'WHITE20', discount_percent: 20 },
      VIP50: { code: 'VIP50', discount_percent: 50 },
    }
    if (promoCodes[cleanCode]) {
      const c = promoCodes[cleanCode]
      set({ coupon: c })
      return c
    }
    throw new Error('Invalid coupon code. Try SPARKLE10 or WHITE20')
  },

  clearCoupon: () => set({ coupon: null }),

  reset: () => {
    try {
      localStorage.removeItem(LOCAL_CART_KEY)
    } catch {}
    set({ cart: { items: [], total_price: '0.00', total_items: 0 }, coupon: null })
  },
}))
