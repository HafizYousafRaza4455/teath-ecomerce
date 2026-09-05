import { create } from 'zustand'
import * as api from '../api'

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  initialized: false,

  init: async () => {
    if (!localStorage.getItem('access')) {
      set({ initialized: true })
      return
    }
    set({ loading: true })
    try {
      const { data } = await api.getProfile()
      set({ user: data, initialized: true })
    } catch {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      set({ user: null, initialized: true })
    } finally {
      set({ loading: false })
    }
  },

  login: async (credentials) => {
    const { data } = await api.login(credentials)
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    set({ user: data.user })
    return data.user
  },

  register: async (payload) => {
    const { data } = await api.register(payload)
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    set({ user: data.user })
    return data.user
  },

  logout: () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    set({ user: null })
  },
}))
