<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="text-9xl mb-4">⚠️</div>
        <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">500</h1>
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">服务器错误</h2>
        <p class="text-gray-600 dark:text-gray-400">
          抱歉，服务器遇到了一些问题，我们正在努力修复
        </p>
      </div>

      <div class="space-y-3">
        <button
          @click="retry"
          class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          重试
        </button>
        <button
          @click="goHome"
          class="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          返回首页
        </button>
      </div>

      <div class="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">可能的原因：</h3>
        <ul class="text-sm text-gray-600 dark:text-gray-400 text-left space-y-1">
          <li>• 服务器正在维护</li>
          <li>• 网络连接问题</li>
          <li>• 请求超时</li>
          <li>• 系统临时故障</li>
        </ul>
      </div>

      <div class="mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>如果问题持续存在，请联系技术支持</p>
        <p class="mt-2">support@example.com</p>
        <p class="mt-2">错误代码: ERR_SERVER_ERROR_500</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const notificationStore = useNotificationStore()

const retry = () => {
  notificationStore.addNotification({
    type: 'info',
    title: '正在重试',
    message: '正在重新加载页面...'
  })
  
  setTimeout(() => {
    window.location.reload()
  }, 500)
}

const goHome = () => {
  router.push('/dashboard')
}
</script>

