<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">帮助中心</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">有任何问题？我们随时为您提供帮助</p>
      </div>

      <!-- 搜索框 -->
      <div class="mb-12">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索帮助文档..."
            class="w-full px-6 py-4 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:bg-gray-800 dark:text-white text-lg"
          />
          <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
        </div>
      </div>

      <!-- 常见问题 -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">常见问题</h2>
        <div class="space-y-4">
          <div
            v-for="(faq, index) in filteredFaqs"
            :key="index"
            class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ faq.question }}</span>
              <span class="text-2xl text-gray-400 transform transition-transform" :class="{ 'rotate-180': faq.open }">
                ↓
              </span>
            </button>
            <div v-if="faq.open" class="px-6 pb-6 text-gray-600 dark:text-gray-400">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>

      <!-- 功能指南 -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">功能指南</h2>
        <div class="grid gap-6 md:grid-cols-2">
          <div
            v-for="guide in guides"
            :key="guide.title"
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
            @click="handleGuideClick(guide)"
          >
            <div class="text-4xl mb-4">{{ guide.icon }}</div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ guide.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ guide.description }}</p>
          </div>
        </div>
      </div>

      <!-- 联系支持 -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white text-center">
        <h2 class="text-2xl font-bold mb-4">还有其他问题？</h2>
        <p class="mb-6 opacity-90">我们的支持团队随时为您提供帮助</p>
        <div class="flex gap-4 justify-center flex-wrap">
          <button
            @click="handleContactSupport"
            class="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            联系支持团队
          </button>
          <button
            @click="handleSendFeedback"
            class="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            发送反馈
          </button>
        </div>
      </div>

      <!-- 快速链接 -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">快速链接</h2>
        <div class="grid gap-4 md:grid-cols-3">
          <a
            v-for="link in quickLinks"
            :key="link.title"
            :href="link.url"
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow flex items-center gap-3"
          >
            <span class="text-2xl">{{ link.icon }}</span>
            <div>
              <div class="font-semibold text-gray-900 dark:text-white">{{ link.title }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">{{ link.description }}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()

const searchQuery = ref('')

interface Faq {
  question: string
  answer: string
  open: boolean
}

const faqs = ref<Faq[]>([
  {
    question: '如何创建新任务？',
    answer: '点击任务管理页面右上角的"新建任务"按钮，填写任务信息后点击保存即可创建新任务。',
    open: false
  },
  {
    question: '如何邀请团队成员？',
    answer: '进入团队页面，点击"邀请成员"按钮，输入对方的邮箱地址，系统会自动发送邀请邮件。',
    open: false
  },
  {
    question: '如何修改任务优先级？',
    answer: '打开任务详情页面，点击优先级标签即可选择新的优先级级别。',
    open: false
  },
  {
    question: '如何导出数据？',
    answer: '管理员用户可以在设置-系统管理页面中找到数据导出功能，支持导出所有系统数据。',
    open: false
  },
  {
    question: '如何重置密码？',
    answer: '在登录页面点击"忘记密码"，输入注册邮箱，系统会发送重置密码的链接到您的邮箱。',
    open: false
  }
])

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs.value
  
  const query = searchQuery.value.toLowerCase()
  return faqs.value.filter((faq: Faq) =>
    faq.question.toLowerCase().includes(query) ||
    faq.answer.toLowerCase().includes(query)
  )
})

const guides = ref([
  {
    icon: '📝',
    title: '任务管理基础',
    description: '学习如何创建、编辑和管理任务'
  },
  {
    icon: '👥',
    title: '团队协作',
    description: '了解如何与团队成员高效协作'
  },
  {
    icon: '📊',
    title: '数据分析',
    description: '查看项目进度和团队绩效分析'
  },
  {
    icon: '⚙️',
    title: '系统设置',
    description: '自定义您的工作空间和偏好设置'
  }
])

const quickLinks = ref([
  {
    icon: '📖',
    title: '用户手册',
    description: '完整的使用文档',
    url: '#'
  },
  {
    icon: '🎥',
    title: '视频教程',
    description: '观看操作演示',
    url: '#'
  },
  {
    icon: '💡',
    title: '最佳实践',
    description: '效率提升技巧',
    url: '#'
  }
])

interface Guide {
  icon: string
  title: string
  description: string
}

const toggleFaq = (index: number): void => {
  const faq = faqs.value[index]
  if (faq) {
    faq.open = !faq.open
  }
}

const handleGuideClick = (guide: Guide): void => {
  notificationStore.addNotification({
    type: 'info',
    title: guide.title,
    message: '该功能指南正在开发中...'
  })
}

const handleContactSupport = () => {
  notificationStore.addNotification({
    type: 'info',
    title: '联系支持',
    message: '支持邮箱: support@example.com'
  })
}

const handleSendFeedback = () => {
  notificationStore.addNotification({
    type: 'success',
    title: '感谢您的反馈',
    message: '我们会认真考虑您的建议'
  })
}
</script>

