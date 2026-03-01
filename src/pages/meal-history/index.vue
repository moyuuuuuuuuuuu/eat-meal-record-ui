<script setup lang="ts">
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { usePagination } from 'alova/client'
import { computed, ref } from 'vue'
import IconChevronDown from '@/components/icons/IconChevronDown.vue'
import IconFlame from '@/components/icons/IconFlame.vue'
import IconTrendingUp from '@/components/icons/IconTrendingUp.vue'
import { useSystemInfo } from '@/composables/useSystemInfo'

const { statusBarHeight, navBarHeight } = useSystemInfo()

definePage({
  style: {
    navigationBarTitleText: '餐食记录',
    navigationStyle: 'custom',
  },
})

const expandedDay = ref<string | number | null>(null)
const hasReachedBottom = ref(false)

// 使用 usePagination 处理分页请求
const {
  loading,
  data: history,
  isLastPage,
  page,
} = usePagination(
  (page, pageSize) => Apis.diary.history({ params: { page, pageSize } }),
  {
    initialData: {
      total: 0,
      data: [],
    },
    data: res => res.data,
    total: res => res.total,
    initialPageSize: 10,
    append: true,
  },
)

const showSkeleton = computed(() => {
  return loading.value && page.value === 1 && history.value.length === 0
})

function goBack() {
  uni.navigateBack()
}

function toggleDay(id: string | number) {
  expandedDay.value = expandedDay.value === id ? null : id
}

// 下拉刷新
onPullDownRefresh(async () => {
  page.value = 1
  hasReachedBottom.value = false
  uni.stopPullDownRefresh()
})

// 上拉加载更多
onReachBottom(() => {
  hasReachedBottom.value = true
  if (!isLastPage.value && !loading.value) {
    page.value++
  }
})
</script>

<template>
  <view class="page-container min-h-screen bg-[var(--page-bg)]">
    <wd-navbar title="餐食记录" left-arrow safe-area-inset-top fixed @click-left="goBack" />

    <!-- 顶部占位 -->
    <view :style="{ height: `${statusBarHeight + navBarHeight}px` }" />

    <view class="px-4 py-4 space-y-4">
      <!-- 骨架屏 -->
      <template v-if="showSkeleton">
        <view v-for="i in 3" :key="i" class="rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
          <wd-skeleton title avatar :row="3" loading />
        </view>
      </template>

      <!-- 列表内容 -->
      <template v-else>
        <view v-for="day in history" :key="day.id" class="day-card relative w-full overflow-hidden border border-[var(--border-color)] rounded-2xl bg-[var(--card-bg)] shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <!-- 左侧装饰条 -->
          <view class="absolute left-0 top-0 h-full w-1 from-emerald-400 to-emerald-600 bg-gradient-to-b" />

          <!-- 日期头部 -->
          <view class="flex flex-col p-5 active:bg-[var(--page-bg)]/50" @click="toggleDay(day.id)">
            <view class="mb-4 flex items-center justify-between">
              <view class="flex items-center gap-2">
                <text class="text-base text-[var(--text-main)] font-bold">
                  {{ day.date }}
                </text>
                <view class="rounded-full bg-emerald-50 px-2 py-0.5 dark:bg-emerald-900/30">
                  <text class="text-[10px] text-emerald-600 font-medium">
                    {{ day.mealCount }}餐
                  </text>
                </view>
              </view>
              <view class="h-6 w-6 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                <IconChevronDown size="14" color="#9ca3af" :style="{ transform: expandedDay === day.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'all 0.3s' }" />
              </view>
            </view>

            <view class="flex items-center justify-around rounded-xl bg-gray-50/50 p-3 dark:bg-gray-800/20">
              <view class="flex items-center gap-3">
                <view class="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-800">
                  <IconFlame size="18" color="#10b981" />
                </view>
                <view>
                  <text class="block text-[10px] text-[var(--text-sub)] tracking-wider uppercase">
                    摄入
                  </text>
                  <text class="text-lg text-[var(--text-main)] font-bold">
                    {{ day.totalCalories }}
                  </text>
                </view>
              </view>

              <view class="h-8 w-px bg-[var(--border-color)]" />

              <view class="flex items-center gap-3">
                <view class="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-800">
                  <IconTrendingUp size="18" color="#3b82f6" />
                </view>
                <view>
                  <text class="block text-[10px] text-[var(--text-sub)] tracking-wider uppercase">
                    消耗
                  </text>
                  <text class="text-lg text-[var(--text-main)] font-bold">
                    {{ day.totalBurned }}
                  </text>
                </view>
              </view>

              <view class="h-8 w-px bg-[var(--border-color)]" />

              <view class="text-right">
                <text class="block text-[10px] text-[var(--text-sub)] tracking-wider uppercase">
                  净摄入
                </text>
                <text class="text-lg text-emerald-600 font-black">
                  {{ day.totalIntake }}
                </text>
              </view>
            </view>
          </view>

          <!-- 餐食详情 (展开) -->
          <view v-if="expandedDay === day.id" class="border-t border-[var(--border-color)] bg-gray-50/30 p-3 space-y-2 dark:bg-gray-900/10">
            <view v-for="meal in day.meals" :key="meal.id" class="relative overflow-hidden border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
              <view class="mb-3 flex items-center justify-between">
                <view class="flex items-center gap-2">
                  <view class="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <text class="text-sm text-[var(--text-main)] font-bold">
                    {{ meal.mealType }}
                  </text>
                </view>
                <text class="text-xs text-emerald-600 font-medium">
                  {{ meal.totalCalories }} kcal
                </text>
              </view>
              <view class="flex flex-wrap gap-2">
                <view v-for="(item, idx) in meal.items" :key="idx" class="rounded-lg bg-emerald-50/50 px-2 py-1 dark:bg-emerald-900/20">
                  <text class="text-[10px] text-emerald-700 dark:text-emerald-400">
                    {{ item.name }} {{ item.amount }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>

      <wd-loadmore v-if="!showSkeleton && hasReachedBottom" :state="isLastPage ? 'finished' : (loading ? 'loading' : 'ready')" finished-text="上拉加载下一页" />
    </view>
  </view>
</template>

<style scoped>
.page-container {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
