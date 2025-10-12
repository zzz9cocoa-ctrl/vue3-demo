<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">任务管理</h1>
        <button
          @click="showAddTask = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 新建任务
        </button>
      </div>

      <!-- 过滤和搜索 -->
      <div class="mb-6 flex gap-4 flex-wrap">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索任务..."
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white flex-1 min-w-[200px]"
        />
        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
        >
          <option value="">所有状态</option>
          <option value="pending">待处理</option>
          <option value="in_progress">进行中</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
      </div>

      <!-- 任务列表 -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="filteredTasks.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
        没有找到任务
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TaskCard
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @click="handleTaskClick(task)"
        />
      </div>

      <!-- 新建任务对话框 -->
      <div v-if="showAddTask" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">新建任务</h2>
            <button @click="showAddTask = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
              ✕
            </button>
          </div>
          <TaskForm @submit="handleAddTask" @cancel="showAddTask = false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/tasks'
import TaskCard from '@/components/TaskCard.vue'
import TaskForm from '@/components/TaskForm.vue'
import type { Task } from '@/types'

const router = useRouter()
const taskStore = useTaskStore()

const loading = ref(false)
const showAddTask = ref(false)
const searchQuery = ref('')
const filterStatus = ref('')

const filteredTasks = computed(() => {
  let tasks = taskStore.tasks

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    tasks = tasks.filter((task: Task) => 
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    tasks = tasks.filter((task: Task) => task.status === filterStatus.value)
  }

  return tasks
})

const handleTaskClick = (task: Task): void => {
  router.push(`/tasks/${task.id}`)
}

const handleAddTask = async (taskData: Partial<Task>): Promise<void> => {
  await taskStore.createTask(taskData)
  showAddTask.value = false
}

onMounted(async () => {
  loading.value = true
  try {
    await taskStore.fetchTasks()
  } finally {
    loading.value = false
  }
})
</script>

