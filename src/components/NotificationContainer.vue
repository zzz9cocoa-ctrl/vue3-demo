<template>
  <Teleport to="body">
    <div class="notification-container">
      <TransitionGroup name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'notification',
            `notification--${notification.type}`
          ]"
        >
          <div class="notification__icon">
            <component :is="getIcon(notification.type)" :size="20" />
          </div>
          
          <div class="notification__content">
            <div class="notification__title">{{ notification.title }}</div>
            <div class="notification__message">{{ notification.message }}</div>
          </div>
          
          <div class="notification__actions">
            <button
              v-for="action in notification.actions"
              :key="action.label"
              @click="action.action"
              class="notification__action"
            >
              {{ action.label }}
            </button>
          </div>
          
          <button
            @click="removeNotification(notification.id)"
            class="notification__close"
          >
            <X :size="16" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useNotificationStore } from '@/stores/notifications'
import type { Notification } from '@/types'

const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.notifications)

const getIcon = (type: Notification['type']) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  }
  return icons[type]
}

const removeNotification = (id: string | number) => {
  notificationStore.removeNotification(id)
}
</script>

<style scoped>
.notification-container {
  @apply fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full;
}

.notification {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4;
  @apply flex items-start gap-3 relative;
  @apply transition-all duration-300;
}

.notification--success {
  @apply border-l-4 border-l-green-500;
}

.notification--error {
  @apply border-l-4 border-l-red-500;
}

.notification--warning {
  @apply border-l-4 border-l-yellow-500;
}

.notification--info {
  @apply border-l-4 border-l-blue-500;
}

.notification__icon {
  @apply flex-shrink-0 mt-0.5;
}

.notification--success .notification__icon {
  @apply text-green-500;
}

.notification--error .notification__icon {
  @apply text-red-500;
}

.notification--warning .notification__icon {
  @apply text-yellow-500;
}

.notification--info .notification__icon {
  @apply text-blue-500;
}

.notification__content {
  @apply flex-1 min-w-0;
}

.notification__title {
  @apply font-medium text-gray-900 dark:text-white text-sm;
}

.notification__message {
  @apply text-gray-600 dark:text-gray-300 text-sm mt-1;
}

.notification__actions {
  @apply flex gap-2 mt-2;
}

.notification__action {
  @apply text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300;
  @apply transition-colors;
}

.notification__close {
  @apply absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200;
  @apply transition-colors p-1 rounded;
}

/* 过渡动画 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .notification-container {
    @apply left-4 right-4 max-w-none;
  }
}
</style>