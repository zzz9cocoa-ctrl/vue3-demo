<template>
  <Teleport to="body">
    <div v-if="isVisible" class="confirm-dialog">
      <div class="confirm-dialog__backdrop" @click="handleCancel"></div>
      <div class="confirm-dialog__content">
        <div class="confirm-dialog__header">
          <div class="confirm-dialog__icon">
            <AlertTriangle :size="24" class="text-yellow-500" />
          </div>
          <h3 class="confirm-dialog__title">{{ title }}</h3>
        </div>
        
        <div class="confirm-dialog__body">
          <p class="confirm-dialog__message">{{ message }}</p>
        </div>
        
        <div class="confirm-dialog__footer">
          <button
            @click="handleCancel"
            class="btn btn-secondary"
            :disabled="isLoading"
          >
            {{ cancelText }}
          </button>
          <button
            @click="handleConfirm"
            class="btn btn-primary"
            :disabled="isLoading"
          >
            <Loader v-if="isLoading" class="animate-spin" :size="16" />
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AlertTriangle, Loader } from 'lucide-vue-next'

// 状态
const isVisible = ref(false)
const isLoading = ref(false)
const title = ref('')
const message = ref('')
const confirmText = ref('确认')
const cancelText = ref('取消')

// 回调函数
let onConfirm: (() => void | Promise<void>) | null = null
let onCancel: (() => void) | null = null

// 方法
const show = (options: {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}) => {
  title.value = options.title
  message.value = options.message
  confirmText.value = options.confirmText || '确认'
  cancelText.value = options.cancelText || '取消'
  onConfirm = options.onConfirm
  onCancel = options.onCancel || null
  isVisible.value = true
}

const hide = () => {
  isVisible.value = false
  isLoading.value = false
  onConfirm = null
  onCancel = null
}

const handleConfirm = async () => {
  if (!onConfirm) return
  
  isLoading.value = true
  
  try {
    await onConfirm()
    hide()
  } catch (error) {
    console.error('Confirm action failed:', error)
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  if (onCancel) {
    onCancel()
  }
  hide()
}

// 暴露方法
defineExpose({
  show,
  hide
})
</script>

<style scoped>
.confirm-dialog {
  @apply fixed inset-0 z-[9999] flex items-center justify-center p-4;
}

.confirm-dialog__backdrop {
  @apply absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm;
}

.confirm-dialog__content {
  @apply relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full;
  @apply border border-gray-200 dark:border-gray-700;
}

.confirm-dialog__header {
  @apply flex items-center gap-3 p-6 pb-4;
}

.confirm-dialog__title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.confirm-dialog__body {
  @apply px-6 pb-4;
}

.confirm-dialog__message {
  @apply text-gray-600 dark:text-gray-300;
}

.confirm-dialog__footer {
  @apply flex justify-end gap-3 p-6 pt-4 border-t border-gray-200 dark:border-gray-700;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
  @apply flex items-center gap-2;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500;
  @apply dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
}
</style>