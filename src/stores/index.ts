import { createPinia } from 'pinia'

export const pinia = createPinia()

// 导出所有stores
export { useAuthStore } from './auth'
export { useTaskStore } from './tasks'
export { useUserStore } from './user'
export { useNotificationStore } from './notifications'
export { useThemeStore } from './theme'