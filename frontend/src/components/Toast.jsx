import { create } from 'zustand'

let toastId = 0

export const useToastStore = create((set) => ({
  toasts: [],
  push: (message, type = 'info') => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3200)
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = {
  success: (m) => useToastStore.getState().push(m, 'success'),
  error: (m) => useToastStore.getState().push(m, 'error'),
  info: (m) => useToastStore.getState().push(m, 'info'),
}

const styles = {
  success: 'bg-brand-600 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-gray-900 text-white',
}
const icons = { success: '✓', error: '✕', info: 'ℹ' }

export function ToastHost() {
  const { toasts, remove } = useToastStore()
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => remove(t.id)}
          className={`animate-pop-in cursor-pointer rounded-full px-5 py-3 text-sm font-medium shadow-lg flex items-center gap-2 ${styles[t.type]}`}
        >
          <span>{icons[t.type]}</span> {t.message}
        </div>
      ))}
    </div>
  )
}
