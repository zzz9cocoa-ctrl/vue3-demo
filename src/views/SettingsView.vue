<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">设置</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 侧边栏导航 -->
        <div class="lg:col-span-1">
          <nav class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-1">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="`/settings/${item.path}`"
              class="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              active-class="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
            >
              {{ item.title }}
            </router-link>
          </nav>
        </div>

        <!-- 内容区域 -->
        <div class="lg:col-span-3">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const menuItems = ref([
  { path: 'profile', title: '个人资料' },
  { path: 'account', title: '账户设置' },
  { path: 'notifications', title: '通知设置' },
  { path: 'security', title: '安全设置' },
  { path: 'admin', title: '系统管理' }
])
</script>

