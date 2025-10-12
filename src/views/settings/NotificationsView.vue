<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">通知设置</h2>
    
    <div class="space-y-6">
      <!-- 邮件通知 -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">邮件通知</h3>
        <div class="space-y-3">
          <div
            v-for="option in emailNotifications"
            :key="option.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ option.label }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ option.description }}</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="option.enabled" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- 推送通知 -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">推送通知</h3>
        <div class="space-y-3">
          <div
            v-for="option in pushNotifications"
            :key="option.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ option.label }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ option.description }}</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="option.enabled" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- 系统通知 -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">系统通知</h3>
        <div class="space-y-3">
          <div
            v-for="option in systemNotifications"
            :key="option.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ option.label }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ option.description }}</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="option.enabled" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          重置
        </button>
        <button
          @click="handleSave"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          保存设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()

const emailNotifications = ref([
  { id: 'task-assigned', label: '任务分配', description: '当有新任务分配给您时', enabled: true },
  { id: 'task-due', label: '任务截止提醒', description: '任务即将到期时提醒您', enabled: true },
  { id: 'task-completed', label: '任务完成', description: '您的任务被标记为完成时', enabled: false },
  { id: 'comment', label: '评论通知', description: '有人在任务中@您或回复您的评论', enabled: true }
])

const pushNotifications = ref([
  { id: 'mention', label: '被提及', description: '有人在讨论中提到您', enabled: true },
  { id: 'update', label: '任务更新', description: '您关注的任务有更新', enabled: true },
  { id: 'deadline', label: '截止日期', description: '任务即将到期前1小时提醒', enabled: true }
])

const systemNotifications = ref([
  { id: 'maintenance', label: '系统维护', description: '系统维护和更新通知', enabled: true },
  { id: 'features', label: '新功能', description: '新功能和产品更新通知', enabled: true },
  { id: 'newsletter', label: '资讯简报', description: '接收产品资讯和使用技巧', enabled: false }
])

const handleSave = () => {
  notificationStore.addNotification({
    type: 'success',
    title: '设置已保存',
    message: '通知设置已更新'
  })
}
</script>

