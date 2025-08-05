# Vue3 + TypeScript 教学项目 - 任务管理系统

一个全面的Vue3 + TypeScript教学项目，通过构建一个功能完整的任务管理系统来学习现代前端开发技术栈。

## 🎯 项目特色

这个项目涵盖了Vue3和TypeScript的所有重要知识点和最佳实践：

### Vue3 核心特性
- ✅ **Composition API** - 完整展示setup语法糖的使用
- ✅ **响应式系统** - ref、reactive、computed、watch的深度应用
- ✅ **组件系统** - Props、Emits、Slots、Provide/Inject
- ✅ **生命周期** - onMounted、onUnmounted等钩子函数
- ✅ **指令系统** - v-model、v-for、v-if等指令的高级用法
- ✅ **Teleport** - 传送门组件的使用
- ✅ **Suspense** - 异步组件的优雅处理

### TypeScript 特性
- ✅ **严格类型检查** - 启用所有严格模式选项
- ✅ **接口定义** - 完整的类型系统设计
- ✅ **泛型应用** - 在组件和函数中的泛型使用
- ✅ **类型推导** - 充分利用TypeScript的类型推导能力
- ✅ **装饰器** - 实验性装饰器的使用
- ✅ **模块系统** - ES6模块与TypeScript的结合

### 状态管理 (Pinia)
- ✅ **Store设计** - 模块化的状态管理
- ✅ **状态持久化** - localStorage集成
- ✅ **异步操作** - 异步actions的处理
- ✅ **状态组合** - 多个store的协同工作

### 路由系统 (Vue Router 4)
- ✅ **路由配置** - 嵌套路由、动态路由
- ✅ **路由守卫** - 认证、权限控制
- ✅ **懒加载** - 组件的按需加载
- ✅ **路由元信息** - 面包屑、标题等

### 自定义Hooks
- ✅ **useForm** - 表单处理和验证
- ✅ **useAsync** - 异步操作处理
- ✅ **useLocalStorage** - 本地存储管理
- ✅ **useDebounce** - 防抖和节流

### 工程化配置
- ✅ **Vite** - 现代化构建工具
- ✅ **ESLint** - 代码质量检查
- ✅ **Tailwind CSS** - 原子化CSS框架
- ✅ **TypeScript** - 完整的类型检查配置

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
# 使用npm
npm install

# 或使用yarn
yarn install
```

### 开发环境

```bash
# 启动开发服务器
npm run dev

# 或
yarn dev
```

访问 `http://localhost:3000` 查看应用。

### 构建生产版本

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 代码检查

```bash
# 运行ESLint
npm run lint

# 类型检查
npm run type-check
```

## 📁 项目结构

```
src/
├── api/                    # API接口定义
│   ├── index.ts           # API基础配置
│   ├── auth.ts            # 认证相关API
│   └── tasks.ts           # 任务相关API
├── components/            # 可复用组件
│   ├── TaskCard.vue       # 任务卡片组件
│   ├── TaskForm.vue       # 任务表单组件
│   └── ...
├── composables/           # 自定义Hooks
│   ├── useForm.ts         # 表单处理Hook
│   ├── useAsync.ts        # 异步操作Hook
│   ├── useLocalStorage.ts # 本地存储Hook
│   └── useDebounce.ts     # 防抖节流Hook
├── router/                # 路由配置
│   └── index.ts           # 路由定义和守卫
├── stores/                # Pinia状态管理
│   ├── index.ts           # Store入口
│   ├── auth.ts            # 认证状态
│   ├── tasks.ts           # 任务状态
│   └── ...
├── types/                 # TypeScript类型定义
│   └── index.ts           # 全局类型定义
├── utils/                 # 工具函数
│   └── index.ts           # 通用工具函数
├── views/                 # 页面组件
│   ├── DashboardView.vue  # 仪表盘页面
│   ├── TasksView.vue      # 任务列表页面
│   └── ...
├── App.vue                # 根组件
├── main.ts                # 应用入口
└── style.css              # 全局样式
```

## 🎓 学习要点

### 1. Composition API 深度应用

项目中大量使用了Composition API，展示了如何：

```typescript
// 组件逻辑组合
const { formData, formState, handleSubmit } = useForm(initialValues, config)
const { data, isLoading, error } = useAsync(fetchTasks)

// 响应式数据处理
const filteredTasks = computed(() => {
  return tasks.value.filter(task => 
    filters.value.status?.includes(task.status)
  )
})

// 生命周期钩子
onMounted(() => {
  fetchTasks()
})
```

### 2. TypeScript 类型系统

完整的类型定义和泛型应用：

```typescript
// 接口定义
interface Task extends BaseEntity {
  title: string
  status: TaskStatus
  priority: TaskPriority
  // ...
}

// 泛型组件
interface Props<T> {
  items: T[]
  onSelect: (item: T) => void
}

// 类型推导
const tasks = ref<Task[]>([])
const currentTask = computed(() => 
  tasks.value.find(task => task.id === selectedId.value)
)
```

### 3. 状态管理最佳实践

使用Pinia进行状态管理：

```typescript
export const useTaskStore = defineStore('tasks', () => {
  // 状态
  const tasks = ref<Task[]>([])
  
  // 计算属性
  const completedTasks = computed(() => 
    tasks.value.filter(task => task.status === TaskStatus.COMPLETED)
  )
  
  // 异步操作
  const fetchTasks = async () => {
    // ...
  }
  
  return { tasks, completedTasks, fetchTasks }
})
```

### 4. 自定义Hooks模式

封装可复用的逻辑：

```typescript
export function useForm<T>(initialValues: T, config: FormConfig) {
  const formData = reactive({ ...initialValues })
  const errors = ref<FormErrors>({})
  
  const validateForm = () => {
    // 验证逻辑
  }
  
  const handleSubmit = async (onSubmit: (data: T) => void) => {
    // 提交处理
  }
  
  return { formData, errors, validateForm, handleSubmit }
}
```

### 5. 路由权限控制

完整的路由守卫实现：

```typescript
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
    return
  }
  
  if (to.meta.roles && !authStore.hasAnyRole(to.meta.roles)) {
    next({ name: 'Forbidden' })
    return
  }
  
  next()
})
```

## 🛠️ 技术栈

- **Vue 3.4+** - 渐进式JavaScript框架
- **TypeScript 5.3+** - JavaScript的超集
- **Vite 5.0+** - 现代化构建工具
- **Vue Router 4.2+** - 官方路由管理器
- **Pinia 2.1+** - 新一代状态管理库
- **Tailwind CSS 3.4+** - 原子化CSS框架
- **VueUse 10.7+** - Vue组合式工具集
- **Axios 1.6+** - HTTP客户端
- **Day.js 1.11+** - 轻量级日期库
- **Lucide Vue** - 图标库

## 📚 学习资源

### 官方文档
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vue Router 官方文档](https://router.vuejs.org/)

### 推荐阅读
- [Vue 3 Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [TypeScript 深入理解](https://jkchao.github.io/typescript-book-chinese/)
- [Vue 3 源码解析](https://vue3js.cn/start/)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个教学项目！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 Vue 3 和 TypeScript 最佳实践
- 保持代码注释的完整性
- 确保类型安全

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目和社区：

- Vue.js 团队
- TypeScript 团队
- Vite 团队
- 所有贡献者

## 📞 联系方式

如果你有任何问题或建议，欢迎通过以下方式联系：

- 提交 [Issue](https://github.com/your-repo/issues)
- 发送邮件到 your-email@example.com

---

⭐ 如果这个项目对你有帮助，请给它一个星标！