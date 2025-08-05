import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from './stores'
import './style.css'

// 创建Vue应用实例
const app = createApp(App)

// 安装插件
app.use(pinia)
app.use(router)

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('全局错误:', err)
  console.error('错误信息:', info)
  
  // 可以在这里集成错误报告服务
  // 例如: Sentry, Bugsnag等
}

// 全局警告处理
app.config.warnHandler = (msg, instance, trace) => {
  console.warn('Vue警告:', msg)
  console.warn('组件追踪:', trace)
}

// 挂载应用
app.mount('#app')