import { create } from 'zustand'
import * as api from '../api'

export const useCartStore = create((set) => ({
  cart: null,
  coupon: null,
  loading: false,

  fetchCart: async () => {
    if (!localStorage.getItem('access')) {
      set({ cart: null })
      return
    }
    set({ loading: true })
    try {
      const { data } = await api.getCart()
      set({ cart: data })
    } catch {
      set({ cart: null })
    } finally {
      set({ loading: false })
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ loading: true })
    try {
      const { data } = await api.addToCart(productId, quantity)
      set({ cart: data })
    } finally {
      set({ loading: false })
    }
  },

  updateItem: async (itemId, quantity) => {
    set({ loading: true })
    try {
      const { data } = await api.updateCartItem(itemId, quantity)
      set({ cart: data })
    } finally {
      set({ loading: false })
    }
  },

  removeItem: async (itemId) => {
    set({ loading: true })
    try {
      const { data } = await api.removeCartItem(itemId)
      set({ cart: data })
    } finally {
      set({ loading: false })
    }
  },

  applyCoupon: async (code) => {
    const { data } = await api.validateCoupon(code)
    if (data.valid) {
      set({ coupon: data.coupon })
      return data.coupon
    }
    throw new Error(data.error || 'Invalid coupon')
  },

  clearCoupon: () => set({ coupon: null }),

  reset: () => set({ cart: null, coupon: null }),
}))
