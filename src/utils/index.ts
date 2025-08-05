// 日期工具函数
export const dateUtils = {
  // 格式化日期
  format: (date: Date | string, format = 'YYYY-MM-DD'): string => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
  },

  // 相对时间
  fromNow: (date: Date | string): string => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}天前`
    if (hours > 0) return `${hours}小时前`
    if (minutes > 0) return `${minutes}分钟前`
    return '刚刚'
  },

  // 是否是今天
  isToday: (date: Date | string): boolean => {
    const d = new Date(date)
    const today = new Date()
    return d.toDateString() === today.toDateString()
  },

  // 是否是昨天
  isYesterday: (date: Date | string): boolean => {
    const d = new Date(date)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return d.toDateString() === yesterday.toDateString()
  },

  // 获取日期范围
  getDateRange: (start: Date, end: Date): Date[] => {
    const dates = []
    const current = new Date(start)
    
    while (current <= end) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return dates
  }
}

// 字符串工具函数
export const stringUtils = {
  // 首字母大写
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },

  // 驼峰命名转换
  camelCase: (str: string): string => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  },

  // 短横线命名转换
  kebabCase: (str: string): string => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  },

  // 截断文本
  truncate: (str: string, length: number, suffix = '...'): string => {
    if (str.length <= length) return str
    return str.slice(0, length) + suffix
  },

  // 移除HTML标签
  stripHtml: (str: string): string => {
    return str.replace(/<[^>]*>/g, '')
  },

  // 生成随机字符串
  random: (length = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  // 转义HTML
  escapeHtml: (str: string): string => {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }
}

// 数字工具函数
export const numberUtils = {
  // 格式化数字
  format: (num: number, decimals = 0): string => {
    return num.toLocaleString('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  },

  // 格式化文件大小
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // 生成随机数
  random: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  // 限制数字范围
  clamp: (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max)
  },

  // 四舍五入到指定小数位
  round: (num: number, decimals = 0): number => {
    return Number(Math.round(Number(num + 'e' + decimals)) + 'e-' + decimals)
  }
}

// 数组工具函数
export const arrayUtils = {
  // 去重
  unique: <T>(arr: T[]): T[] => {
    return [...new Set(arr)]
  },

  // 分组
  groupBy: <T>(arr: T[], key: keyof T): Record<string, T[]> => {
    return arr.reduce((groups, item) => {
      const group = String(item[key])
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {} as Record<string, T[]>)
  },

  // 排序
  sortBy: <T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
    return [...arr].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      if (aVal < bVal) return order === 'asc' ? -1 : 1
      if (aVal > bVal) return order === 'asc' ? 1 : -1
      return 0
    })
  },

  // 分页
  paginate: <T>(arr: T[], page: number, pageSize: number): T[] => {
    const start = (page - 1) * pageSize
    return arr.slice(start, start + pageSize)
  },

  // 随机打乱
  shuffle: <T>(arr: T[]): T[] => {
    const result = [...arr]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]]
    }
    return result
  },

  // 查找差异
  difference: <T>(arr1: T[], arr2: T[]): T[] => {
    return arr1.filter(item => !arr2.includes(item))
  },

  // 交集
  intersection: <T>(arr1: T[], arr2: T[]): T[] => {
    return arr1.filter(item => arr2.includes(item))
  }
}

// 对象工具函数
export const objectUtils = {
  // 深拷贝
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as any
    if (obj instanceof Array) return obj.map(item => objectUtils.deepClone(item)) as any
    if (typeof obj === 'object') {
      const clonedObj = {} as any
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = objectUtils.deepClone(obj[key])
        }
      }
      return clonedObj
    }
    return obj
  },

  // 深度合并
  deepMerge: <T>(target: T, ...sources: Partial<T>[]): T => {
    if (!sources.length) return target
    const source = sources.shift()

    if (objectUtils.isObject(target) && objectUtils.isObject(source)) {
      for (const key in source) {
        if (objectUtils.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} })
          objectUtils.deepMerge(target[key], source[key])
        } else {
          Object.assign(target, { [key]: source[key] })
        }
      }
    }

    return objectUtils.deepMerge(target, ...sources)
  },

  // 检查是否为对象
  isObject: (item: any): boolean => {
    return item && typeof item === 'object' && !Array.isArray(item)
  },

  // 获取嵌套属性值
  get: (obj: any, path: string, defaultValue?: any): any => {
    const keys = path.split('.')
    let result = obj

    for (const key of keys) {
      if (result == null) return defaultValue
      result = result[key]
    }

    return result !== undefined ? result : defaultValue
  },

  // 设置嵌套属性值
  set: (obj: any, path: string, value: any): void => {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    let current = obj

    for (const key of keys) {
      if (!(key in current) || !objectUtils.isObject(current[key])) {
        current[key] = {}
      }
      current = current[key]
    }

    current[lastKey] = value
  },

  // 移除属性
  omit: <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> => {
    const result = { ...obj }
    keys.forEach(key => delete result[key])
    return result
  },

  // 选择属性
  pick: <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> => {
    const result = {} as Pick<T, K>
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key]
      }
    })
    return result
  }
}

// URL工具函数
export const urlUtils = {
  // 构建查询字符串
  buildQuery: (params: Record<string, any>): string => {
    const query = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => query.append(key, String(v)))
        } else {
          query.append(key, String(value))
        }
      }
    })
    
    return query.toString()
  },

  // 解析查询字符串
  parseQuery: (search: string): Record<string, string | string[]> => {
    const params = new URLSearchParams(search)
    const result: Record<string, string | string[]> = {}
    
    for (const [key, value] of params.entries()) {
      if (result[key]) {
        if (Array.isArray(result[key])) {
          (result[key] as string[]).push(value)
        } else {
          result[key] = [result[key] as string, value]
        }
      } else {
        result[key] = value
      }
    }
    
    return result
  },

  // 获取文件扩展名
  getFileExtension: (url: string): string => {
    return url.split('.').pop()?.toLowerCase() || ''
  },

  // 检查是否为有效URL
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}

// 验证工具函数
export const validationUtils = {
  // 邮箱验证
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // 手机号验证
  isPhone: (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  },

  // 身份证验证
  isIdCard: (idCard: string): boolean => {
    const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return idCardRegex.test(idCard)
  },

  // URL验证
  isUrl: (url: string): boolean => {
    return urlUtils.isValidUrl(url)
  },

  // 密码强度验证
  isStrongPassword: (password: string): boolean => {
    // 至少8位，包含大小写字母、数字和特殊字符
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return strongPasswordRegex.test(password)
  },

  // 中文验证
  isChinese: (text: string): boolean => {
    const chineseRegex = /^[\u4e00-\u9fa5]+$/
    return chineseRegex.test(text)
  }
}

// 浏览器工具函数
export const browserUtils = {
  // 获取浏览器信息
  getBrowserInfo: () => {
    const ua = navigator.userAgent
    const browsers = {
      chrome: /Chrome/i.test(ua) && !/Edge/i.test(ua),
      firefox: /Firefox/i.test(ua),
      safari: /Safari/i.test(ua) && !/Chrome/i.test(ua),
      edge: /Edge/i.test(ua),
      ie: /MSIE|Trident/i.test(ua)
    }
    
    return Object.keys(browsers).find(key => browsers[key as keyof typeof browsers]) || 'unknown'
  },

  // 检查是否为移动设备
  isMobile: (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },

  // 复制到剪贴板
  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  },

  // 全屏
  requestFullscreen: (element: Element = document.documentElement): void => {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    }
  },

  // 退出全屏
  exitFullscreen: (): void => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  },

  // 检查是否支持某个特性
  supports: (feature: string): boolean => {
    return feature in window
  }
}

// 性能工具函数
export const performanceUtils = {
  // 防抖
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(null, args), wait)
    }
  },

  // 节流
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },

  // 延迟执行
  delay: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  // 测量执行时间
  measureTime: async <T>(fn: () => Promise<T> | T): Promise<{ result: T; time: number }> => {
    const start = performance.now()
    const result = await fn()
    const time = performance.now() - start
    return { result, time }
  }
}