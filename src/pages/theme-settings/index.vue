<script setup lang="ts">
import IconCheck from '@/components/icons/IconCheck.vue' // 补全 Check 图标导入
import IconMonitor from '@/components/icons/IconMonitor.vue'
import IconMoon from '@/components/icons/IconMoon.vue'
import IconSun from '@/components/icons/IconSun.vue'
import { usePageShare } from '@/composables/usePageShare'
import { useSystemInfo } from '@/composables/useSystemInfo'

const { fixedNavbarHeight } = useSystemInfo()

definePage({
  style: {
    navigationBarTitleText: '主题设置',
    navigationStyle: 'custom',
  },
})

usePageShare({ title: '选择你喜欢的页面主题', path: '/pages/theme-settings/index' })

const { theme: currentTheme, followSystem, toggleTheme, setFollowSystem } = useManualTheme()

const currentThemeValue = computed(() => followSystem.value ? 'system' : currentTheme.value)

const themeOptions = [
  { value: 'light', label: '浅色模式', icon: 'sun', description: '始终使用浅色主题' },
  { value: 'dark', label: '深色模式', icon: 'moon', description: '始终使用深色主题' },
  { value: 'system', label: '跟随系统', icon: 'monitor', description: '根据系统设置自动切换' },
]

function goBack() {
  uni.navigateBack()
}

function setTheme(val: string) {
  if (val === 'system') {
    setFollowSystem(true)
  }
  else {
    toggleTheme(val as any)
  }
  uni.showToast({ title: '设置成功', icon: 'success' })
}
</script>

<template>
  <view class="page-container min-h-screen bg-[var(--page-bg)]">
    <wd-navbar title="主题设置" left-arrow safe-area-inset-top fixed @click-left="goBack" />

    <!-- 顶部占位 -->
    <view :style="{ height: `${fixedNavbarHeight}px` }" />

    <view class="mt-4 px-4">
      <view class="overflow-hidden rounded-xl bg-[var(--card-bg)] shadow-sm">
        <view
          v-for="option in themeOptions"
          :key="option.value"
          class="flex items-center gap-4 border-b border-[var(--border-color)] p-4 last:border-none active:bg-[var(--page-bg)]"
          @click="setTheme(option.value)"
        >
          <view class="h-10 w-10 flex items-center justify-center rounded-full" :class="currentThemeValue === option.value ? 'bg-[var(--brand-soft)]' : 'bg-[var(--surface-subtle)]'">
            <IconSun
              v-if="option.icon === 'sun'"
              size="20"
              :color="currentThemeValue === option.value ? 'var(--brand)' : 'var(--text-sub)'"
            />
            <IconMoon
              v-else-if="option.icon === 'moon'"
              size="20"
              :color="currentThemeValue === option.value ? 'var(--brand)' : 'var(--text-sub)'"
            />
            <IconMonitor
              v-else-if="option.icon === 'monitor'"
              size="20"
              :color="currentThemeValue === option.value ? 'var(--brand)' : 'var(--text-sub)'"
            />
          </view>

          <view class="flex-1">
            <view class="text-sm text-[var(--text-main)] font-bold" :class="{ 'text-[var(--brand)]': currentThemeValue === option.value }">
              {{ option.label }}
            </view>
            <view class="text-xs text-[var(--text-sub)]">
              {{ option.description }}
            </view>
          </view>

          <IconCheck v-if="currentThemeValue === option.value" size="18" color="var(--brand)" />
        </view>
      </view>

      <view class="mt-4 border border-[var(--border-color)] rounded-xl bg-[var(--surface-subtle)] p-4">
        <text class="text-xs text-[var(--text-sub)] leading-relaxed">
          💡 提示：深色模式会在夜间自动调整屏幕亮度，减少用眼疲劳。
        </text>
      </view>

      <view class="mt-10">
        <text class="mb-3 ml-1 block text-xs text-[var(--text-sub)] font-bold uppercase">
          效果预览
        </text>
        <view class="rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
          <view class="flex items-center gap-3">
            <view class="h-10 w-10 rounded-full bg-[var(--brand)]" />
            <view class="flex-1 space-y-2">
              <view class="h-4 w-3/4 rounded bg-[var(--page-bg)]" />
              <view class="h-3 w-1/2 rounded bg-[var(--page-bg)]" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
</style>
