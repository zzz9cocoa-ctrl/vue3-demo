<template>
  <div
    class="task-card"
    :class="{
      'task-card--completed': task.status === TaskStatus.COMPLETED,
      'task-card--overdue': isOverdue,
      'task-card--high-priority': task.priority === TaskPriority.HIGH || task.priority === TaskPriority.URGENT
    }"
    @click="handleCardClick"
  >
    <!-- 任务头部 -->
    <div class="task-card__header">
      <div class="task-card__priority">
        <PriorityBadge :priority="task.priority" />
      </div>
      <div class="task-card__actions">
        <button
          class="task-card__action-btn"
          @click.stop="toggleFavorite"
          :title="isFavorite ? '取消收藏' : '收藏'"
        >
          <Heart :class="{ 'filled': isFavorite }" />
        </button>
        <button
          class="task-card__action-btn"
          @click.stop="showMenu = !showMenu"
          title="更多选项"
        >
          <MoreVertical />
        </button>
        
        <!-- 下拉菜单 -->
        <div v-if="showMenu" class="task-card__menu" @click.stop>
          <button @click="handleEdit">编辑</button>
          <button @click="handleDuplicate">复制</button>
          <button @click="handleDelete" class="danger">删除</button>
        </div>
      </div>
    </div>

    <!-- 任务内容 -->
    <div class="task-card__content">
      <h3 class="task-card__title">{{ task.title }}</h3>
      <p v-if="task.description" class="task-card__description">
        {{ truncatedDescription }}
      </p>
      
      <!-- 标签 -->
      <div v-if="task.tags.length" class="task-card__tags">
        <span
          v-for="tag in task.tags"
          :key="tag"
          class="task-card__tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- 任务进度 -->
    <div v-if="task.subtasks.length" class="task-card__progress">
      <div class="task-card__progress-bar">
        <div
          class="task-card__progress-fill"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      <span class="task-card__progress-text">
        {{ completedSubtasks }}/{{ task.subtasks.length }} 子任务
      </span>
    </div>

    <!-- 任务底部信息 -->
    <div class="task-card__footer">
      <div class="task-card__meta">
        <!-- 截止日期 -->
        <div v-if="task.dueDate" class="task-card__due-date" :class="{ 'overdue': isOverdue }">
          <Calendar :size="16" />
          <span>{{ formatDueDate }}</span>
        </div>
        
        <!-- 分配者 -->
        <div v-if="task.assignee" class="task-card__assignee">
          <UserAvatar :user="task.assignee" :size="24" />
          <span>{{ task.assignee.username }}</span>
        </div>
      </div>

      <!-- 状态切换 -->
      <div class="task-card__status">
        <StatusSelect
          :value="task.status"
          @update:value="handleStatusChange"
          :loading="isUpdating"
        />
      </div>
    </div>

    <!-- 加载状态覆盖层 -->
    <div v-if="isUpdating" class="task-card__loading">
      <Loader class="spin" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Heart, MoreVertical, Calendar, Loader } from 'lucide-vue-next'
import type { Task } from '@/types'
import { TaskStatus, TaskPriority } from '@/types'
import { useTaskStore } from '@/stores/tasks'
import { useNotificationStore } from '@/stores/notifications'
import PriorityBadge from './PriorityBadge.vue'
import StatusSelect from './StatusSelect.vue'
import UserAvatar from './UserAvatar.vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// Props定义
interface Props {
  task: Task
  maxDescriptionLength?: number
  showProgress?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxDescriptionLength: 100,
  showProgress: true,
  clickable: true
})

// Emits定义
interface Emits {
  (e: 'click', task: Task): void
  (e: 'edit', task: Task): void
  (e: 'delete', task: Task): void
  (e: 'duplicate', task: Task): void
  (e: 'favorite-toggle', task: Task, isFavorite: boolean): void
}

const emit = defineEmits<Emits>()

// 状态管理
const taskStore = useTaskStore()
const notificationStore = useNotificationStore()

// 本地状态
const showMenu = ref(false)
const isFavorite = ref(false)
const isUpdating = ref(false)

// 计算属性
const truncatedDescription = computed(() => {
  if (!props.task.description) return ''
  if (props.task.description.length <= props.maxDescriptionLength) {
    return props.task.description
  }
  return props.task.description.slice(0, props.maxDescriptionLength) + '...'
})

const completedSubtasks = computed(() => {
  return props.task.subtasks.filter(subtask => subtask.completed).length
})

const progressPercentage = computed(() => {
  if (props.task.subtasks.length === 0) return 0
  return Math.round((completedSubtasks.value / props.task.subtasks.length) * 100)
})

const isOverdue = computed(() => {
  if (!props.task.dueDate) return false
  const now = new Date()
  return props.task.dueDate < now && props.task.status !== TaskStatus.COMPLETED
})

const formatDueDate = computed(() => {
  if (!props.task.dueDate) return ''
  return formatDistanceToNow(props.task.dueDate, {
    addSuffix: true,
    locale: zhCN
  })
})

// 方法
const handleCardClick = (): void => {
  if (props.clickable) {
    emit('click', props.task)
  }
}

const handleEdit = (): void => {
  showMenu.value = false
  emit('edit', props.task)
}

const handleDelete = (): void => {
  showMenu.value = false
  emit('delete', props.task)
}

const handleDuplicate = (): void => {
  showMenu.value = false
  emit('duplicate', props.task)
}

const toggleFavorite = (): void => {
  isFavorite.value = !isFavorite.value
  emit('favorite-toggle', props.task, isFavorite.value)
}

const handleStatusChange = async (newStatus: TaskStatus): Promise<void> => {
  if (newStatus === props.task.status) return

  isUpdating.value = true
  
  try {
    const success = await taskStore.updateTaskStatus(props.task.id, newStatus)
    
    if (success) {
      notificationStore.addNotification({
        type: 'success',
        title: '任务状态已更新',
        message: `任务"${props.task.title}"的状态已更新为${getStatusText(newStatus)}`
      })
    } else {
      notificationStore.addNotification({
        type: 'error',
        title: '更新失败',
        message: '任务状态更新失败，请重试'
      })
    }
  } catch (error) {
    console.error('Status update error:', error)
    notificationStore.addNotification({
      type: 'error',
      title: '更新失败',
      message: '任务状态更新失败，请重试'
    })
  } finally {
    isUpdating.value = false
  }
}

const getStatusText = (status: TaskStatus): string => {
  const statusMap = {
    [TaskStatus.TODO]: '待办',
    [TaskStatus.IN_PROGRESS]: '进行中',
    [TaskStatus.COMPLETED]: '已完成',
    [TaskStatus.CANCELLED]: '已取消'
  }
  return statusMap[status] || status
}

// 点击外部关闭菜单
const handleClickOutside = (event: Event): void => {
  const target = event.target as Element
  if (!target.closest('.task-card__menu') && !target.closest('.task-card__action-btn')) {
    showMenu.value = false
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 暴露给模板的数据和方法
defineExpose({
  task: props.task,
  isUpdating,
  handleStatusChange
})
</script>

<style scoped>
.task-card {
  @apply relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 hover:shadow-md cursor-pointer;
}

.task-card--completed {
  @apply opacity-75;
}

.task-card--overdue {
  @apply border-red-300 bg-red-50;
}

.task-card--high-priority {
  @apply border-l-4 border-l-red-500;
}

.task-card__header {
  @apply flex justify-between items-start mb-3;
}

.task-card__actions {
  @apply relative flex gap-1;
}

.task-card__action-btn {
  @apply p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors;
}

.task-card__menu {
  @apply absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-10;
}

.task-card__menu button {
  @apply w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors;
}

.task-card__menu button.danger {
  @apply text-red-600 hover:bg-red-50;
}

.task-card__content {
  @apply mb-4;
}

.task-card__title {
  @apply font-semibold text-gray-900 mb-2 line-clamp-2;
}

.task-card__description {
  @apply text-sm text-gray-600 mb-3 line-clamp-3;
}

.task-card__tags {
  @apply flex flex-wrap gap-1;
}

.task-card__tag {
  @apply inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full;
}

.task-card__progress {
  @apply mb-4;
}

.task-card__progress-bar {
  @apply w-full bg-gray-200 rounded-full h-2 mb-2;
}

.task-card__progress-fill {
  @apply bg-blue-500 h-2 rounded-full transition-all duration-300;
}

.task-card__progress-text {
  @apply text-xs text-gray-500;
}

.task-card__footer {
  @apply flex justify-between items-center;
}

.task-card__meta {
  @apply flex flex-col gap-2;
}

.task-card__due-date {
  @apply flex items-center gap-2 text-sm text-gray-500;
}

.task-card__due-date.overdue {
  @apply text-red-600;
}

.task-card__assignee {
  @apply flex items-center gap-2 text-sm text-gray-600;
}

.task-card__loading {
  @apply absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg;
}

.filled {
  @apply text-red-500 fill-current;
}

.spin {
  @apply animate-spin;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .task-card {
    @apply p-3;
  }
  
  .task-card__title {
    @apply text-sm;
  }
  
  .task-card__description {
    @apply text-xs;
  }
  
  .task-card__footer {
    @apply flex-col items-start gap-2;
  }
}
</style>