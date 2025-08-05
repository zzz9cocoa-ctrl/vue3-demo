import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'

// API基础URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 添加认证token
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    // 添加请求ID用于追踪
    config.headers['X-Request-ID'] = generateRequestId()

    console.log(`API请求: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API响应: ${response.status} ${response.config.url}`)
    return response
  },
  async (error) => {
    const notificationStore = useNotificationStore()
    const authStore = useAuthStore()

    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // 未授权，清除认证信息并重定向到登录页
          await authStore.logout()
          notificationStore.addNotification({
            type: 'error',
            title: '认证失败',
            message: '您的登录已过期，请重新登录'
          })
          break

        case 403:
          // 权限不足
          notificationStore.addNotification({
            type: 'error',
            title: '权限不足',
            message: '您没有执行此操作的权限'
          })
          break

        case 404:
          // 资源不存在
          notificationStore.addNotification({
            type: 'error',
            title: '资源不存在',
            message: '请求的资源不存在'
          })
          break

        case 422:
          // 验证错误
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat().join(', ')
            notificationStore.addNotification({
              type: 'error',
              title: '验证失败',
              message: errorMessages
            })
          }
          break

        case 429:
          // 请求过于频繁
          notificationStore.addNotification({
            type: 'warning',
            title: '请求过于频繁',
            message: '请稍后再试'
          })
          break

        case 500:
          // 服务器错误
          notificationStore.addNotification({
            type: 'error',
            title: '服务器错误',
            message: '服务器内部错误，请稍后重试'
          })
          break

        default:
          // 其他错误
          notificationStore.addNotification({
            type: 'error',
            title: '请求失败',
            message: data.message || '未知错误'
          })
      }
    } else if (error.request) {
      // 网络错误
      notificationStore.addNotification({
        type: 'error',
        title: '网络错误',
        message: '无法连接到服务器，请检查网络连接'
      })
    } else {
      // 其他错误
      notificationStore.addNotification({
        type: 'error',
        title: '请求错误',
        message: error.message || '请求配置错误'
      })
    }

    console.error('API错误:', error)
    return Promise.reject(error)
  }
)

// 生成请求ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// API请求方法封装
export const api = {
  // GET请求
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config)
    return response.data.data || response.data
  },

  // POST请求
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config)
    return response.data.data || response.data
  },

  // PUT请求
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config)
    return response.data.data || response.data
  },

  // PATCH请求
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config)
    return response.data.data || response.data
  },

  // DELETE请求
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config)
    return response.data.data || response.data
  },

  // 文件上传
  upload: async <T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      }
    })

    return response.data.data || response.data
  },

  // 文件下载
  download: async (url: string, filename?: string): Promise<void> => {
    const response = await apiClient.get(url, {
      responseType: 'blob'
    })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }
}

// 导出axios实例供特殊用途
export { apiClient }
export default api