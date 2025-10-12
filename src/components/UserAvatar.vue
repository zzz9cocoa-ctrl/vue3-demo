<template>
  <div 
    :class="avatarClasses"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      :alt="displayName"
      class="avatar__image"
      @error="handleImageError"
    />
    <div v-else class="avatar__fallback">
      {{ initials }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { User } from '@/types'

interface Props {
  user?: User
  name?: string
  avatar?: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 32
})

const imageError = ref(false)

const displayName = computed(() => {
  if (props.user) return props.user.username || props.user.email
  if (props.name) return props.name
  return 'User'
})

const avatarUrl = computed(() => {
  if (imageError.value) return null
  if (props.user?.avatar) return props.user.avatar
  if (props.avatar) return props.avatar
  return null
})

const initials = computed(() => {
  const name = displayName.value
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
})

const avatarClasses = computed(() => {
  const baseClasses = 'avatar flex items-center justify-center rounded-full overflow-hidden'
  const sizeClasses = props.size <= 24 ? 'text-xs' : props.size <= 32 ? 'text-sm' : 'text-base'
  return `${baseClasses} ${sizeClasses}`
})

const handleImageError = (): void => {
  imageError.value = true
}
</script>

<style scoped>
.avatar {
  @apply bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium;
}

.avatar__image {
  @apply w-full h-full object-cover;
}

.avatar__fallback {
  @apply flex items-center justify-center w-full h-full;
}
</style>