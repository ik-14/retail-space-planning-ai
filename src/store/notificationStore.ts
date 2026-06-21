import { create } from 'zustand'

interface Notification {
  id: string
  message: string
  type: 'error' | 'info'
}

interface NotificationState {
  notifications: Notification[]
  addNotification: (message: string, type: 'error' | 'info') => void
  removeNotification: (id: string) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (message, type) => {
    const id = Math.random().toString(36).substring(2, 10)
    set((s) => ({ notifications: [...s.notifications, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) }))
    }, 3000)
  },

  removeNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
}))
