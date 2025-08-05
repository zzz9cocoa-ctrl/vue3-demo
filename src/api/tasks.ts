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

export const taskApi = {
  // 获取任务列表
  getTasks: async (params: PaginationParams & TaskFilters): Promise<PaginatedResponse<Task>> => {
    return api.get('/tasks', { params })
  },

  // 获取任务详情
  getTaskById: async (id: ID): Promise<Task> => {
    return api.get(`/tasks/${id}`)
  },

  // 创建任务
  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    return api.post('/tasks', taskData)
  },

  // 更新任务
  updateTask: async (id: ID, updates: Partial<Task>): Promise<Task> => {
    return api.patch(`/tasks/${id}`, updates)
  },

  // 删除任务
  deleteTask: async (id: ID): Promise<void> => {
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