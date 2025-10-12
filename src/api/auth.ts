import api from './index'
import type { User, ApiResponse } from '@/types'
import type { LoginForm, RegisterForm } from '@/stores/auth'
import { UserRole } from '@/types'

// 模拟API开关 - 当没有后端服务器时使用模拟数据
const USE_MOCK_API = true

// 模拟延迟
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// 生成模拟用户数据
const generateMockUser = (email: string, username: string): User => ({
  id: Date.now().toString(),
  username,
  email,
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=3b82f6&color=fff`,
  role: UserRole.USER,
  isActive: true,
  preferences: {
    theme: 'light',
    language: 'zh-CN',
    notifications: true,
    emailNotifications: true
  },
  createdAt: new Date(),
  updatedAt: new Date()
})

// 生成模拟token
const generateMockToken = () => {
  return 'mock_token_' + Math.random().toString(36).substring(2, 15)
}

export const authApi = {
  // 登录
  login: async (credentials: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> => {
    if (USE_MOCK_API) {
      await mockDelay()
      const user = generateMockUser(credentials.email, credentials.email.split('@')[0])
      const token = generateMockToken()
      return {
        success: true,
        data: { user, token },
        message: '登录成功'
      }
    }
    return api.post('/auth/login', credentials)
  },

  // 注册
  register: async (userData: RegisterForm): Promise<ApiResponse<{ user: User; token: string }>> => {
    if (USE_MOCK_API) {
      await mockDelay()
      const user = generateMockUser(userData.email, userData.username)
      const token = generateMockToken()
      return {
        success: true,
        data: { user, token },
        message: '注册成功'
      }
    }
    return api.post('/auth/register', userData)
  },

  // 登出
  logout: async (): Promise<void> => {
    if (USE_MOCK_API) {
      await mockDelay(200)
      return
    }
    return api.post('/auth/logout')
  },

  // 刷新token
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    if (USE_MOCK_API) {
      await mockDelay(200)
      return {
        success: true,
        data: { token: generateMockToken() },
        message: 'Token刷新成功'
      }
    }
    return api.post('/auth/refresh')
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<User> => {
    if (USE_MOCK_API) {
      await mockDelay()
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        return JSON.parse(storedUser)
      }
      throw new Error('未登录')
    }
    return api.get('/auth/me')
  },

  // 更新用户资料
  updateProfile: async (profileData: Partial<User>): Promise<ApiResponse<User>> => {
    if (USE_MOCK_API) {
      await mockDelay()
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        const updatedUser = { ...user, ...profileData }
        return {
          success: true,
          data: updatedUser,
          message: '资料更新成功'
        }
      }
      throw new Error('未登录')
    }
    return api.patch('/auth/profile', profileData)
  },

  // 修改密码
  changePassword: async (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): Promise<void> => {
    if (USE_MOCK_API) {
      await mockDelay()
      return
    }
    return api.post('/auth/change-password', data)
  },

  // 忘记密码
  forgotPassword: async (email: string): Promise<void> => {
    if (USE_MOCK_API) {
      await mockDelay()
      return
    }
    return api.post('/auth/forgot-password', { email })
  },

  // 重置密码
  resetPassword: async (data: {
    token: string
    password: string
    confirmPassword: string
  }): Promise<void> => {
    if (USE_MOCK_API) {
      await mockDelay()
      return
    }
    return api.post('/auth/reset-password', data)
  },

  // 验证邮箱
  verifyEmail: async (token: string): Promise<void> => {
    if (USE_MOCK_API) {
      await mockDelay()
      return
    }
    return api.post('/auth/verify-email', { token })
  },

  // 重新发送验证邮件
  resendVerificationEmail: async (): Promise<void> => {
    if (USE_MOCK_API) {
      await mockDelay()
      return
    }
    return api.post('/auth/resend-verification')
  }
}