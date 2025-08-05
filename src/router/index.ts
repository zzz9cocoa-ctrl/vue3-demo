import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { RouteMeta } from '@/types'
import { UserRole } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'

// 扩展RouteRecordRaw类型以包含我们的meta信息
declare module 'vue-router' {
  interface RouteMeta extends RouteMeta {}
}

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
      hidden: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: {
      title: '注册',
      requiresAuth: false,
      hidden: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      title: '仪表盘',
      requiresAuth: true,
      icon: 'BarChart3'
    }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('@/views/TasksView.vue'),
    meta: {
      title: '任务管理',
      requiresAuth: true,
      icon: 'CheckSquare'
    }
  },
  {
    path: '/tasks/:id',
    name: 'TaskDetail',
    component: () => import('@/views/TaskDetailView.vue'),
    meta: {
      title: '任务详情',
      requiresAuth: true,
      hidden: true
    },
    props: true
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('@/views/CalendarView.vue'),
    meta: {
      title: '日历',
      requiresAuth: true,
      icon: 'Calendar'
    }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: {
      title: '项目',
      requiresAuth: true,
      icon: 'Folder'
    }
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('@/views/TeamView.vue'),
    meta: {
      title: '团队',
      requiresAuth: true,
      icon: 'Users',
      roles: [UserRole.ADMIN, UserRole.USER]
    }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/views/AnalyticsView.vue'),
    meta: {
      title: '数据分析',
      requiresAuth: true,
      icon: 'TrendingUp',
      roles: [UserRole.ADMIN]
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    redirect: '/settings/profile',
    meta: {
      title: '设置',
      requiresAuth: true,
      icon: 'Settings'
    },
    children: [
      {
        path: 'profile',
        name: 'SettingsProfile',
        component: () => import('@/views/settings/ProfileView.vue'),
        meta: {
          title: '个人资料',
          requiresAuth: true
        }
      },
      {
        path: 'account',
        name: 'SettingsAccount',
        component: () => import('@/views/settings/AccountView.vue'),
        meta: {
          title: '账户设置',
          requiresAuth: true
        }
      },
      {
        path: 'notifications',
        name: 'SettingsNotifications',
        component: () => import('@/views/settings/NotificationsView.vue'),
        meta: {
          title: '通知设置',
          requiresAuth: true
        }
      },
      {
        path: 'security',
        name: 'SettingsSecurity',
        component: () => import('@/views/settings/SecurityView.vue'),
        meta: {
          title: '安全设置',
          requiresAuth: true
        }
      },
      {
        path: 'admin',
        name: 'SettingsAdmin',
        component: () => import('@/views/settings/AdminView.vue'),
        meta: {
          title: '系统管理',
          requiresAuth: true,
          roles: [UserRole.ADMIN]
        }
      }
    ]
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('@/views/HelpView.vue'),
    meta: {
      title: '帮助中心',
      requiresAuth: false,
      icon: 'HelpCircle'
    }
  },
  // 错误页面
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/ForbiddenView.vue'),
    meta: {
      title: '访问被拒绝',
      requiresAuth: false,
      hidden: true
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/NotFoundView.vue'),
    meta: {
      title: '页面不存在',
      requiresAuth: false,
      hidden: true
    }
  },
  {
    path: '/500',
    name: 'ServerError',
    component: () => import('@/views/error/ServerErrorView.vue'),
    meta: {
      title: '服务器错误',
      requiresAuth: false,
      hidden: true
    }
  },
  // 捕获所有未匹配的路由
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Vue3 TypeScript 教学项目`
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // 未登录，重定向到登录页
      notificationStore.addNotification({
        type: 'warning',
        title: '需要登录',
        message: '请先登录后访问该页面'
      })
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // 检查角色权限
    if (to.meta.roles && to.meta.roles.length > 0) {
      if (!authStore.hasAnyRole(to.meta.roles)) {
        notificationStore.addNotification({
          type: 'error',
          title: '访问被拒绝',
          message: '您没有访问该页面的权限'
        })
        next({ name: 'Forbidden' })
        return
      }
    }

    // 刷新token（如果需要）
    try {
      await authStore.refreshToken()
    } catch (error) {
      console.error('Token refresh failed:', error)
      // Token刷新失败，重定向到登录页
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  // 已登录用户访问登录/注册页面，重定向到仪表盘
  if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

// 全局后置钩子
router.afterEach((to, from, failure) => {
  if (failure) {
    console.error('路由导航失败:', failure)
    const notificationStore = useNotificationStore()
    notificationStore.addNotification({
      type: 'error',
      title: '导航失败',
      message: '页面跳转失败，请重试'
    })
  }
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  const notificationStore = useNotificationStore()
  notificationStore.addNotification({
    type: 'error',
    title: '路由错误',
    message: '页面加载失败，请刷新重试'
  })
})

// 导出路由实例和工具函数
export default router

// 获取面包屑导航
export function getBreadcrumbs(route: any) {
  const breadcrumbs = []
  let currentRoute = route

  while (currentRoute) {
    if (currentRoute.meta?.title && !currentRoute.meta?.hidden) {
      breadcrumbs.unshift({
        name: currentRoute.name,
        title: currentRoute.meta.title,
        path: currentRoute.path
      })
    }
    currentRoute = currentRoute.parent
  }

  return breadcrumbs
}

// 获取导航菜单
export function getNavigationMenu() {
  const authStore = useAuthStore()
  
  return routes
    .filter(route => {
      // 过滤隐藏的路由
      if (route.meta?.hidden) return false
      
      // 过滤需要认证但用户未登录的路由
      if (route.meta?.requiresAuth && !authStore.isAuthenticated) return false
      
      // 过滤需要特定角色但用户没有权限的路由
      if (route.meta?.roles && !authStore.hasAnyRole(route.meta.roles)) return false
      
      return true
    })
    .map(route => ({
      name: route.name as string,
      path: route.path,
      title: route.meta?.title || '',
      icon: route.meta?.icon,
      children: route.children?.filter(child => !child.meta?.hidden).map(child => ({
        name: child.name as string,
        path: child.path,
        title: child.meta?.title || ''
      }))
    }))
}

// 检查路由权限
export function checkRoutePermission(routeName: string): boolean {
  const authStore = useAuthStore()
  const route = routes.find(r => r.name === routeName)
  
  if (!route) return false
  
  // 检查认证要求
  if (route.meta?.requiresAuth && !authStore.isAuthenticated) return false
  
  // 检查角色权限
  if (route.meta?.roles && !authStore.hasAnyRole(route.meta.roles)) return false
  
  return true
}

// 安全导航函数
export function navigateTo(routeName: string, params?: any, query?: any) {
  if (!checkRoutePermission(routeName)) {
    const notificationStore = useNotificationStore()
    notificationStore.addNotification({
      type: 'error',
      title: '访问被拒绝',
      message: '您没有访问该页面的权限'
    })
    return false
  }
  
  router.push({
    name: routeName,
    params,
    query
  })
  
  return true
}