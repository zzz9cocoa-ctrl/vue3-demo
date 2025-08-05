<template>
  <div class="dashboard">
    <!-- 页面头部 -->
    <div class="dashboard__header">
      <div class="dashboard__title-section">
        <h1 class="dashboard__title">仪表盘</h1>
        <p class="dashboard__subtitle">欢迎使用Vue3 + TypeScript教学项目</p>
      </div>
      <div class="dashboard__actions">
        <button 
          @click="themeStore.toggleTheme()" 
          class="btn btn-secondary"
        >
          {{ themeStore.isDark ? '🌞' : '🌙' }} 
          {{ themeStore.isDark ? '浅色' : '深色' }}主题
        </button>
        <button 
          @click="showCreateTask = true" 
          class="btn btn-primary"
        >
          ➕ 创建任务
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="dashboard__stats">
      <div class="stat-card">
        <div class="stat-card__icon">📋</div>
        <div class="stat-card__content">
          <div class="stat-card__value">{{ taskStats.total }}</div>
          <div class="stat-card__label">总任务数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card__icon">✅</div>
        <div class="stat-card__content">
          <div class="stat-card__value">{{ taskStats.completed }}</div>
          <div class="stat-card__label">已完成</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card__icon">🔄</div>
        <div class="stat-card__content">
          <div class="stat-card__value">{{ taskStats.inProgress }}</div>
          <div class="stat-card__label">进行中</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-card__icon">⚠️</div>
        <div class="stat-card__content">
          <div class="stat-card__value">{{ taskStats.overdue }}</div>
          <div class="stat-card__label">已逾期</div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="dashboard__content">
      <!-- 最近任务 -->
      <div class="dashboard__section">
        <div class="section-header">
          <h2 class="section-title">最近任务</h2>
          <router-link to="/tasks" class="section-link">查看全部</router-link>
        </div>
        
        <div class="task-list" v-if="recentTasks.length > 0">
          <TaskCard
            v-for="task in recentTasks"
            :key="task.id"
            :task="task"
            @click="handleTaskClick"
            @edit="handleTaskEdit"
            @delete="handleTaskDelete"
          />
        </div>
        
        <div v-else class="empty-state">
          <div class="empty-state__icon">📝</div>
          <div class="empty-state__title">暂无任务</div>
          <div class="empty-state__description">创建你的第一个任务开始管理工作</div>
          <button @click="showCreateTask = true" class="btn btn-primary">
            创建任务
          </button>
        </div>
      </div>

      <!-- 项目特性展示 -->
      <div class="dashboard__section">
        <div class="section-header">
          <h2 class="section-title">项目特性</h2>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-card__icon">⚡</div>
            <h3 class="feature-card__title">Composition API</h3>
            <p class="feature-card__description">
              使用Vue3最新的Composition API，提供更好的逻辑复用和类型推导
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-card__icon">🔒</div>
            <h3 class="feature-card__title">TypeScript</h3>
            <p class="feature-card__description">
              完整的类型系统，严格的类型检查，提升代码质量和开发体验
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-card__icon">📦</div>
            <h3 class="feature-card__title">Pinia状态管理</h3>
            <p class="feature-card__description">
              现代化的状态管理库，提供更好的开发体验和TypeScript支持
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-card__icon">🎨</div>
            <h3 class="feature-card__title">Tailwind CSS</h3>
            <p class="feature-card__description">
              原子化CSS框架，快速构建现代化的用户界面
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-card__icon">🔧</div>
            <h3 class="feature-card__title">自定义Hooks</h3>
            <p class="feature-card__description">
              封装可复用的逻辑，包括表单处理、异步操作、本地存储等
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-card__icon">🛡️</div>
            <h3 class="feature-card__title">路由守卫</h3>
            <p class="feature-card__description">
              完整的权限控制系统，包括认证检查和角色权限管理
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务创建弹窗 -->
    <div v-if="showCreateTask" class="modal-overlay" @click="showCreateTask = false">
      <div class="modal-content" @click.stop>
        <TaskForm
          @close="showCreateTask = false"
          @success="handleTaskCreated"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/tasks'
import { useThemeStore } from '@/stores/theme'
import { useNotificationStore } from '@/stores/notifications'
import TaskCard from '@/components/TaskCard.vue'
import TaskForm from '@/components/TaskForm.vue'
import type { Task } from '@/types'
import { TaskStatus, TaskPriority } from '@/types'

// 路由和状态管理
const router = useRouter()
const taskStore = useTaskStore()
const themeStore = useThemeStore()
const notificationStore = useNotificationStore()

// 本地状态
const showCreateTask = ref(false)

// 模拟数据（在实际应用中这些数据会从API获取）
const mockTasks: Task[] = [
  {
    id: '1',
    title: '学习Vue3 Composition API',
    description: '深入学习Vue3的Composition API，包括ref、reactive、computed等核心概念',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    tags: ['学习', 'Vue3'],
    subtasks: [
      {
        id: '1-1',
        title: '阅读官方文档',
        completed: true,
        taskId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '1-2',
        title: '实践代码示例',
        completed: false,
        taskId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    attachments: [],
    comments: [],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    estimatedHours: 8,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: '实现TypeScript类型系统',
    description: '为项目添加完整的TypeScript类型定义',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.MEDIUM,
    tags: ['TypeScript', '类型系统'],
    subtasks: [],
    attachments: [],
    comments: [],
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    title: '设计响应式布局',
    description: '使用Tailwind CSS创建响应式的用户界面',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    tags: ['UI', 'Tailwind'],
    subtasks: [],
    attachments: [],
    comments: [],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
]

// 计算属性
const recentTasks = computed(() => {
  return mockTasks.slice(0, 3)
})

const taskStats = computed(() => {
  const total = mockTasks.length
  const completed = mockTasks.filter(task => task.status === TaskStatus.COMPLETED).length
  const inProgress = mockTasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length
  const overdue = mockTasks.filter(task => 
    task.dueDate && 
    task.dueDate < new Date() && 
    task.status !== TaskStatus.COMPLETED
  ).length

  return { total, completed, inProgress, overdue }
})

// 方法
const handleTaskClick = (task: Task): void => {
  router.push(`/tasks/${task.id}`)
}

const handleTaskEdit = (task: Task): void => {
  notificationStore.info('编辑任务', `正在编辑任务: ${task.title}`)
}

const handleTaskDelete = (task: Task): void => {
  notificationStore.warning('删除任务', `任务 "${task.title}" 已删除`)
}

const handleTaskCreated = (task: Task): void => {
  notificationStore.success('任务创建成功', `任务 "${task.title}" 已创建`)
  showCreateTask.value = false
}

// 生命周期
onMounted(() => {
  // 显示欢迎消息
  setTimeout(() => {
    notificationStore.success(
      '欢迎使用',
      '这是一个Vue3 + TypeScript教学项目，展示了现代前端开发的最佳实践'
    )
  }, 1000)
})
</script>

<style scoped>
.dashboard {
  @apply min-h-screen bg-gray-50 dark:bg-gray-900;
}

.dashboard__header {
  @apply bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-8;
  @apply flex justify-between items-start;
}

.dashboard__title-section {
  @apply flex-1;
}

.dashboard__title {
  @apply text-3xl font-bold text-gray-900 dark:text-white mb-2;
}

.dashboard__subtitle {
  @apply text-gray-600 dark:text-gray-300;
}

.dashboard__actions {
  @apply flex gap-3;
}

.dashboard__stats {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6;
}

.stat-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6;
  @apply flex items-center gap-4 transition-all duration-200 hover:shadow-md;
}

.stat-card__icon {
  @apply text-3xl;
}

.stat-card__content {
  @apply flex-1;
}

.stat-card__value {
  @apply text-2xl font-bold text-gray-900 dark:text-white;
}

.stat-card__label {
  @apply text-sm text-gray-600 dark:text-gray-300;
}

.dashboard__content {
  @apply px-6 pb-6 space-y-8;
}

.dashboard__section {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6;
}

.section-header {
  @apply flex justify-between items-center mb-6;
}

.section-title {
  @apply text-xl font-semibold text-gray-900 dark:text-white;
}

.section-link {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors;
}

.task-list {
  @apply grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4;
}

.empty-state {
  @apply text-center py-12;
}

.empty-state__icon {
  @apply text-6xl mb-4;
}

.empty-state__title {
  @apply text-xl font-semibold text-gray-900 dark:text-white mb-2;
}

.empty-state__description {
  @apply text-gray-600 dark:text-gray-300 mb-6;
}

.features-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.feature-card {
  @apply bg-gray-50 dark:bg-gray-700 rounded-lg p-6 transition-all duration-200 hover:shadow-md;
}

.feature-card__icon {
  @apply text-3xl mb-4;
}

.feature-card__title {
  @apply text-lg font-semibold text-gray-900 dark:text-white mb-2;
}

.feature-card__description {
  @apply text-gray-600 dark:text-gray-300 text-sm;
}

.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
  @apply w-full max-w-2xl max-h-[90vh] overflow-hidden;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard__header {
    @apply flex-col gap-4;
  }
  
  .dashboard__actions {
    @apply w-full justify-end;
  }
  
  .dashboard__stats {
    @apply grid-cols-2;
  }
  
  .features-grid {
    @apply grid-cols-1;
  }
}
</style>