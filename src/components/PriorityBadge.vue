<template>
  <span :class="priorityClasses">
    {{ priorityText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TaskPriority } from '@/types'

interface Props {
  priority: TaskPriority
}

const props = defineProps<Props>()

const priorityText = computed(() => {
  const textMap = {
    [TaskPriority.LOW]: '低',
    [TaskPriority.MEDIUM]: '中',
    [TaskPriority.HIGH]: '高',
    [TaskPriority.URGENT]: '紧急'
  }
  return textMap[props.priority]
})

const priorityClasses = computed(() => {
  const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium'
  
  const variantClasses = {
    [TaskPriority.LOW]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    [TaskPriority.MEDIUM]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [TaskPriority.HIGH]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    [TaskPriority.URGENT]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  
  return `${baseClasses} ${variantClasses[props.priority]}`
})
</script>