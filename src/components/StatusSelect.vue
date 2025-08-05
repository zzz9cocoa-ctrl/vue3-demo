<template>
  <div class="status-select">
    <select
      :value="value"
      @change="handleChange"
      :disabled="loading"
      class="status-select__input"
      :class="statusClasses"
    >
      <option
        v-for="status in statusOptions"
        :key="status.value"
        :value="status.value"
      >
        {{ status.label }}
      </option>
    </select>
    
    <div v-if="loading" class="status-select__loading">
      <Loader class="animate-spin" :size="16" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader } from 'lucide-vue-next'
import { TaskStatus } from '@/types'

interface Props {
  value: TaskStatus
  loading?: boolean
}

interface Emits {
  (e: 'update:value', value: TaskStatus): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const statusOptions = [
  { label: '待办', value: TaskStatus.TODO },
  { label: '进行中', value: TaskStatus.IN_PROGRESS },
  { label: '已完成', value: TaskStatus.COMPLETED },
  { label: '已取消', value: TaskStatus.CANCELLED }
]

const statusClasses = computed(() => {
  const baseClasses = 'status-select__input'
  
  const variantClasses = {
    [TaskStatus.TODO]: 'status-select__input--todo',
    [TaskStatus.IN_PROGRESS]: 'status-select__input--in-progress',
    [TaskStatus.COMPLETED]: 'status-select__input--completed',
    [TaskStatus.CANCELLED]: 'status-select__input--cancelled'
  }
  
  return `${baseClasses} ${variantClasses[props.value]}`
})

const handleChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  emit('update:value', target.value as TaskStatus)
}
</script>

<style scoped>
.status-select {
  @apply relative inline-block;
}

.status-select__input {
  @apply px-3 py-1 rounded text-sm font-medium border-0 focus:ring-2 focus:ring-offset-2 transition-colors;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.status-select__input--todo {
  @apply bg-gray-100 text-gray-800 focus:ring-gray-500;
  @apply dark:bg-gray-700 dark:text-gray-300;
}

.status-select__input--in-progress {
  @apply bg-blue-100 text-blue-800 focus:ring-blue-500;
  @apply dark:bg-blue-900 dark:text-blue-300;
}

.status-select__input--completed {
  @apply bg-green-100 text-green-800 focus:ring-green-500;
  @apply dark:bg-green-900 dark:text-green-300;
}

.status-select__input--cancelled {
  @apply bg-red-100 text-red-800 focus:ring-red-500;
  @apply dark:bg-red-900 dark:text-red-300;
}

.status-select__loading {
  @apply absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400;
}
</style>