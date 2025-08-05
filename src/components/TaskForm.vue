<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <div class="task-form__header">
      <h2 class="task-form__title">
        {{ isEditing ? '编辑任务' : '创建新任务' }}
      </h2>
      <button
        type="button"
        @click="handleCancel"
        class="task-form__close"
        :disabled="formState.isSubmitting"
      >
        <X />
      </button>
    </div>

    <div class="task-form__body">
      <!-- 基本信息 -->
      <div class="task-form__section">
        <h3 class="task-form__section-title">基本信息</h3>
        
        <!-- 任务标题 -->
        <div class="form-field">
          <label for="title" class="form-field__label">
            任务标题 <span class="required">*</span>
          </label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            class="form-field__input"
            :class="{ 'error': getFieldState('title').error.length }"
            placeholder="请输入任务标题"
            @blur="setFieldTouched('title')"
            :disabled="formState.isSubmitting"
          />
          <div v-if="getFieldState('title').error.length" class="form-field__error">
            {{ getFieldState('title').error[0] }}
          </div>
        </div>

        <!-- 任务描述 -->
        <div class="form-field">
          <label for="description" class="form-field__label">任务描述</label>
          <textarea
            id="description"
            v-model="formData.description"
            class="form-field__textarea"
            :class="{ 'error': getFieldState('description').error.length }"
            placeholder="请输入任务描述"
            rows="4"
            @blur="setFieldTouched('description')"
            :disabled="formState.isSubmitting"
          ></textarea>
          <div v-if="getFieldState('description').error.length" class="form-field__error">
            {{ getFieldState('description').error[0] }}
          </div>
        </div>
      </div>

      <!-- 任务属性 -->
      <div class="task-form__section">
        <h3 class="task-form__section-title">任务属性</h3>
        
        <div class="task-form__row">
          <!-- 优先级 -->
          <div class="form-field">
            <label for="priority" class="form-field__label">
              优先级 <span class="required">*</span>
            </label>
            <select
              id="priority"
              v-model="formData.priority"
              class="form-field__select"
              :class="{ 'error': getFieldState('priority').error.length }"
              @blur="setFieldTouched('priority')"
              :disabled="formState.isSubmitting"
            >
              <option value="">请选择优先级</option>
              <option
                v-for="priority in priorityOptions"
                :key="priority.value"
                :value="priority.value"
              >
                {{ priority.label }}
              </option>
            </select>
            <div v-if="getFieldState('priority').error.length" class="form-field__error">
              {{ getFieldState('priority').error[0] }}
            </div>
          </div>

          <!-- 状态 -->
          <div class="form-field">
            <label for="status" class="form-field__label">
              状态 <span class="required">*</span>
            </label>
            <select
              id="status"
              v-model="formData.status"
              class="form-field__select"
              :class="{ 'error': getFieldState('status').error.length }"
              @blur="setFieldTouched('status')"
              :disabled="formState.isSubmitting"
            >
              <option value="">请选择状态</option>
              <option
                v-for="status in statusOptions"
                :key="status.value"
                :value="status.value"
              >
                {{ status.label }}
              </option>
            </select>
            <div v-if="getFieldState('status').error.length" class="form-field__error">
              {{ getFieldState('status').error[0] }}
            </div>
          </div>
        </div>

        <div class="task-form__row">
          <!-- 截止日期 -->
          <div class="form-field">
            <label for="dueDate" class="form-field__label">截止日期</label>
            <input
              id="dueDate"
              v-model="dueDateString"
              type="datetime-local"
              class="form-field__input"
              :class="{ 'error': getFieldState('dueDate').error.length }"
              @blur="setFieldTouched('dueDate')"
              :disabled="formState.isSubmitting"
            />
            <div v-if="getFieldState('dueDate').error.length" class="form-field__error">
              {{ getFieldState('dueDate').error[0] }}
            </div>
          </div>

          <!-- 预估工时 -->
          <div class="form-field">
            <label for="estimatedHours" class="form-field__label">预估工时（小时）</label>
            <input
              id="estimatedHours"
              v-model.number="formData.estimatedHours"
              type="number"
              min="0"
              step="0.5"
              class="form-field__input"
              :class="{ 'error': getFieldState('estimatedHours').error.length }"
              placeholder="0"
              @blur="setFieldTouched('estimatedHours')"
              :disabled="formState.isSubmitting"
            />
            <div v-if="getFieldState('estimatedHours').error.length" class="form-field__error">
              {{ getFieldState('estimatedHours').error[0] }}
            </div>
          </div>
        </div>
      </div>

      <!-- 标签 -->
      <div class="task-form__section">
        <h3 class="task-form__section-title">标签</h3>
        
        <div class="form-field">
          <div class="tag-input">
            <div class="tag-input__tags">
              <span
                v-for="(tag, index) in formData.tags"
                :key="index"
                class="tag-input__tag"
              >
                {{ tag }}
                <button
                  type="button"
                  @click="removeTag(index)"
                  class="tag-input__remove"
                  :disabled="formState.isSubmitting"
                >
                  <X :size="14" />
                </button>
              </span>
            </div>
            <input
              v-model="newTag"
              type="text"
              class="tag-input__input"
              placeholder="输入标签后按回车"
              @keydown.enter.prevent="addTag"
              @keydown.comma.prevent="addTag"
              :disabled="formState.isSubmitting"
            />
          </div>
        </div>
      </div>

      <!-- 子任务 -->
      <div class="task-form__section">
        <h3 class="task-form__section-title">
          子任务
          <button
            type="button"
            @click="addSubtask"
            class="task-form__add-btn"
            :disabled="formState.isSubmitting"
          >
            <Plus :size="16" />
            添加子任务
          </button>
        </h3>
        
        <div v-if="formData.subtasks.length === 0" class="task-form__empty">
          暂无子任务
        </div>
        
        <div v-else class="subtask-list">
          <div
            v-for="(subtask, index) in formData.subtasks"
            :key="subtask.id || index"
            class="subtask-item"
          >
            <input
              v-model="subtask.completed"
              type="checkbox"
              class="subtask-item__checkbox"
              :disabled="formState.isSubmitting"
            />
            <input
              v-model="subtask.title"
              type="text"
              class="subtask-item__input"
              placeholder="子任务标题"
              :disabled="formState.isSubmitting"
            />
            <button
              type="button"
              @click="removeSubtask(index)"
              class="subtask-item__remove"
              :disabled="formState.isSubmitting"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 表单底部 -->
    <div class="task-form__footer">
      <div class="task-form__actions">
        <button
          type="button"
          @click="handleCancel"
          class="btn btn--secondary"
          :disabled="formState.isSubmitting"
        >
          取消
        </button>
        <button
          type="submit"
          class="btn btn--primary"
          :disabled="!formState.isValid || formState.isSubmitting"
        >
          <Loader v-if="formState.isSubmitting" class="spin" :size="16" />
          {{ isEditing ? '更新任务' : '创建任务' }}
        </button>
      </div>
      
      <!-- 表单状态指示 -->
      <div v-if="formState.isDirty && !formState.isValid" class="task-form__validation">
        <AlertCircle :size="16" />
        请完善必填信息
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { X, Plus, Trash2, Loader, AlertCircle } from 'lucide-vue-next'
import type { Task, TaskStatus, TaskPriority, Subtask } from '@/types'
import { TaskStatus as TaskStatusEnum, TaskPriority as TaskPriorityEnum } from '@/types'
import { useForm, validationRules } from '@/composables/useForm'
import { useTaskStore } from '@/stores/tasks'
import { useNotificationStore } from '@/stores/notifications'

// Props
interface Props {
  task?: Task
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})

// Emits
interface Emits {
  (e: 'close'): void
  (e: 'success', task: Task): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

// 状态管理
const taskStore = useTaskStore()
const notificationStore = useNotificationStore()

// 本地状态
const newTag = ref('')

// 计算属性
const isEditing = computed(() => !!props.task)

// 表单初始值
const getInitialValues = () => ({
  title: props.task?.title || '',
  description: props.task?.description || '',
  priority: props.task?.priority || '',
  status: props.task?.status || '',
  dueDate: props.task?.dueDate || null,
  estimatedHours: props.task?.estimatedHours || null,
  tags: props.task?.tags || [],
  subtasks: props.task?.subtasks || []
})

// 表单配置
const formConfig = {
  fields: [
    {
      name: 'title',
      label: '任务标题',
      type: 'text' as const,
      rules: [
        validationRules.required('任务标题是必填项'),
        validationRules.minLength(2, '任务标题至少需要2个字符'),
        validationRules.maxLength(100, '任务标题不能超过100个字符')
      ]
    },
    {
      name: 'description',
      label: '任务描述',
      type: 'textarea' as const,
      rules: [
        validationRules.maxLength(1000, '任务描述不能超过1000个字符')
      ]
    },
    {
      name: 'priority',
      label: '优先级',
      type: 'select' as const,
      rules: [
        validationRules.required('请选择优先级')
      ]
    },
    {
      name: 'status',
      label: '状态',
      type: 'select' as const,
      rules: [
        validationRules.required('请选择状态')
      ]
    },
    {
      name: 'dueDate',
      label: '截止日期',
      type: 'date' as const
    },
    {
      name: 'estimatedHours',
      label: '预估工时',
      type: 'text' as const,
      rules: [
        {
          custom: (value: number) => {
            if (value !== null && value !== undefined && value < 0) {
              return '预估工时不能为负数'
            }
            return true
          }
        }
      ]
    }
  ],
  validateOnChange: true,
  validateOnBlur: true,
  resetOnSubmit: false
}

// 使用表单Hook
const {
  formData,
  formState,
  setFieldTouched,
  getFieldState,
  handleSubmit: submitForm,
  resetForm
} = useForm(getInitialValues(), formConfig)

// 选项数据
const priorityOptions = [
  { label: '低', value: TaskPriorityEnum.LOW },
  { label: '中', value: TaskPriorityEnum.MEDIUM },
  { label: '高', value: TaskPriorityEnum.HIGH },
  { label: '紧急', value: TaskPriorityEnum.URGENT }
]

const statusOptions = [
  { label: '待办', value: TaskStatusEnum.TODO },
  { label: '进行中', value: TaskStatusEnum.IN_PROGRESS },
  { label: '已完成', value: TaskStatusEnum.COMPLETED },
  { label: '已取消', value: TaskStatusEnum.CANCELLED }
]

// 日期处理
const dueDateString = computed({
  get: () => {
    if (!formData.dueDate) return ''
    return new Date(formData.dueDate).toISOString().slice(0, 16)
  },
  set: (value: string) => {
    formData.dueDate = value ? new Date(value) : null
  }
})

// 方法
const handleSubmit = async (): Promise<void> => {
  await submitForm(async (data) => {
    try {
      let result: Task | null = null
      
      if (isEditing.value && props.task) {
        // 更新任务
        const success = await taskStore.updateTask(props.task.id, data)
        if (success) {
          result = { ...props.task, ...data }
          notificationStore.addNotification({
            type: 'success',
            title: '任务更新成功',
            message: `任务"${data.title}"已成功更新`
          })
        }
      } else {
        // 创建新任务
        result = await taskStore.createTask(data)
        if (result) {
          notificationStore.addNotification({
            type: 'success',
            title: '任务创建成功',
            message: `任务"${data.title}"已成功创建`
          })
        }
      }

      if (result) {
        emit('success', result)
        handleCancel()
      } else {
        throw new Error(isEditing.value ? '更新任务失败' : '创建任务失败')
      }
    } catch (error) {
      console.error('Task form submission error:', error)
      notificationStore.addNotification({
        type: 'error',
        title: isEditing.value ? '更新失败' : '创建失败',
        message: error instanceof Error ? error.message : '操作失败，请重试'
      })
      throw error
    }
  })
}

const handleCancel = (): void => {
  resetForm()
  emit('cancel')
  emit('close')
}

const addTag = (): void => {
  const tag = newTag.value.trim()
  if (tag && !formData.tags.includes(tag)) {
    formData.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index: number): void => {
  formData.tags.splice(index, 1)
}

const addSubtask = (): void => {
  formData.subtasks.push({
    id: Date.now().toString(),
    title: '',
    completed: false,
    taskId: props.task?.id || '',
    createdAt: new Date(),
    updatedAt: new Date()
  })
}

const removeSubtask = (index: number): void => {
  formData.subtasks.splice(index, 1)
}

// 监听props变化，重置表单
watch(
  () => props.task,
  () => {
    resetForm(getInitialValues())
  },
  { deep: true }
)

// 组件挂载时重置表单
onMounted(() => {
  resetForm(getInitialValues())
})
</script>

<style scoped>
.task-form {
  @apply bg-white rounded-lg shadow-lg max-w-2xl mx-auto max-h-[90vh] overflow-hidden flex flex-col;
}

.task-form__header {
  @apply flex justify-between items-center p-6 border-b border-gray-200;
}

.task-form__title {
  @apply text-lg font-semibold text-gray-900;
}

.task-form__close {
  @apply p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600;
}

.task-form__body {
  @apply flex-1 overflow-y-auto p-6 space-y-6;
}

.task-form__section {
  @apply space-y-4;
}

.task-form__section-title {
  @apply text-sm font-medium text-gray-900 flex items-center justify-between;
}

.task-form__add-btn {
  @apply inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors;
}

.task-form__row {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.task-form__empty {
  @apply text-center text-gray-500 text-sm py-4;
}

.form-field {
  @apply space-y-2;
}

.form-field__label {
  @apply block text-sm font-medium text-gray-700;
}

.required {
  @apply text-red-500;
}

.form-field__input,
.form-field__textarea,
.form-field__select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}

.form-field__input.error,
.form-field__textarea.error,
.form-field__select.error {
  @apply border-red-300 focus:ring-red-500 focus:border-red-500;
}

.form-field__error {
  @apply text-sm text-red-600;
}

.tag-input {
  @apply flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500;
}

.tag-input__tags {
  @apply flex flex-wrap gap-1;
}

.tag-input__tag {
  @apply inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full;
}

.tag-input__remove {
  @apply hover:bg-blue-200 rounded-full p-0.5 transition-colors;
}

.tag-input__input {
  @apply flex-1 min-w-[120px] border-0 outline-0 bg-transparent;
}

.subtask-list {
  @apply space-y-2;
}

.subtask-item {
  @apply flex items-center gap-3 p-3 bg-gray-50 rounded-lg;
}

.subtask-item__checkbox {
  @apply w-4 h-4 text-blue-600 rounded focus:ring-blue-500;
}

.subtask-item__input {
  @apply flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.subtask-item__remove {
  @apply p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors;
}

.task-form__footer {
  @apply p-6 border-t border-gray-200 flex justify-between items-center;
}

.task-form__actions {
  @apply flex gap-3;
}

.task-form__validation {
  @apply flex items-center gap-2 text-sm text-amber-600;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn--secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500;
}

.btn--primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2;
}

.spin {
  @apply animate-spin;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .task-form {
    @apply max-w-full mx-4;
  }
  
  .task-form__row {
    @apply grid-cols-1;
  }
}
</style>