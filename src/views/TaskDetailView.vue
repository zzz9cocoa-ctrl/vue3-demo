<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <button
          @click="router.back()"
          class="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
        >
          ← 返回
        </button>
        
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="task" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ task.title }}</h1>
              <div class="flex gap-3 items-center">
                <PriorityBadge :priority="task.priority" />
                <StatusSelect :status="task.status" @change="handleStatusChange" />
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="editing = true"
                class="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
              >
                编辑
              </button>
              <button
                @click="handleDelete"
                class="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
              >
                删除
              </button>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">描述</h3>
              <p class="text-gray-900 dark:text-white whitespace-pre-wrap">{{ task.description || '无描述' }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">截止日期</h3>
                <p class="text-gray-900 dark:text-white">
                  {{ task.dueDate ? new Date(task.dueDate).toLocaleDateString('zh-CN') : '无' }}
                </p>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">创建时间</h3>
                <p class="text-gray-900 dark:text-white">
                  {{ new Date(task.createdAt).toLocaleDateString('zh-CN') }}
                </p>
              </div>
            </div>

            <div v-if="task.tags && task.tags.length > 0">
              <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">标签</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in task.tags"
                  :key="tag"
                  class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
          任务不存在
        </div>
      </div>

      <!-- 编辑对话框 -->
      <div v-if="editing && task" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">编辑任务</h2>
            <button @click="editing = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
              ✕
            </button>
          </div>
          <TaskForm :initial-data="task" @submit="handleUpdate" @cancel="editing = false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTaskStore } from '@/stores/tasks'
import { useNotificationStore } from '@/stores/notifications'
import PriorityBadge from '@/components/PriorityBadge.vue'
import StatusSelect from '@/components/StatusSelect.vue'
import TaskForm from '@/components/TaskForm.vue'

const router = useRouter()
const route = useRoute()
const taskStore = useTaskStore()
const notificationStore = useNotificationStore()

const task = ref<any>(null)
const loading = ref(false)
const editing = ref(false)

const handleStatusChange = async (newStatus: string) => {
  if (task.value) {
    await taskStore.updateTask(task.value.id, { status: newStatus })
    task.value.status = newStatus
  }
}

const handleUpdate = async (taskData: any) => {
  if (task.value) {
    await taskStore.updateTask(task.value.id, taskData)
    task.value = { ...task.value, ...taskData }
    editing.value = false
  }
}

const handleDelete = async () => {
  if (task.value && confirm('确定要删除这个任务吗？')) {
    await taskStore.deleteTask(task.value.id)
    notificationStore.addNotification({
      type: 'success',
      title: '任务已删除',
      message: '任务已成功删除'
    })
    router.push('/tasks')
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const taskId = route.params.id as string
    task.value = await taskStore.fetchTaskById(taskId)
  } finally {
    loading.value = false
  }
})
</script>

