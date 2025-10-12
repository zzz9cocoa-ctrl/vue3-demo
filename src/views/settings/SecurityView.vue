<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">安全设置</h2>
    
    <div class="space-y-8">
      <!-- 修改密码 -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">修改密码</h3>
        <form @submit.prevent="handleChangePassword" class="space-y-4 max-w-md">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">当前密码</label>
            <input
              v-model="passwordForm.current"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">新密码</label>
            <input
              v-model="passwordForm.new"
              type="password"
              required
              minlength="8"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">至少8个字符</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">确认新密码</label>
            <input
              v-model="passwordForm.confirm"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            更新密码
          </button>
        </form>
      </div>

      <!-- 登录会话 -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">活动会话</h3>
        <div class="space-y-3">
          <div
            v-for="session in activeSessions"
            :key="session.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="flex items-center gap-4">
              <div class="text-3xl">{{ session.deviceIcon }}</div>
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ session.device }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">{{ session.location }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-500">最后活动: {{ session.lastActive }}</div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span
                v-if="session.current"
                class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-semibold"
              >
                当前设备
              </span>
              <button
                v-else
                @click="handleRevokeSession(session)"
                class="px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded text-sm"
              >
                注销
              </button>
            </div>
          </div>
        </div>
        <button
          @click="handleRevokeAllSessions"
          class="mt-4 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg text-sm"
        >
          注销所有其他会话
        </button>
      </div>

      <!-- 登录历史 -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">登录历史</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">时间</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">设备</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">位置</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">IP地址</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">状态</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="log in loginHistory" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3 text-gray-900 dark:text-white">{{ log.time }}</td>
                <td class="px-4 py-3 text-gray-900 dark:text-white">{{ log.device }}</td>
                <td class="px-4 py-3 text-gray-900 dark:text-white">{{ log.location }}</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs">{{ log.ip }}</td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 rounded text-xs font-semibold"
                    :class="log.success
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    "
                  >
                    {{ log.success ? '成功' : '失败' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

interface Session {
  id: string
  device: string
  location: string
  lastActive: string
  deviceIcon: string
  current: boolean
}

const activeSessions = ref<Session[]>([
  {
    id: '1',
    device: 'MacBook Pro - Chrome',
    location: '北京, 中国',
    lastActive: '2分钟前',
    deviceIcon: '💻',
    current: true
  },
  {
    id: '2',
    device: 'iPhone 15 - Safari',
    location: '上海, 中国',
    lastActive: '2小时前',
    deviceIcon: '📱',
    current: false
  }
])

const loginHistory = ref([
  { id: '1', time: '2024-01-15 10:30', device: 'MacBook Pro', location: '北京', ip: '192.168.1.1', success: true },
  { id: '2', time: '2024-01-15 09:15', device: 'iPhone 15', location: '上海', ip: '192.168.1.2', success: true },
  { id: '3', time: '2024-01-14 22:00', device: 'Unknown Device', location: '广州', ip: '192.168.1.3', success: false },
  { id: '4', time: '2024-01-14 18:30', device: 'MacBook Pro', location: '北京', ip: '192.168.1.1', success: true }
])

const handleChangePassword = () => {
  if (passwordForm.new !== passwordForm.confirm) {
    notificationStore.addNotification({
      type: 'error',
      title: '密码不匹配',
      message: '两次输入的新密码不一致'
    })
    return
  }

  notificationStore.addNotification({
    type: 'success',
    title: '密码已更新',
    message: '您的密码已成功更改'
  })

  passwordForm.current = ''
  passwordForm.new = ''
  passwordForm.confirm = ''
}

const handleRevokeSession = (session: Session): void => {
  if (confirm(`确定要注销设备 ${session.device} 吗？`)) {
    activeSessions.value = activeSessions.value.filter((s: Session) => s.id !== session.id)
    notificationStore.addNotification({
      type: 'success',
      title: '会话已注销',
      message: `设备 ${session.device} 已被注销`
    })
  }
}

const handleRevokeAllSessions = (): void => {
  if (confirm('确定要注销所有其他设备吗？')) {
    activeSessions.value = activeSessions.value.filter((s: Session) => s.current)
    notificationStore.addNotification({
      type: 'success',
      title: '已注销所有会话',
      message: '所有其他设备已被注销'
    })
  }
}
</script>

