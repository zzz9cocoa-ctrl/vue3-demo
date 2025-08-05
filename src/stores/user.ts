import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { User, UserPreferences } from '@/types'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', () => {
  // 状态
  const preferences = ref<UserPreferences>({
    theme: 'light',
    language: 'zh-CN',
    notifications: true,
    emailNotifications: false
  })
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const authStore = useAuthStore()
  const currentUser = computed(() => authStore.user)
  
  const userDisplayName = computed(() => {
    if (!currentUser.value) return ''
    return currentUser.value.username || currentUser.value.email
  })

  const userAvatarUrl = computed(() => {
    if (!currentUser.value?.avatar) {
      // 生成默认头像URL（基于用户名的Gravatar风格）
      const name = userDisplayName.value
      const colors = ['#f56565', '#ed8936', '#ecc94b', '#48bb78', '#38b2ac', '#4299e1', '#667eea', '#9f7aea']
      const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${colors[colorIndex].slice(1)}&color=fff&size=128`
    }
    return currentUser.value.avatar
  })

  // 方法
  const updatePreferences = async (newPreferences: Partial<UserPreferences>): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // 更新本地偏好设置
      preferences.value = { ...preferences.value, ...newPreferences }
      
      // 如果用户已登录，同步到服务器
      if (currentUser.value) {
        const success = await authStore.updateProfile({
          preferences: preferences.value
        })
        
        if (!success) {
          throw new Error('更新用户偏好设置失败')
        }
      }
      
      // 保存到本地存储
      localStorage.setItem('user-preferences', JSON.stringify(preferences.value))
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新偏好设置失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const loadPreferences = (): void => {
    try {
      const stored = localStorage.getItem('user-preferences')
      if (stored) {
        preferences.value = { ...preferences.value, ...JSON.parse(stored) }
      }
      
      // 如果用户已登录且有服务器端的偏好设置，优先使用服务器端的
      if (currentUser.value?.preferences) {
        preferences.value = { ...preferences.value, ...currentUser.value.preferences }
      }
    } catch (err) {
      console.error('加载用户偏好设置失败:', err)
    }
  }

  const resetPreferences = async (): Promise<boolean> => {
    const defaultPreferences: UserPreferences = {
      theme: 'light',
      language: 'zh-CN',
      notifications: true,
      emailNotifications: false
    }
    
    return updatePreferences(defaultPreferences)
  }

  const clearError = (): void => {
    error.value = null
  }

  // 用户活动记录
  const recordActivity = (activity: string, metadata?: Record<string, any>): void => {
    const activityRecord = {
      activity,
      timestamp: new Date().toISOString(),
      userId: currentUser.value?.id,
      metadata
    }
    
    // 这里可以发送到分析服务或日志服务
    console.log('User Activity:', activityRecord)
    
    // 可以存储到本地用于离线分析
    const activities = JSON.parse(localStorage.getItem('user-activities') || '[]')
    activities.push(activityRecord)
    
    // 只保留最近100条记录
    if (activities.length > 100) {
      activities.splice(0, activities.length - 100)
    }
    
    localStorage.setItem('user-activities', JSON.stringify(activities))
  }

  const getUserActivities = (): any[] => {
    try {
      return JSON.parse(localStorage.getItem('user-activities') || '[]')
    } catch {
      return []
    }
  }

  const clearActivities = (): void => {
    localStorage.removeItem('user-activities')
  }

  return {
    // 状态
    preferences: readonly(preferences),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // 计算属性
    currentUser,
    userDisplayName,
    userAvatarUrl,
    
    // 方法
    updatePreferences,
    loadPreferences,
    resetPreferences,
    clearError,
    recordActivity,
    getUserActivities,
    clearActivities
  }
})