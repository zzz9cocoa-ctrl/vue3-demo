import { defineStore } from 'pinia'
import { ref, computed, watch, readonly } from 'vue'
import type { 
  Task, 
  TaskFilters, 
  PaginatedResponse,
  ID,
  Subtask,
  Comment
} from '@/types'
import { TaskStatus, TaskPriority } from '@/types'
import { taskApi } from '@/api/tasks'

export const useTaskStore = defineStore('tasks', () => {
  // 状态
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const isLoading = ref(false)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)
  const error = ref<string | null>(null)
  
  // 过滤和分页状态
  const filters = ref<TaskFilters>({})
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalTasks = ref(0)
  const sortBy = ref<string>('createdAt')
  const sortOrder = ref<'asc' | 'desc'>('desc')

  // 计算属性
  const filteredTasks = computed(() => {
    let result = tasks.value

    // 应用过滤器
    if (filters.value.status?.length) {
      result = result.filter(task => 
        filters.value.status!.includes(task.status)
      )
    }

    if (filters.value.priority?.length) {
      result = result.filter(task => 
        filters.value.priority!.includes(task.priority)
      )
    }

    if (filters.value.assigneeId?.length) {
      result = result.filter(task => 
        task.assigneeId && filters.value.assigneeId!.includes(task.assigneeId)
      )
    }

    if (filters.value.categoryId?.length) {
      result = result.filter(task => 
        task.categoryId && filters.value.categoryId!.includes(task.categoryId)
      )
    }

    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    if (filters.value.tags?.length) {
      result = result.filter(task => 
        filters.value.tags!.some(tag => task.tags.includes(tag))
      )
    }

    if (filters.value.dueDateFrom) {
      result = result.filter(task => 
        task.dueDate && task.dueDate >= filters.value.dueDateFrom!
      )
    }

    if (filters.value.dueDateTo) {
      result = result.filter(task => 
        task.dueDate && task.dueDate <= filters.value.dueDateTo!
      )
    }

    return result
  })

  const tasksByStatus = computed(() => {
    return {
      todo: filteredTasks.value.filter(task => task.status === TaskStatus.TODO),
      inProgress: filteredTasks.value.filter(task => task.status === TaskStatus.IN_PROGRESS),
      completed: filteredTasks.value.filter(task => task.status === TaskStatus.COMPLETED),
      cancelled: filteredTasks.value.filter(task => task.status === TaskStatus.CANCELLED)
    }
  })

  const tasksByPriority = computed(() => {
    return {
      urgent: filteredTasks.value.filter(task => task.priority === TaskPriority.URGENT),
      high: filteredTasks.value.filter(task => task.priority === TaskPriority.HIGH),
      medium: filteredTasks.value.filter(task => task.priority === TaskPriority.MEDIUM),
      low: filteredTasks.value.filter(task => task.priority === TaskPriority.LOW)
    }
  })

  const overdueTasks = computed(() => {
    const now = new Date()
    return filteredTasks.value.filter(task => 
      task.dueDate && 
      task.dueDate < now && 
      task.status !== TaskStatus.COMPLETED
    )
  })

  const completionRate = computed(() => {
    if (filteredTasks.value.length === 0) return 0
    const completed = filteredTasks.value.filter(task => 
      task.status === TaskStatus.COMPLETED
    ).length
    return Math.round((completed / filteredTasks.value.length) * 100)
  })

  const totalPages = computed(() => 
    Math.ceil(totalTasks.value / pageSize.value)
  )

  // 动作
  const fetchTasks = async (refresh = false): Promise<void> => {
    if (refresh) {
      currentPage.value = 1
    }

    isLoading.value = true
    error.value = null

    try {
      const response: PaginatedResponse<Task> = await taskApi.getTasks({
        page: currentPage.value,
        pageSize: pageSize.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
        ...filters.value
      })

      if (refresh) {
        tasks.value = response.data
      } else {
        tasks.value.push(...response.data)
      }

      totalTasks.value = response.total
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取任务失败'
    } finally {
      isLoading.value = false
    }
  }

  const fetchTaskById = async (id: ID): Promise<Task | null> => {
    isLoading.value = true
    error.value = null

    try {
      const task = await taskApi.getTaskById(id)
      currentTask.value = task
      
      // 更新本地任务列表
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = task
      }

      return task
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取任务详情失败'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task | null> => {
    isCreating.value = true
    error.value = null

    try {
      const newTask = await taskApi.createTask(taskData)
      tasks.value.unshift(newTask)
      totalTasks.value += 1
      return newTask
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建任务失败'
      return null
    } finally {
      isCreating.value = false
    }
  }

  const updateTask = async (id: ID, updates: Partial<Task>): Promise<boolean> => {
    isUpdating.value = true
    error.value = null

    try {
      const updatedTask = await taskApi.updateTask(id, updates)
      
      // 更新本地状态
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }

      if (currentTask.value?.id === id) {
        currentTask.value = updatedTask
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新任务失败'
      return false
    } finally {
      isUpdating.value = false
    }
  }

  const deleteTask = async (id: ID): Promise<boolean> => {
    isDeleting.value = true
    error.value = null

    try {
      await taskApi.deleteTask(id)
      
      // 从本地状态中移除
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value.splice(index, 1)
        totalTasks.value -= 1
      }

      if (currentTask.value?.id === id) {
        currentTask.value = null
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除任务失败'
      return false
    } finally {
      isDeleting.value = false
    }
  }

  const updateTaskStatus = async (id: ID, status: TaskStatus): Promise<boolean> => {
    const updates: Partial<Task> = { status }
    
    if (status === TaskStatus.COMPLETED) {
      updates.completedAt = new Date()
    }

    return updateTask(id, updates)
  }

  const addSubtask = async (taskId: ID, subtaskData: Omit<Subtask, 'id' | 'createdAt' | 'updatedAt' | 'taskId'>): Promise<boolean> => {
    try {
      const subtask = await taskApi.addSubtask(taskId, subtaskData)
      
      const task = tasks.value.find(t => t.id === taskId)
      if (task) {
        task.subtasks.push(subtask)
      }

      if (currentTask.value?.id === taskId) {
        currentTask.value.subtasks.push(subtask)
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '添加子任务失败'
      return false
    }
  }

  const updateSubtask = async (taskId: ID, subtaskId: ID, updates: Partial<Subtask>): Promise<boolean> => {
    try {
      const updatedSubtask = await taskApi.updateSubtask(subtaskId, updates)
      
      const task = tasks.value.find(t => t.id === taskId)
      if (task) {
        const subtaskIndex = task.subtasks.findIndex(s => s.id === subtaskId)
        if (subtaskIndex !== -1) {
          task.subtasks[subtaskIndex] = updatedSubtask
        }
      }

      if (currentTask.value?.id === taskId) {
        const subtaskIndex = currentTask.value.subtasks.findIndex(s => s.id === subtaskId)
        if (subtaskIndex !== -1) {
          currentTask.value.subtasks[subtaskIndex] = updatedSubtask
        }
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新子任务失败'
      return false
    }
  }

  const addComment = async (taskId: ID, content: string): Promise<boolean> => {
    try {
      const comment = await taskApi.addComment(taskId, content)
      
      const task = tasks.value.find(t => t.id === taskId)
      if (task) {
        task.comments.push(comment)
      }

      if (currentTask.value?.id === taskId) {
        currentTask.value.comments.push(comment)
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '添加评论失败'
      return false
    }
  }

  // 过滤器管理
  const updateFilters = (newFilters: Partial<TaskFilters>): void => {
    filters.value = { ...filters.value, ...newFilters }
    currentPage.value = 1
  }

  const clearFilters = (): void => {
    filters.value = {}
    currentPage.value = 1
  }

  const setSorting = (field: string, order: 'asc' | 'desc'): void => {
    sortBy.value = field
    sortOrder.value = order
    currentPage.value = 1
  }

  const setCurrentTask = (task: Task | null): void => {
    currentTask.value = task
  }

  const clearError = (): void => {
    error.value = null
  }

  // 监听过滤器变化，自动重新获取数据
  watch(
    [filters, sortBy, sortOrder],
    () => {
      fetchTasks(true)
    },
    { deep: true }
  )

  return {
    // 状态
    tasks: readonly(tasks),
    currentTask: readonly(currentTask),
    isLoading: readonly(isLoading),
    isCreating: readonly(isCreating),
    isUpdating: readonly(isUpdating),
    isDeleting: readonly(isDeleting),
    error: readonly(error),
    filters: readonly(filters),
    currentPage: readonly(currentPage),
    pageSize: readonly(pageSize),
    totalTasks: readonly(totalTasks),
    sortBy: readonly(sortBy),
    sortOrder: readonly(sortOrder),

    // 计算属性
    filteredTasks,
    tasksByStatus,
    tasksByPriority,
    overdueTasks,
    completionRate,
    totalPages,

    // 动作
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    addSubtask,
    updateSubtask,
    addComment,
    updateFilters,
    clearFilters,
    setSorting,
    setCurrentTask,
    clearError
  }
})

export type TaskStore = ReturnType<typeof useTaskStore>