<route lang="json">
{
  "style": {
    "navigationBarTitleText": "主题设置",
    "navigationStyle": "custom"
  }
}
</route>

<template>
  <view class="page-container bg-[var(--page-bg)] min-h-screen">
    <wd-navbar title="主题设置" fixed placeholder left-arrow @click-left="goBack" />

    <view class="mt-4 px-4">
      <view class="bg-[var(--card-bg)] rounded-xl overflow-hidden shadow-sm">
        <view
          v-for="option in themeOptions"
          :key="option.value"
          class="flex items-center gap-4 p-4 border-b border-[var(--border-color)] last:border-none active:bg-[var(--page-bg)]"
          @click="setTheme(option.value)"
        >
          <view class="w-10 h-10 rounded-full flex items-center justify-center" :class="currentThemeValue === option.value ? 'bg-emerald-100' : 'bg-gray-100'">
            <component :is="option.icon" size="20" :color="currentThemeValue === option.value ? '#10b981' : '#6b7280'" />
          </view>
          <view class="flex-1">
            <view class="text-sm font-bold text-[var(--text-main)]" :class="{ 'text-emerald-600': currentThemeValue === option.value }">{{ option.label }}</view>
            <view class="text-xs text-[var(--text-sub)]">{{ option.description }}</view>
          </view>
          <IconCheck v-if="currentThemeValue === option.value" size="18" color="#10b981" />
        </view>
      </view>

      <view class="mt-4 bg-blue-50/10 border border-blue-100/20 rounded-xl p-4">
        <text class="text-xs text-blue-500 leading-relaxed">
          💡 提示：深色模式会在夜间自动调整屏幕亮度，减少用眼疲劳。
        </text>
      </view>

      <!-- 预览 -->
      <view class="mt-10">
        <text class="text-xs font-bold text-[var(--text-sub)] mb-3 ml-1 block uppercase">效果预览</text>
        <view class="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm">
          <view class="flex items-center gap-3">
            <view class="w-10 h-10 rounded-full bg-emerald-500"></view>
            <view class="flex-1 space-y-2">
              <view class="h-4 bg-[var(--page-bg)] rounded w-3/4"></view>
              <view class="h-3 bg-[var(--page-bg)] rounded w-1/2"></view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import IconSun from '@/components/icons/IconSun.vue'
import IconMoon from '@/components/icons/IconMoon.vue'
import IconMonitor from '@/components/icons/IconMonitor.vue'

const { theme: currentTheme, followSystem, toggleTheme, setFollowSystem } = useManualTheme()

const currentThemeValue = computed(() => followSystem.value ? 'system' : currentTheme.value)

const themeOptions = [
  { value: 'light', label: '浅色模式', icon: IconSun, description: '始终使用浅色主题' },
  { value: 'dark', label: '深色模式', icon: IconMoon, description: '始终使用深色主题' },
  { value: 'system', label: '跟随系统', icon: IconMonitor, description: '根据系统设置自动切换' },
]

function goBack() {
  uni.navigateBack()
}

function setTheme(val: string) {
  if (val === 'system') {
    setFollowSystem(true)
  } else {
    toggleTheme(val as any)
  }
  uni.showToast({ title: '设置成功', icon: 'success' })
}
</script>

<style scoped>
</style>
