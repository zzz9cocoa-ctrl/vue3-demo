<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="text-9xl mb-4">🚫</div>
        <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">403</h1>
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">访问被拒绝</h2>
        <p class="text-gray-600 dark:text-gray-400">
          抱歉，您没有权限访问此页面
        </p>
      </div>

      <div class="space-y-3">
        <button
          @click="goBack"
          class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          返回上一页
        </button>
        <button
          @click="goHome"
          class="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          返回首页
        </button>
      </div>

      <div class="mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>如果您认为这是一个错误，请联系管理员</p>
        <p class="mt-2">错误代码: ERR_FORBIDDEN_403</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/dashboard')
}
</script>

