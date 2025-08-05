import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import type { Notification, ID } from '@/types'

export const useNotificationStore = defineStore('notifications', () => {
  // 状态
  const notifications = ref<Notification[]>([])
  const maxNotifications = ref(5)

  // 添加通知
  const addNotification = (notification: Omit<Notification, 'id'>): void => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      id,
      duration: 5000, // 默认5秒
      ...notification
    }

    notifications.value.unshift(newNotification)

    // 限制通知数量
    if (notifications.value.length > maxNotifications.value) {
      notifications.value = notifications.value.slice(0, maxNotifications.value)
    }

    // 自动移除通知
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
  }

  // 移除通知
  const removeNotification = (id: ID): void => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  // 清除所有通知
  const clearNotifications = (): void => {
    notifications.value = []
  }

  // 便捷方法
  const success = (title: string, message: string): void => {
    addNotification({ type: 'success', title, message })
  }

  const error = (title: string, message: string): void => {
    addNotification({ type: 'error', title, message })
  }

  const warning = (title: string, message: string): void => {
    addNotification({ type: 'warning', title, message })
  }

  const info = (title: string, message: string): void => {
    addNotification({ type: 'info', title, message })
  }

  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    warning,
    info
  }
})