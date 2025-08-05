// 基础类型定义
export type ID = string | number

// 任务优先级枚举
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// 任务状态枚举
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

// 基础实体接口
export interface BaseEntity {
  id: ID
  createdAt: Date
  updatedAt: Date
}

// 用户接口
export interface User extends BaseEntity {
  username: string
  email: string
  avatar?: string
  role: UserRole
  isActive: boolean
  preferences: UserPreferences
}

// 用户偏好设置
export interface UserPreferences {
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'
  notifications: boolean
  emailNotifications: boolean
}

// 任务接口
export interface Task extends BaseEntity {
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  dueDate?: Date
  assigneeId?: ID
  assignee?: User
  categoryId?: ID
  category?: Category
  tags: string[]
  subtasks: Subtask[]
  attachments: Attachment[]
  comments: Comment[]
  estimatedHours?: number
  actualHours?: number
  completedAt?: Date
}

// 子任务接口
export interface Subtask extends BaseEntity {
  title: string
  completed: boolean
  taskId: ID
}

// 分类接口
export interface Category extends BaseEntity {
  name: string
  color: string
  description?: string
  icon?: string
  parentId?: ID
  children?: Category[]
}

// 附件接口
export interface Attachment extends BaseEntity {
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  taskId: ID
}

// 评论接口
export interface Comment extends BaseEntity {
  content: string
  authorId: ID
  author?: User
  taskId: ID
  parentId?: ID
  replies?: Comment[]
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

// 分页参数
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 任务过滤器
export interface TaskFilters {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  assigneeId?: ID[]
  categoryId?: ID[]
  tags?: string[]
  dueDateFrom?: Date
  dueDateTo?: Date
  search?: string
}

// 表单验证规则
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'checkbox'
  rules?: ValidationRule[]
  options?: { label: string; value: any }[]
  placeholder?: string
  disabled?: boolean
}

// 通知类型
export interface Notification {
  id: ID
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  duration?: number
  actions?: Array<{
    label: string
    action: () => void
  }>
}

// 路由元信息
export interface RouteMeta {
  title?: string
  requiresAuth?: boolean
  roles?: UserRole[]
  icon?: string
  hidden?: boolean
}

// 菜单项
export interface MenuItem {
  id: string
  label: string
  icon?: string
  path?: string
  children?: MenuItem[]
  meta?: RouteMeta
}

// 主题配置
export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  borderColor: string
  shadowColor: string
}

// 组件Props类型工具
export type ComponentProps<T> = T extends new (...args: any[]) => infer P
  ? P extends { $props: infer Props }
    ? Props
    : never
  : never

// 事件处理器类型
export type EventHandler<T = Event> = (event: T) => void

// 异步函数类型
export type AsyncFunction<T = any, R = any> = (...args: T[]) => Promise<R>

// 深度只读类型
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// 可选字段类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// 必需字段类型
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] }