<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">系统管理</h2>
    
    <div class="space-y-8">
      <!-- 系统统计 -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">系统概览</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div class="text-sm opacity-90 mb-2">总用户数</div>
            <div class="text-3xl font-bold">1,234</div>
            <div class="text-xs opacity-75 mt-2">↑ 12% 比上月</div>
          </div>
          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div class="text-sm opacity-90 mb-2">活跃用户</div>
            <div class="text-3xl font-bold">892</div>
            <div class="text-xs opacity-75 mt-2">↑ 8% 比上月</div>
          </div>
          <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div class="text-sm opacity-90 mb-2">总任务数</div>
            <div class="text-3xl font-bold">5,678</div>
            <div class="text-xs opacity-75 mt-2">↑ 15% 比上月</div>
          </div>
        </div>
      </div>

      <!-- 用户管理 -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">用户管理</h3>
        <div class="space-y-3">
          <button
            @click="handleManageUsers"
            class="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div class="text-left">
              <div class="text-sm font-medium text-gray-900 dark:text-white">管理用户账户</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">查看、编辑和管理所有用户</div>
            </div>
            <span class="text-gray-400">→</span>
          </button>
          <button
            @click="handleManageRoles"
            class="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div class="text-left">
              <div class="text-sm font-medium text-gray-900 dark:text-white">角色和权限</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">配置用户角色和访问权限</div>
            </div>
            <span class="text-gray-400">→</span>
          </button>
        </div>
      </div>

      <!-- 系统设置 -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">系统配置</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">允许用户注册</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">开放用户自主注册功能</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="systemConfig.allowRegistration" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">邮件验证</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">要求新用户验证邮箱</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="systemConfig.requireEmailVerification" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">维护模式</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">启用后普通用户无法访问系统</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="systemConfig.maintenanceMode" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- 数据管理 -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">数据管理</h3>
        <div class="space-y-3">
          <button
            @click="handleExportData"
            class="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div class="text-left">
              <div class="text-sm font-medium text-gray-900 dark:text-white">导出数据</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">导出系统数据备份</div>
            </div>
            <span class="text-gray-400">↓</span>
          </button>
          <button
            @click="handleImportData"
            class="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div class="text-left">
              <div class="text-sm font-medium text-gray-900 dark:text-white">导入数据</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">从备份文件恢复数据</div>
            </div>
            <span class="text-gray-400">↑</span>
          </button>
        </div>
      </div>

      <!-- 系统日志 -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">系统日志</h3>
        <div class="bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 max-h-64 overflow-y-auto">
          <div v-for="log in systemLogs" :key="log.id" class="mb-1">
            <span class="text-gray-500">[{{ log.time }}]</span>
            <span :class="{
              'text-blue-400': log.level === 'info',
              'text-yellow-400': log.level === 'warning',
              'text-red-400': log.level === 'error'
            }">
              [{{ log.level.toUpperCase() }}]
            </span>
            <span class="text-green-400"> {{ log.message }}</span>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          @click="handleSaveConfig"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          保存配置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()

const systemConfig = reactive({
  allowRegistration: true,
  requireEmailVerification: true,
  maintenanceMode: false
})

const systemLogs = ref([
  { id: '1', time: '2024-01-15 10:30:15', level: 'info', message: 'User login successful: user@example.com' },
  { id: '2', time: '2024-01-15 10:29:42', level: 'info', message: 'Task created: Project planning meeting' },
  { id: '3', time: '2024-01-15 10:28:33', level: 'warning', message: 'Rate limit exceeded for IP: 192.168.1.100' },
  { id: '4', time: '2024-01-15 10:27:18', level: 'info', message: 'Database backup completed successfully' },
  { id: '5', time: '2024-01-15 10:25:50', level: 'error', message: 'Failed to send email notification to user@example.com' }
])

const handleManageUsers = () => {
  notificationStore.addNotification({
    type: 'info',
    title: '用户管理',
    message: '用户管理功能开发中...'
  })
}

const handleManageRoles = () => {
  notificationStore.addNotification({
    type: 'info',
    title: '角色管理',
    message: '角色管理功能开发中...'
  })
}

const handleExportData = () => {
  notificationStore.addNotification({
    type: 'success',
    title: '数据导出',
    message: '数据导出已开始，完成后将通知您'
  })
}

const handleImportData = () => {
  notificationStore.addNotification({
    type: 'info',
    title: '数据导入',
    message: '数据导入功能开发中...'
  })
}

const handleSaveConfig = () => {
  notificationStore.addNotification({
    type: 'success',
    title: '配置已保存',
    message: '系统配置已更新'
  })
}
</script>

