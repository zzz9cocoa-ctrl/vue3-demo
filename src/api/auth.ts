import api from './index'
import type { User, ApiResponse } from '@/types'
import type { LoginForm, RegisterForm } from '@/stores/auth'

export const authApi = {
  // 登录
  login: async (credentials: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> => {
    return api.post('/auth/login', credentials)
  },

  // 注册
  register: async (userData: RegisterForm): Promise<ApiResponse<{ user: User; token: string }>> => {
    return api.post('/auth/register', userData)
  },

  // 登出
  logout: async (): Promise<void> => {
    return api.post('/auth/logout')
  },

  // 刷新token
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    return api.post('/auth/refresh')
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<User> => {
    return api.get('/auth/me')
  },

  // 更新用户资料
  updateProfile: async (profileData: Partial<User>): Promise<ApiResponse<User>> => {
    return api.patch('/auth/profile', profileData)
  },

  // 修改密码
  changePassword: async (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): Promise<void> => {
    return api.post('/auth/change-password', data)
  },

  // 忘记密码
  forgotPassword: async (email: string): Promise<void> => {
    return api.post('/auth/forgot-password', { email })
  },

  // 重置密码
  resetPassword: async (data: {
    token: string
    password: string
    confirmPassword: string
  }): Promise<void> => {
    return api.post('/auth/reset-password', data)
  },

  // 验证邮箱
  verifyEmail: async (token: string): Promise<void> => {
    return api.post('/auth/verify-email', { token })
  },

  // 重新发送验证邮件
  resendVerificationEmail: async (): Promise<void> => {
    return api.post('/auth/resend-verification')
  }
}