<template>
  <Teleport to="body">
    <div v-if="isLoading" class="global-loading">
      <div class="global-loading__backdrop"></div>
      <div class="global-loading__content">
        <div class="global-loading__spinner">
          <Loader class="animate-spin" :size="32" />
        </div>
        <div class="global-loading__text">{{ loadingText }}</div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Loader } from 'lucide-vue-next'

// 这里可以连接到全局的loading状态
// 目前使用本地状态作为演示
const isLoading = ref(false)
const loadingText = ref('加载中...')

// 暴露方法供外部调用
const show = (text = '加载中...') => {
  loadingText.value = text
  isLoading.value = true
}

const hide = () => {
  isLoading.value = false
}

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.global-loading {
  @apply fixed inset-0 z-[9999] flex items-center justify-center;
}

.global-loading__backdrop {
  @apply absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm;
}

.global-loading__content {
  @apply relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center;
  @apply border border-gray-200 dark:border-gray-700;
}

.global-loading__spinner {
  @apply text-blue-600 dark:text-blue-400 mb-4;
}

.global-loading__text {
  @apply text-gray-700 dark:text-gray-300 font-medium;
}
</style>