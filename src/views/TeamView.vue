<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">团队</h1>
        <button
          @click="showInviteModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 邀请成员
        </button>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else>
        <!-- 团队统计 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">总成员</div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ teamMembers.length }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">在线</div>
            <div class="text-3xl font-bold text-green-600">{{ onlineMembers }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">管理员</div>
            <div class="text-3xl font-bold text-blue-600">{{ adminMembers }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">待审核</div>
            <div class="text-3xl font-bold text-yellow-600">{{ pendingMembers }}</div>
          </div>
        </div>

        <!-- 成员列表 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索成员..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">成员</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">角色</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">状态</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">加入时间</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <UserAvatar :name="member.name" :size="40" />
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ member.name }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ member.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                      :class="{
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200': member.role === 'admin',
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': member.role === 'user',
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': member.role === 'guest'
                      }"
                    >
                      {{ getRoleText(member.role) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="flex items-center gap-2">
                      <span
                        class="w-2 h-2 rounded-full"
                        :class="member.online ? 'bg-green-500' : 'bg-gray-400'"
                      ></span>
                      <span class="text-sm text-gray-900 dark:text-white">
                        {{ member.online ? '在线' : '离线' }}
                      </span>
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ new Date(member.joinedAt).toLocaleDateString('zh-CN') }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                      @click="handleEditMember(member)"
                    >
                      编辑
                    </button>
                    <button
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      @click="handleRemoveMember(member)"
                    >
                      移除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 邀请成员对话框 -->
      <div v-if="showInviteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">邀请成员</h2>
            <button @click="showInviteModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
              ✕
            </button>
          </div>
          
          <form @submit.prevent="handleInvite" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">邮箱地址</label>
              <input
                v-model="inviteEmail"
                type="email"
                required
                placeholder="member@example.com"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div class="flex gap-2 justify-end">
              <button
                type="button"
                @click="showInviteModal = false"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                发送邀请
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notifications'
import UserAvatar from '@/components/UserAvatar.vue'

const notificationStore = useNotificationStore()

const loading = ref(false)
const showInviteModal = ref(false)
const searchQuery = ref('')
const inviteEmail = ref('')
const teamMembers = ref<any[]>([])

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  online: boolean
  joinedAt: string
}

const filteredMembers = computed(() => {
  if (!searchQuery.value) return teamMembers.value
  
  const query = searchQuery.value.toLowerCase()
  return teamMembers.value.filter((member: TeamMember) =>
    member.name.toLowerCase().includes(query) ||
    member.email.toLowerCase().includes(query)
  )
})

const onlineMembers = computed(() => teamMembers.value.filter((m: TeamMember) => m.online).length)
const adminMembers = computed(() => teamMembers.value.filter((m: TeamMember) => m.role === 'admin').length)
const pendingMembers = computed(() => 0)

const getRoleText = (role: string): string => {
  const roleMap: Record<string, string> = {
    admin: '管理员',
    user: '成员',
    guest: '访客'
  }
  return roleMap[role] || role
}

const handleInvite = () => {
  notificationStore.addNotification({
    type: 'success',
    title: '邀请已发送',
    message: `已向 ${inviteEmail.value} 发送邀请`
  })
  inviteEmail.value = ''
  showInviteModal.value = false
}

const handleEditMember = (member: TeamMember): void => {
  notificationStore.addNotification({
    type: 'info',
    title: '编辑成员',
    message: '编辑成员功能开发中...'
  })
}

const handleRemoveMember = (member: TeamMember): void => {
  if (confirm(`确定要移除成员 ${member.name} 吗？`)) {
    notificationStore.addNotification({
      type: 'success',
      title: '成员已移除',
      message: `${member.name} 已从团队中移除`
    })
  }
}

onMounted(async () => {
  loading.value = true
  try {
    // 模拟加载团队数据
    await new Promise(resolve => setTimeout(resolve, 500))
    teamMembers.value = [
      {
        id: '1',
        name: '张三',
        email: 'zhangsan@example.com',
        role: 'admin',
        online: true,
        joinedAt: new Date(2024, 0, 15).toISOString()
      },
      {
        id: '2',
        name: '李四',
        email: 'lisi@example.com',
        role: 'user',
        online: false,
        joinedAt: new Date(2024, 1, 20).toISOString()
      },
      {
        id: '3',
        name: '王五',
        email: 'wangwu@example.com',
        role: 'user',
        online: true,
        joinedAt: new Date(2024, 2, 10).toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
})
</script>

