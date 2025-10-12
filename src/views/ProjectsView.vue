<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">项目</h1>
        <button
          @click="showAddProject = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 新建项目
        </button>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="projects.length === 0" class="text-center py-12">
        <div class="text-gray-400 dark:text-gray-500 text-lg mb-4">还没有项目</div>
        <button
          @click="showAddProject = true"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          创建第一个项目
        </button>
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="project in projects"
          :key="project.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          @click="handleProjectClick(project)"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ project.name }}</h3>
            <span
              class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="{
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': project.status === 'active',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': project.status === 'planning',
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': project.status === 'completed',
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': project.status === 'archived'
              }"
            >
              {{ getStatusText(project.status) }}
            </span>
          </div>
          
          <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{{ project.description }}</p>
          
          <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>{{ project.taskCount || 0 }} 个任务</span>
            <span>{{ project.memberCount || 0 }} 个成员</span>
          </div>
          
          <div class="mt-4 flex justify-between items-center">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              创建于 {{ new Date(project.createdAt).toLocaleDateString('zh-CN') }}
            </div>
            <div class="flex -space-x-2">
              <div
                v-for="i in Math.min(project.memberCount || 0, 3)"
                :key="i"
                class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-semibold"
              >
                U{{ i }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 新建项目对话框 -->
      <div v-if="showAddProject" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">新建项目</h2>
            <button @click="showAddProject = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
              ✕
            </button>
          </div>
          
          <form @submit.prevent="handleAddProject" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">项目名称</label>
              <input
                v-model="newProject.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">描述</label>
              <textarea
                v-model="newProject.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
            
            <div class="flex gap-2 justify-end">
              <button
                type="button"
                @click="showAddProject = false"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                创建
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const notificationStore = useNotificationStore()

const loading = ref(false)
const showAddProject = ref(false)
const projects = ref<any[]>([])
const newProject = ref({
  name: '',
  description: ''
})

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: '进行中',
    planning: '计划中',
    completed: '已完成',
    archived: '已归档'
  }
  return statusMap[status] || status
}

const handleProjectClick = (project: any) => {
  notificationStore.addNotification({
    type: 'info',
    title: '项目详情',
    message: '项目详情页面开发中...'
  })
}

const handleAddProject = () => {
  const project = {
    id: Date.now().toString(),
    ...newProject.value,
    status: 'planning',
    taskCount: 0,
    memberCount: 1,
    createdAt: new Date().toISOString()
  }
  
  projects.value.push(project)
  
  notificationStore.addNotification({
    type: 'success',
    title: '项目已创建',
    message: `项目"${project.name}"创建成功`
  })
  
  newProject.value = { name: '', description: '' }
  showAddProject.value = false
}

onMounted(async () => {
  loading.value = true
  try {
    // 模拟加载项目数据
    await new Promise(resolve => setTimeout(resolve, 500))
    projects.value = [
      {
        id: '1',
        name: '示例项目',
        description: '这是一个示例项目，用于演示项目管理功能',
        status: 'active',
        taskCount: 5,
        memberCount: 3,
        createdAt: new Date().toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
})
</script>

