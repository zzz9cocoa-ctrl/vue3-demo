<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">账户设置</h2>
    
    <!-- 账户信息 -->
    <div class="space-y-6 mb-8">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">账户信息</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span class="text-gray-600 dark:text-gray-400">用户ID</span>
            <span class="text-gray-900 dark:text-white font-mono">{{ userId }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span class="text-gray-600 dark:text-gray-400">注册时间</span>
            <span class="text-gray-900 dark:text-white">{{ registrationDate }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span class="text-gray-600 dark:text-gray-400">账户类型</span>
            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-semibold">
              {{ accountType }}
            </span>
          </div>
        </div>
      </div>

      <!-- 主题设置 -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">主题设置</h3>
        <div class="flex gap-4">
          <button
            v-for="theme in themes"
            :key="theme.value"
            @click="handleThemeChange(theme.value)"
            class="flex-1 p-4 border-2 rounded-lg transition-all"
            :class="currentTheme === theme.value
              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            "
          >
            <div class="text-2xl mb-2">{{ theme.icon }}</div>
            <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ theme.label }}</div>
          </button>
        </div>
      </div>

      <!-- 邮箱验证 -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">邮箱验证</h3>
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">邮箱验证状态</div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">已验证的邮箱可以用于找回密码</div>
          </div>
          <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-semibold">
            已验证
          </span>
        </div>
      </div>

      <!-- 双因素认证 -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">双因素认证</h3>
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">增强账户安全性</div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">启用后需要验证码才能登录</div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="twoFactorEnabled" class="sr-only peer" />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <!-- 危险操作 -->
      <div>
        <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">危险操作</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">注销账户</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">永久删除您的账户和所有数据</div>
            </div>
            <button
              @click="handleDeleteAccount"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              注销账户
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useNotificationStore } from '@/stores/notifications'

const themeStore = useThemeStore()
const notificationStore = useNotificationStore()

const userId = ref('USER_12345678')
const registrationDate = ref('2024年1月15日')
const accountType = ref('专业版')
const twoFactorEnabled = ref(false)
const currentTheme = ref(themeStore.theme)

const themes = [
  { value: 'light', label: '浅色', icon: '☀️' },
  { value: 'dark', label: '深色', icon: '🌙' },
  { value: 'auto', label: '跟随系统', icon: '💻' }
]

const handleThemeChange = (theme: string) => {
  currentTheme.value = theme
  themeStore.setTheme(theme)
  notificationStore.addNotification({
    type: 'success',
    title: '主题已更改',
    message: `已切换到${themes.find(t => t.value === theme)?.label}主题`
  })
}

const handleDeleteAccount = () => {
  if (confirm('确定要注销账户吗？此操作不可撤销！')) {
    notificationStore.addNotification({
      type: 'warning',
      title: '账户注销',
      message: '账户注销功能开发中...'
    })
  }
}
</script>

