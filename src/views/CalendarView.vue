<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">日历</h1>
        <div class="flex gap-4 items-center">
          <button @click="previousMonth" class="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
            ← 上月
          </button>
          <span class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ currentYear }}年 {{ currentMonth }}月
          </span>
          <button @click="nextMonth" class="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
            下月 →
          </button>
          <button @click="goToToday" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            今天
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <!-- 星期标题 -->
        <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          <div
            v-for="day in ['日', '一', '二', '三', '四', '五', '六']"
            :key="day"
            class="bg-gray-100 dark:bg-gray-800 p-3 text-center font-semibold text-gray-700 dark:text-gray-300"
          >
            {{ day }}
          </div>
        </div>

        <!-- 日期单元格 -->
        <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="bg-white dark:bg-gray-800 min-h-[120px] p-2"
            :class="{
              'opacity-40': !day.isCurrentMonth,
              'bg-blue-50 dark:bg-blue-900': day.isToday
            }"
          >
            <div class="font-semibold text-sm mb-2" :class="day.isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'">
              {{ day.date }}
            </div>
            <div class="space-y-1">
              <div
                v-for="task in day.tasks"
                :key="task.id"
                class="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 truncate cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
                @click="handleTaskClick(task)"
              >
                {{ task.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/tasks'
import type { Task } from '@/types'

const router = useRouter()
const taskStore = useTaskStore()

const currentDate = ref(new Date())

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth() + 1)

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // 获取上月需要显示的天数
  const prevMonthLastDay = new Date(year, month, 0)
  const prevMonthDays = firstDay.getDay()
  
  // 获取下月需要显示的天数
  const nextMonthDays = 6 - lastDay.getDay()
  
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // 上月日期
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({
      date: date.getDate(),
      fullDate: date,
      isCurrentMonth: false,
      isToday: false,
      tasks: getTasksForDate(date)
    })
  }
  
  // 当月日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({
      date: i,
      fullDate: date,
      isCurrentMonth: true,
      isToday: date.getTime() === today.getTime(),
      tasks: getTasksForDate(date)
    })
  }
  
  // 下月日期
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date: i,
      fullDate: date,
      isCurrentMonth: false,
      isToday: false,
      tasks: getTasksForDate(date)
    })
  }
  
  return days
})

const getTasksForDate = (date: Date): Task[] => {
  return taskStore.tasks.filter((task: Task) => {
    if (!task.dueDate) return false
    const taskDate = new Date(task.dueDate)
    taskDate.setHours(0, 0, 0, 0)
    return taskDate.getTime() === date.getTime()
  })
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const goToToday = () => {
  currentDate.value = new Date()
}

const handleTaskClick = (task: Task): void => {
  router.push(`/tasks/${task.id}`)
}

onMounted(() => {
  taskStore.fetchTasks()
})
</script>

