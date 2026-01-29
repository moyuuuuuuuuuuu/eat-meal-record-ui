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

<template>
  <view class="page-container bg-[var(--page-bg)] min-h-screen pb-20">
    <!-- 头部渐变背景 -->
    <view class="header-bg bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 pt-16 pb-12">
      <view class="flex items-center gap-4">
        <view class="w-16 h-16 rounded-full bg-white flex items-center justify-center">
          <IconUser size="32" color="#059669" />
        </view>
        <view class="flex-1 text-white">
          <view class="text-xl font-bold mb-1">{{ userStats.name }}</view>
          <view class="text-sm opacity-80">已坚持 {{ userStats.joinDays }} 天</view>
        </view>
        <view class="flex gap-2">
          <view class="p-2 bg-white/20 rounded-lg" @click="navigateTo('/pages/theme-settings/index')">
            <IconPalette size="20" color="white" />
          </view>
          <view class="p-2 bg-white/20 rounded-lg" @click="navigateTo('/pages/personal-info/index')">
            <IconSettings size="20" color="white" />
          </view>
        </view>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view class="px-4 -mt-6 mb-6">
      <view class="bg-[var(--card-bg)] rounded-xl shadow-md p-4 flex justify-around">
        <view class="text-center flex-1">
          <view class="text-2xl font-bold text-[var(--text-main)]">{{ userStats.totalRecords }}</view>
          <view class="text-xs text-[var(--text-sub)] mt-1">记录天数</view>
        </view>
        <view class="w-px h-10 bg-[var(--border-color)] self-center"></view>
        <view class="text-center flex-1">
          <view class="text-2xl font-bold text-[var(--text-main)]">{{ userStats.avgCalories }}</view>
          <view class="text-xs text-[var(--text-sub)] mt-1">平均摄入</view>
        </view>
        <view class="w-px h-10 bg-[var(--border-color)] self-center"></view>
        <view class="text-center flex-1">
          <view class="text-2xl font-bold text-emerald-600">{{ userStats.currentWeight - userStats.targetWeight }}kg</view>
          <view class="text-xs text-[var(--text-sub)] mt-1">距离目标</view>
        </view>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view class="px-4 space-y-4">
      <view class="bg-[var(--card-bg)] rounded-xl shadow-sm overflow-hidden">
        <wd-cell-group border>
          <wd-cell title="餐食记录" is-link @click="navigateTo('/pages/meal-history/index')">
            <template #icon>
              <view class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
                <IconBookOpen size="16" color="#059669" />
              </view>
            </template>
          </wd-cell>
          <wd-cell title="目标设置" is-link @click="navigateTo('/pages/goal-settings/index')">
            <template #icon>
              <view class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <IconTarget size="16" color="#3b82f6" />
              </view>
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>

      <!-- 个人信息详情 (紧凑版) -->
      <view class="bg-[var(--card-bg)] rounded-xl shadow-sm p-4">
        <view class="flex items-center gap-2 mb-4">
          <IconUser size="18" color="#6b7280" />
          <text class="text-sm font-bold text-[var(--text-main)]">个人信息</text>
        </view>
        <view class="space-y-3">
          <view class="flex justify-between items-center text-sm py-2 border-b border-[var(--border-color)]">
            <text class="text-[var(--text-sub)]">性别</text>
            <text class="text-[var(--text-main)]">{{ userStats.gender }}</text>
          </view>
          <view class="flex justify-between items-center text-sm py-2 border-b border-[var(--border-color)]">
            <text class="text-[var(--text-sub)]">年龄</text>
            <text class="text-[var(--text-main)]">{{ userStats.age }}岁</text>
          </view>
          <view class="flex justify-between items-center text-sm py-2 border-b border-[var(--border-color)]">
            <text class="text-[var(--text-sub)]">身高</text>
            <text class="text-[var(--text-main)]">{{ userStats.height }}cm</text>
          </view>
          <view class="flex justify-between items-center text-sm py-2">
            <text class="text-[var(--text-sub)]">当前体重</text>
            <text class="text-[var(--text-main)]">{{ userStats.currentWeight }}kg</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const userStats = ref({
  name: '用户',
  joinDays: 45,
  totalRecords: 128,
  avgCalories: 1890,
  currentWeight: 65,
  targetWeight: 60,
  height: 170,
  age: 28,
  gender: '女',
})

function navigateTo(url: string) {
  uni.navigateTo({ url })
}
</script>

<style scoped>
.page-container {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
