<script setup lang="ts">
import { useRequest } from 'alova/client'
import IconBookOpen from '@/components/icons/IconBookOpen.vue'
import IconPalette from '@/components/icons/IconPalette.vue'
import IconSettings from '@/components/icons/IconSettings.vue'
import IconTarget from '@/components/icons/IconTarget.vue'
import IconUser from '@/components/icons/IconUser.vue'
import { useAuth } from '@/composables/useAuth'

definePage({
  name: 'profile',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '个人中心',
    navigationStyle: 'custom',
    disableScroll: true,
  },
})

const router = useRouter()
const { userInfo } = useAuth()

const { data: userStats, send: refreshStats } = useRequest(Apis.user.stats(), {
  initialData: {
    name: '用户',
    joinDays: 0,
    totalRecords: 0,
    avgCalories: 0,
    currentWeight: 0,
    targetWeight: 0,
    height: 0,
    age: 0,
    gender: '未知',
  },
  immediate: true,
})

function handleNavigate(url: string) {
  router.push(url)
}

onShow(() => {
  refreshStats()
})
</script>

<template>
  <view class="page-container flex flex-col overflow-hidden bg-[var(--page-bg)] pb-20">
    <!-- 头部渐变背景 -->
    <view class="header-bg from-emerald-500 to-emerald-600 bg-gradient-to-br px-4 pb-12 pt-16">
      <view class="flex items-center gap-4">
        <view class="h-16 w-16 flex items-center justify-center overflow-hidden rounded-full bg-white">
          <wd-img v-if="userInfo?.avatar" :src="userInfo.avatar" mode="aspectFill" class="h-full w-full" />
          <IconUser v-else size="32" color="#059669" />
        </view>
        <view class="flex-1 text-white">
          <view class="mb-1 text-xl font-bold">
            {{ userInfo?.nickname || userStats.name }}
          </view>
          <view class="text-sm opacity-80">
            已坚持 {{ userStats.joinDays }} 天
          </view>
        </view>
        <view class="flex gap-2">
          <view class="rounded-lg bg-white/20 p-2" @click="handleNavigate('/pages/theme-settings/index')">
            <IconPalette size="20" color="white" />
          </view>
          <view class="rounded-lg bg-white/20 p-2" @click="handleNavigate('/pages/personal-info/index')">
            <IconSettings size="20" color="white" />
          </view>
        </view>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view class="mb-6 px-4 -mt-6">
      <view class="flex justify-around rounded-xl bg-[var(--card-bg)] p-4 shadow-md">
        <view class="flex-1 text-center">
          <view class="text-2xl text-[var(--text-main)] font-bold">
            {{ userStats.totalRecords }}
          </view>
          <view class="mt-1 text-xs text-[var(--text-sub)]">
            记录天数
          </view>
        </view>
        <view class="h-10 w-px self-center bg-[var(--border-color)]" />
        <view class="flex-1 text-center">
          <view class="text-2xl text-[var(--text-main)] font-bold">
            {{ userStats.avgCalories }}
          </view>
          <view class="mt-1 text-xs text-[var(--text-sub)]">
            平均摄入
          </view>
        </view>
        <view class="h-10 w-px self-center bg-[var(--border-color)]" />
        <view class="flex-1 text-center">
          <view class="text-2xl text-emerald-600 font-bold">
            {{ userStats.currentWeight - userStats.targetWeight }}kg
          </view>
          <view class="mt-1 text-xs text-[var(--text-sub)]">
            距离目标
          </view>
        </view>
      </view>
    </view>

    <!-- 菜单列表和个人信息 (放入可滚动区域，如果不希望整个页面滚动，可以将这部分放入 scroll-view) -->
    <!-- 但用户明确要求禁用滚动，我们检查内容是否能塞下 -->
    <view class="flex-1 overflow-hidden px-4 space-y-4">
      <view class="overflow-hidden rounded-xl bg-[var(--card-bg)] shadow-sm">
        <wd-cell-group border>
          <wd-cell title="餐食记录" is-link @click="handleNavigate('/pages/meal-history/index')">
            <template #icon>
              <view class="mr-2 h-8 w-8 flex items-center justify-center rounded-full bg-emerald-100">
                <IconBookOpen size="16" color="#059669" />
              </view>
            </template>
          </wd-cell>
          <wd-cell title="目标设置" is-link @click="handleNavigate('/pages/goal-settings/index')">
            <template #icon>
              <view class="mr-2 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100">
                <IconTarget size="16" color="#3b82f6" />
              </view>
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>

      <!-- 个人信息详情 (紧凑版) -->
      <view class="rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
        <view class="mb-4 flex items-center gap-2">
          <IconUser size="18" color="#6b7280" />
          <text class="text-sm text-[var(--text-main)] font-bold">
            个人信息
          </text>
        </view>
        <view class="space-y-3">
          <view class="flex items-center justify-between border-b border-[var(--border-color)] py-2 text-sm">
            <text class="text-[var(--text-sub)]">
              性别
            </text>
            <text class="text-[var(--text-main)]">
              {{ userInfo?.gender || userStats.gender }}
            </text>
          </view>
          <view class="flex items-center justify-between border-b border-[var(--border-color)] py-2 text-sm">
            <text class="text-[var(--text-sub)]">
              生日
            </text>
            <text class="text-[var(--text-main)]">
              {{ userInfo?.birthday || '未设置' }}
            </text>
          </view>
          <view class="flex items-center justify-between border-b border-[var(--border-color)] py-2 text-sm">
            <text class="text-[var(--text-sub)]">
              身高
            </text>
            <text class="text-[var(--text-main)]">
              {{ userInfo?.height || userStats.height }}cm
            </text>
          </view>
          <view class="flex items-center justify-between py-2 text-sm">
            <text class="text-[var(--text-sub)]">
              当前体重
            </text>
            <text class="text-[var(--text-main)]">
              {{ userInfo?.weight || userStats.currentWeight }}kg
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
