<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">数据分析</h1>
        <p class="text-gray-600 dark:text-gray-400">团队任务完成情况和绩效分析</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else>
        <!-- 关键指标 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">总任务数</div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalTasks }}</div>
            <div class="text-xs text-green-600 mt-2">↑ 12% 比上月</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">已完成</div>
            <div class="text-3xl font-bold text-green-600">{{ stats.completedTasks }}</div>
            <div class="text-xs text-green-600 mt-2">↑ 8% 比上月</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">进行中</div>
            <div class="text-3xl font-bold text-blue-600">{{ stats.inProgressTasks }}</div>
            <div class="text-xs text-gray-500 mt-2">与上月持平</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">完成率</div>
            <div class="text-3xl font-bold text-purple-600">{{ stats.completionRate }}%</div>
            <div class="text-xs text-green-600 mt-2">↑ 5% 比上月</div>
          </div>
        </div>

        <!-- 图表区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- 任务状态分布 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">任务状态分布</h3>
            <div class="space-y-4">
              <div v-for="status in taskStatusData" :key="status.name">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-700 dark:text-gray-300">{{ status.name }}</span>
                  <span class="text-gray-900 dark:text-white font-semibold">{{ status.value }}</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class="h-2 rounded-full"
                    :style="{ width: `${status.percentage}%`, backgroundColor: status.color }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 优先级分布 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">优先级分布</h3>
            <div class="space-y-4">
              <div v-for="priority in priorityData" :key="priority.name">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-700 dark:text-gray-300">{{ priority.name }}</span>
                  <span class="text-gray-900 dark:text-white font-semibold">{{ priority.value }}</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class="h-2 rounded-full"
                    :style="{ width: `${priority.percentage}%`, backgroundColor: priority.color }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 团队绩效 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">团队成员绩效</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">成员</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">总任务</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">已完成</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">完成率</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">平均用时</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="member in teamPerformance" :key="member.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center">
                      <UserAvatar :name="member.name" :size="32" />
                      <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white">{{ member.name }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ member.totalTasks }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ member.completedTasks }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span
                      class="px-2 py-1 rounded text-xs font-semibold"
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': member.completionRate >= 80,
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': member.completionRate >= 60 && member.completionRate < 80,
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': member.completionRate < 60
                      }"
                    >
                      {{ member.completionRate }}%
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ member.avgTime }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 本周活动 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">本周活动趋势</h3>
          <div class="space-y-3">
            <div v-for="day in weeklyActivity" :key="day.day" class="flex items-center gap-4">
              <div class="w-16 text-sm text-gray-600 dark:text-gray-400">{{ day.day }}</div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-end pr-2"
                      :style="{ width: `${(day.tasks / 20) * 100}%` }"
                    >
                      <span v-if="day.tasks > 0" class="text-xs text-white font-semibold">{{ day.tasks }}</span>
                    </div>
                  </div>
                  <span class="text-sm text-gray-900 dark:text-white w-12">{{ day.tasks }} 个</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'

const loading = ref(false)

const stats = ref({
  totalTasks: 156,
  completedTasks: 98,
  inProgressTasks: 42,
  completionRate: 63
})

const taskStatusData = ref([
  { name: '已完成', value: 98, percentage: 63, color: '#10b981' },
  { name: '进行中', value: 42, percentage: 27, color: '#3b82f6' },
  { name: '待处理', value: 12, percentage: 8, color: '#f59e0b' },
  { name: '已取消', value: 4, percentage: 2, color: '#ef4444' }
])

const priorityData = ref([
  { name: '高优先级', value: 35, percentage: 22, color: '#ef4444' },
  { name: '中优先级', value: 89, percentage: 57, color: '#f59e0b' },
  { name: '低优先级', value: 32, percentage: 21, color: '#10b981' }
])

const teamPerformance = ref([
  { id: '1', name: '张三', totalTasks: 45, completedTasks: 38, completionRate: 84, avgTime: '2.3天' },
  { id: '2', name: '李四', totalTasks: 52, completedTasks: 35, completionRate: 67, avgTime: '3.1天' },
  { id: '3', name: '王五', totalTasks: 38, completedTasks: 32, completionRate: 84, avgTime: '2.8天' },
  { id: '4', name: '赵六', totalTasks: 41, completedTasks: 28, completionRate: 68, avgTime: '3.5天' }
])

const weeklyActivity = ref([
  { day: '周一', tasks: 18 },
  { day: '周二', tasks: 15 },
  { day: '周三', tasks: 12 },
  { day: '周四', tasks: 16 },
  { day: '周五', tasks: 14 },
  { day: '周六', tasks: 8 },
  { day: '周日', tasks: 5 }
])

onMounted(async () => {
  loading.value = true
  try {
    // 模拟加载分析数据
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    loading.value = false
  }
})
</script>

