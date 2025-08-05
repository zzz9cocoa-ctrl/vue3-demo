<template>
  <div id="app" class="app">
    <!-- 路由视图 -->
    <router-view v-slot="{ Component, route }">
      <transition
        :name="getTransitionName(route)"
        mode="out-in"
        appear
      >
        <keep-alive :include="keepAliveComponents">
          <component
            :is="Component"
            :key="route.fullPath"
            class="app__view"
          />
        </keep-alive>
      </transition>
    </router-view>

    <!-- 全局通知组件 -->
    <NotificationContainer />
    
    <!-- 全局加载指示器 -->
    <GlobalLoading />
    
    <!-- 确认对话框 -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import NotificationContainer from '@/components/NotificationContainer.vue'
import GlobalLoading from '@/components/GlobalLoading.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

// 状态管理
const authStore = useAuthStore()
const themeStore = useThemeStore()
const route = useRoute()

// 需要缓存的组件
const keepAliveComponents = computed(() => [
  'Dashboard',
  'Tasks',
  'Calendar',
  'Projects'
])

// 获取过渡动画名称
const getTransitionName = (route: any) => {
  // 根据路由层级决定动画类型
  if (route.meta?.transition) {
    return route.meta.transition
  }
  
  // 默认的页面切换动画
  return 'fade'
}

// 初始化应用
onMounted(async () => {
  // 初始化认证状态
  authStore.initializeAuth()
  
  // 初始化主题
  themeStore.initializeTheme()
  
  // 可以在这里添加其他初始化逻辑
  // 例如: 检查浏览器兼容性、加载用户偏好设置等
})
</script>

<style>
/* 全局样式 */
.app {
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app__view {
  min-height: 100vh;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app {
    font-size: 14px;
  }
}
</style>