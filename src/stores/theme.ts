import { defineStore } from 'pinia'
import { ref, computed, watch, readonly } from 'vue'
import type { ThemeConfig } from '@/types'
import { useLocalStorage } from '@/composables/useLocalStorage'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const [isDark, setIsDark] = useLocalStorage('theme-dark', false)
  const [primaryColor, setPrimaryColor] = useLocalStorage('theme-primary-color', '#3b82f6')
  
  // 计算属性
  const currentTheme = computed(() => isDark.value ? 'dark' : 'light')
  
  const themeConfig = computed<ThemeConfig>(() => ({
    primaryColor: primaryColor.value,
    secondaryColor: isDark.value ? '#9ca3af' : '#6b7280',
    backgroundColor: isDark.value ? '#111827' : '#ffffff',
    textColor: isDark.value ? '#f9fafb' : '#111827',
    borderColor: isDark.value ? '#374151' : '#e5e7eb',
    shadowColor: isDark.value ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'
  }))

  // 方法
  const toggleTheme = (): void => {
    setIsDark(!isDark.value)
  }

  const setTheme = (theme: 'light' | 'dark'): void => {
    setIsDark(theme === 'dark')
  }

  const updatePrimaryColor = (color: string): void => {
    setPrimaryColor(color)
  }

  // 应用主题到DOM
  const applyTheme = (): void => {
    const root = document.documentElement
    
    // 设置主题属性
    root.setAttribute('data-theme', currentTheme.value)
    
    // 更新CSS变量
    root.style.setProperty('--color-primary', themeConfig.value.primaryColor)
    root.style.setProperty('--color-secondary', themeConfig.value.secondaryColor)
    root.style.setProperty('--color-background', themeConfig.value.backgroundColor)
    root.style.setProperty('--color-text', themeConfig.value.textColor)
    root.style.setProperty('--color-border', themeConfig.value.borderColor)
    root.style.setProperty('--shadow-color', themeConfig.value.shadowColor)
    
    // 更新body类名
    if (isDark.value) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }

  // 初始化主题
  const initializeTheme = (): void => {
    // 检查系统偏好
    if (!localStorage.getItem('theme-dark')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
    }
    
    applyTheme()
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme-dark')) {
        setIsDark(e.matches)
      }
    })
  }

  // 监听主题变化
  watch([isDark, primaryColor], () => {
    applyTheme()
  })

  return {
    isDark: readonly(isDark),
    currentTheme,
    themeConfig,
    primaryColor: readonly(primaryColor),
    toggleTheme,
    setTheme,
    updatePrimaryColor,
    initializeTheme
  }
})