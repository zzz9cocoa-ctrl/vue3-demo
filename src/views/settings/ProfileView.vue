<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">个人资料</h2>
    
    <form @submit.prevent="handleSave" class="space-y-6">
      <!-- 头像 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">头像</label>
        <div class="flex items-center gap-4">
          <UserAvatar :name="form.name" :size="64" />
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            更改头像
          </button>
        </div>
      </div>

      <!-- 姓名 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">姓名</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        />
      </div>

      <!-- 邮箱 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">邮箱地址</label>
        <input
          v-model="form.email"
          type="email"
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        />
      </div>

      <!-- 手机号 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">手机号码</label>
        <input
          v-model="form.phone"
          type="tel"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        />
      </div>

      <!-- 个人简介 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">个人简介</label>
        <textarea
          v-model="form.bio"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        ></textarea>
      </div>

      <!-- 时区 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">时区</label>
        <select
          v-model="form.timezone"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option value="Asia/Shanghai">中国标准时间 (GMT+8)</option>
          <option value="America/New_York">美国东部时间 (GMT-5)</option>
          <option value="Europe/London">格林威治标准时间 (GMT)</option>
        </select>
      </div>

      <!-- 语言 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">语言</label>
        <select
          v-model="form.language"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option value="zh-CN">简体中文</option>
          <option value="zh-TW">繁体中文</option>
          <option value="en-US">English</option>
        </select>
      </div>

      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          取消
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          保存更改
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notifications'
import UserAvatar from '@/components/UserAvatar.vue'

const userStore = useUserStore()
const notificationStore = useNotificationStore()

const form = reactive({
  name: userStore.currentUser?.username || '',
  email: userStore.currentUser?.email || '',
  phone: '',
  bio: '',
  timezone: 'Asia/Shanghai',
  language: 'zh-CN'
})

const handleSave = async () => {
  await userStore.updatePreferences({
    language: form.language as 'zh-CN' | 'zh-TW' | 'en-US'
  })
  notificationStore.addNotification({
    type: 'success',
    title: '保存成功',
    message: '个人资料已更新'
  })
}
</script>

