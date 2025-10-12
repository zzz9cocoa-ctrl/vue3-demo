import api from './index'
import type { 
  Task, 
  Subtask, 
  Comment, 
  PaginatedResponse, 
  PaginationParams, 
  TaskFilters,
  ID 
} from '@/types'
import { TaskStatus, TaskPriority } from '@/types'

// 模拟API开关
const USE_MOCK_API = true

// 模拟延迟
const mockDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟任务数据存储
let mockTasks: Task[] = [
  {
    id: '1',
    title: '欢迎使用任务管理系统',
    description: '这是一个示例任务，您可以编辑或删除它',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tags: ['示例', '入门'],
    subtasks: [],
    attachments: [],
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: '完成项目文档',
    description: '编写项目的技术文档和用户手册',
    priority: TaskPriority.HIGH,
    status: TaskStatus.IN_PROGRESS,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    tags: ['文档', '重要'],
    subtasks: [],
    attachments: [],
    comments: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
]

export const taskApi = {
  // 获取任务列表
  getTasks: async (params: PaginationParams & TaskFilters): Promise<PaginatedResponse<Task>> => {
    if (USE_MOCK_API) {
      await mockDelay()
      let filteredTasks = [...mockTasks]
      
      // 应用过滤器
      if (params.status && params.status.length > 0) {
        filteredTasks = filteredTasks.filter(task => params.status?.includes(task.status))
      }
      if (params.priority && params.priority.length > 0) {
        filteredTasks = filteredTasks.filter(task => params.priority?.includes(task.priority))
      }
      if (params.search) {
        const search = params.search.toLowerCase()
        filteredTasks = filteredTasks.filter(task => 
          task.title.toLowerCase().includes(search) ||
          task.description?.toLowerCase().includes(search)
        )
      }
      
      return {
        data: filteredTasks,
        total: filteredTasks.length,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        totalPages: Math.ceil(filteredTasks.length / (params.pageSize || 20))
      }
    }
    return api.get('/tasks', { params })
  },

  // 获取任务详情
  getTaskById: async (id: ID): Promise<Task> => {
    if (USE_MOCK_API) {
      await mockDelay()
      const task = mockTasks.find(t => t.id === id)
      if (!task) throw new Error('任务不存在')
      return task
    }
    return api.get(`/tasks/${id}`)
  },

  // 创建任务
  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    if (USE_MOCK_API) {
      await mockDelay()
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockTasks.push(newTask)
      return newTask
    }
    return api.post('/tasks', taskData)
  },

  // 更新任务
  updateTask: async (id: ID, updates: Partial<Task>): Promise<Task> => {
    if (USE_MOCK_API) {
      await mockDelay()
      const index = mockTasks.findIndex(t => t.id === id)
      if (index === -1) throw new Error('任务不存在')
      mockTasks[index] = { ...mockTasks[index], ...updates, updatedAt: new Date() }
      return mockTasks[index]
    }
    return api.patch(`/tasks/${id}`, updates)
  },

  // 删除任务
  deleteTask: async (id: ID): Promise<void> => {
    if (USE_MOCK_API) {
      await mockDelay()
      mockTasks = mockTasks.filter(t => t.id !== id)
      return
    }
    return api.delete(`/tasks/${id}`)
  },

  // 批量删除任务
  deleteTasks: async (ids: ID[]): Promise<void> => {
    return api.post('/tasks/batch-delete', { ids })
  },

  // 复制任务
  duplicateTask: async (id: ID): Promise<Task> => {
    return api.post(`/tasks/${id}/duplicate`)
  },

  // 添加子任务
  addSubtask: async (taskId: ID, subtaskData: Omit<Subtask, 'id' | 'createdAt' | 'updatedAt' | 'taskId'>): Promise<Subtask> => {
    return api.post(`/tasks/${taskId}/subtasks`, subtaskData)
  },

  // 更新子任务
  updateSubtask: async (subtaskId: ID, updates: Partial<Subtask>): Promise<Subtask> => {
    return api.patch(`/subtasks/${subtaskId}`, updates)
  },

  // 删除子任务
  deleteSubtask: async (subtaskId: ID): Promise<void> => {
    return api.delete(`/subtasks/${subtaskId}`)
  },

  // 添加评论
  addComment: async (taskId: ID, content: string): Promise<Comment> => {
    return api.post(`/tasks/${taskId}/comments`, { content })
  },

  // 更新评论
  updateComment: async (commentId: ID, content: string): Promise<Comment> => {
    return api.patch(`/comments/${commentId}`, { content })
  },

  // 删除评论
  deleteComment: async (commentId: ID): Promise<void> => {
    return api.delete(`/comments/${commentId}`)
  },

  // 上传附件
  uploadAttachment: async (taskId: ID, file: File, onProgress?: (progress: number) => void): Promise<any> => {
    return api.upload(`/tasks/${taskId}/attachments`, file, onProgress)
  },

  // 删除附件
  deleteAttachment: async (attachmentId: ID): Promise<void> => {
    return api.delete(`/attachments/${attachmentId}`)
  },

  // 获取任务统计
  getTaskStats: async (): Promise<{
    total: number
    completed: number
    inProgress: number
    overdue: number
    byPriority: Record<string, number>
    byStatus: Record<string, number>
  }> => {
    return api.get('/tasks/stats')
  },

  // 搜索任务
  searchTasks: async (query: string, filters?: TaskFilters): Promise<Task[]> => {
    return api.get('/tasks/search', { 
      params: { q: query, ...filters } 
    })
  },

  // 导出任务
  exportTasks: async (format: 'csv' | 'xlsx' | 'pdf', filters?: TaskFilters): Promise<void> => {
    return api.download('/tasks/export', `tasks.${format}`, {
      params: { format, ...filters }
    })
  }
}