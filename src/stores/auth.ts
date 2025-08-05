import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { User, UserRole, ApiResponse } from '@/types'
import { authApi } from '@/api/auth'

// 登录表单类型
export interface LoginForm {
  email: string
  password: string
  remember?: boolean
}

// 注册表单类型
export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export const useAuthStore = defineStore('auth', () => {
  // 状态 (State)
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性 (Getters)
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === UserRole.ADMIN)
  const userInitials = computed(() => {
    if (!user.value) return ''
    const { username } = user.value
    return username
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  })

  // 动作 (Actions)
  const login = async (credentials: LoginForm): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response: ApiResponse<{ user: User; token: string }> = await authApi.login(credentials)
      
      if (response.success && response.data) {
        user.value = response.data.user
        token.value = response.data.token
        
        // 持久化存储
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        return true
      } else {
        error.value = response.message || '登录失败'
        return false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '网络错误'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterForm): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response: ApiResponse<{ user: User; token: string }> = await authApi.register(userData)
      
      if (response.success && response.data) {
        user.value = response.data.user
        token.value = response.data.token
        
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        return true
      } else {
        error.value = response.message || '注册失败'
        return false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '网络错误'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    isLoading.value = true

    try {
      if (token.value) {
        await authApi.logout()
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // 清除状态
      user.value = null
      token.value = null
      error.value = null
      
      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      isLoading.value = false
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    if (!token.value) return false

    try {
      const response: ApiResponse<{ token: string }> = await authApi.refreshToken()
      
      if (response.success && response.data) {
        token.value = response.data.token
        localStorage.setItem('token', response.data.token)
        return true
      }
      
      return false
    } catch (err) {
      console.error('Token refresh failed:', err)
      await logout()
      return false
    }
  }

  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    if (!user.value) return false

    isLoading.value = true
    error.value = null

    try {
      const response: ApiResponse<User> = await authApi.updateProfile(profileData)
      
      if (response.success && response.data) {
        user.value = { ...user.value, ...response.data }
        localStorage.setItem('user', JSON.stringify(user.value))
        return true
      } else {
        error.value = response.message || '更新失败'
        return false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '网络错误'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const initializeAuth = (): void => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser)
        token.value = storedToken
      } catch (err) {
        console.error('Failed to parse stored user data:', err)
        logout()
      }
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  // 检查权限
  const hasRole = (role: UserRole): boolean => {
    return user.value?.role === role
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user.value ? roles.includes(user.value.role) : false
  }

  return {
    // 状态
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // 计算属性
    isAuthenticated,
    isAdmin,
    userInitials,
    
    // 动作
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    initializeAuth,
    clearError,
    hasRole,
    hasAnyRole
  }
})

// 类型推导辅助
export type AuthStore = ReturnType<typeof useAuthStore>