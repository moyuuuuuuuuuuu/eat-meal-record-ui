<route lang="json">
{
  "name": "profile",
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "个人中心",
    "navigationStyle": "custom"
  }
}
</route>

<script setup lang="ts">
import { useRequest } from 'alova/client'

const { data: userStats } = useRequest(Apis.user.getStats(), {
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

function navigateTo(url: string) {
  uni.navigateTo({ url })
}
</script>

<template>
  <view class="page-container min-h-screen bg-[var(--page-bg)] pb-20">
    <!-- 头部渐变背景 -->
    <view class="header-bg from-emerald-500 to-emerald-600 bg-gradient-to-br px-4 pb-12 pt-16">
      <view class="flex items-center gap-4">
        <view class="h-16 w-16 flex items-center justify-center rounded-full bg-white">
          <IconUser size="32" color="#059669" />
        </view>
        <view class="flex-1 text-white">
          <view class="mb-1 text-xl font-bold">
            {{ userStats.name }}
          </view>
          <view class="text-sm opacity-80">
            已坚持 {{ userStats.joinDays }} 天
          </view>
        </view>
        <view class="flex gap-2">
          <view class="rounded-lg bg-white/20 p-2" @click="navigateTo('/pages/theme-settings/index')">
            <IconPalette size="20" color="white" />
          </view>
          <view class="rounded-lg bg-white/20 p-2" @click="navigateTo('/pages/personal-info/index')">
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

    <!-- 菜单列表 -->
    <view class="px-4 space-y-4">
      <view class="overflow-hidden rounded-xl bg-[var(--card-bg)] shadow-sm">
        <wd-cell-group border>
          <wd-cell title="餐食记录" is-link @click="navigateTo('/pages/meal-history/index')">
            <template #icon>
              <view class="mr-2 h-8 w-8 flex items-center justify-center rounded-full bg-emerald-100">
                <IconBookOpen size="16" color="#059669" />
              </view>
            </template>
          </wd-cell>
          <wd-cell title="目标设置" is-link @click="navigateTo('/pages/goal-settings/index')">
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
              {{ userStats.gender }}
            </text>
          </view>
          <view class="flex items-center justify-between border-b border-[var(--border-color)] py-2 text-sm">
            <text class="text-[var(--text-sub)]">
              年龄
            </text>
            <text class="text-[var(--text-main)]">
              {{ userStats.age }}岁
            </text>
          </view>
          <view class="flex items-center justify-between border-b border-[var(--border-color)] py-2 text-sm">
            <text class="text-[var(--text-sub)]">
              身高
            </text>
            <text class="text-[var(--text-main)]">
              {{ userStats.height }}cm
            </text>
          </view>
          <view class="flex items-center justify-between py-2 text-sm">
            <text class="text-[var(--text-sub)]">
              当前体重
            </text>
            <text class="text-[var(--text-main)]">
              {{ userStats.currentWeight }}kg
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-container {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
