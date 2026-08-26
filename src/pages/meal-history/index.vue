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
const MEAL_SCHEDULE: { from: number, to: number, type: string }[] = [
  { from: 5, to: 10, type: '早餐' },
  { from: 11, to: 14, type: '午餐' },
  { from: 17, to: 21, type: '晚餐' },
]
function getMealTypeByTime(): string {
  const hour = new Date().getHours()
  return MEAL_SCHEDULE.find(s => hour >= s.from && hour < s.to)?.type ?? '加餐'
}

function goMealRerecord() {
  uni.navigateTo({
    url: `/pages/add-meal/index?type=${getMealTypeByTime()}`,
  })
}

function toggleDay(id: string | number) {
  expandedDay.value = expandedDay.value === id ? null : id
}

onPullDownRefresh(async () => {
  page.value = 1
  hasReachedBottom.value = false
  uni.stopPullDownRefresh()
})

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
        <!-- ── 空状态 ── -->
        <view v-if="!loading && history.length === 0" class="flex flex-col items-center justify-center py-24 space-y-5">
          <view class="h-24 w-24 flex items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/20">
            <text class="text-5xl">
              🍽️
            </text>
          </view>
          <view class="text-center space-y-1.5">
            <text class="block text-base text-[var(--text-main)] font-semibold">
              还没有餐食记录
            </text>
            <text class="block text-sm text-[var(--text-sub)]">
              快去记录今天的第一餐吧
            </text>
          </view>
          <view class="rounded-full bg-teal-500 px-7 py-2.5 active:opacity-75" @click="goMealRerecord">
            <text class="text-sm text-white font-medium">
              去记录
            </text>
          </view>
        </view>

        <!-- ── 日期卡片列表 ── -->
        <view
          v-for="day in history"
          :key="day.id"
          class="day-card relative w-full overflow-hidden border border-slate-100 rounded-2xl bg-[var(--card-bg)] shadow-[0_6px_22px_rgba(15,23,42,0.06)] transition-all dark:border-slate-800 dark:shadow-[0_6px_22px_rgba(0,0,0,0.22)]"
        >
          <!-- 日期头部 -->
          <view class="active:opacity-80" @click="toggleDay(day.id)">
            <view class="flex items-center justify-between border-b border-slate-100 px-4 py-4 dark:border-slate-800">
              <view class="flex items-center gap-2">
                <view class="h-8 w-1 rounded-full bg-emerald-500" />
                <text class="text-base text-[var(--text-main)] font-bold tracking-tight">
                  {{ day.date }}
                </text>
                <view
                  class="rounded-full bg-emerald-50 px-2 py-0.5 dark:bg-emerald-900/30"
                >
                  <text
                    class="text-[10px] text-emerald-700 font-medium dark:text-emerald-400"
                  >
                    {{ day.mealCount }}餐
                  </text>
                </view>
              </view>
              <!-- 箭头按钮：展开 teal，收起 gray -->
              <view
                class="h-7 w-7 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800"
              >
                <IconChevronDown
                  size="14"
                  color="#9ca3af"
                  :style="{ transform: expandedDay === day.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'all 0.3s' }"
                />
              </view>
            </view>

            <view class="grid grid-cols-3 gap-2 bg-slate-50/70 p-3 dark:bg-slate-900/25">
              <!-- 摄入 -->
              <view class="flex flex-col items-center justify-center rounded-xl bg-white px-2 py-3 shadow-sm dark:bg-slate-900">
                <view
                  class="mb-1 h-8 w-8 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30"
                >
                  <IconFlame size="18" color="#10b981" />
                </view>
                <view class="text-center">
                  <text class="block text-[10px] text-[var(--text-sub)]">
                    摄入
                  </text>
                  <text class="mt-0.5 block text-base text-[var(--text-main)] font-bold leading-tight">
                    {{ day.totalCalories }}<text class="ml-0.5 text-[9px] font-normal">
                      kcal
                    </text>
                  </text>
                </view>
              </view>

              <!-- 消耗 -->
              <view class="flex flex-col items-center justify-center rounded-xl bg-white px-2 py-3 shadow-sm dark:bg-slate-900">
                <view
                  class="mb-1 h-8 w-8 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30"
                >
                  <IconTrendingUp size="18" color="#3b82f6" />
                </view>
                <view class="text-center">
                  <text class="block text-[10px] text-[var(--text-sub)]">
                    消耗
                  </text>
                  <text class="mt-0.5 block text-base text-[var(--text-main)] font-bold leading-tight">
                    {{ day.totalBurned }}<text class="ml-0.5 text-[9px] font-normal">
                      kcal
                    </text>
                  </text>
                </view>
              </view>

              <!-- 净摄入 -->
              <view class="flex flex-col items-center justify-center border border-emerald-100 rounded-xl from-emerald-50 to-teal-50 bg-gradient-to-br px-2 py-3 dark:border-emerald-900/50 dark:from-emerald-950/40 dark:to-teal-950/30">
                <text class="block text-[10px] text-emerald-700 dark:text-emerald-400">
                  净摄入
                </text>
                <text
                  class="mt-1 block text-lg text-emerald-600 font-black leading-tight"
                >
                  {{ day.totalIntake }}<text class="ml-0.5 text-[9px] font-normal">
                    kcal
                  </text>
                </text>
              </view>
            </view>
          </view>

          <!-- ── 餐食详情（展开区域）── -->
          <view
            v-if="expandedDay === day.id"
            class="border-t border-slate-100 bg-white p-3 space-y-2 dark:border-slate-800 dark:bg-slate-950/20"
          >
            <view
              v-for="meal in day.meals"
              :key="meal.id"
              class="relative overflow-hidden border border-teal-100/80 rounded-xl bg-white p-4 shadow-sm dark:border-teal-800/30 dark:bg-[#0f2420]/60"
            >
              <view class="mb-3 flex items-center justify-between pl-3">
                <view class="flex items-center gap-2">
                  <view class="h-1.5 w-1.5 rounded-full bg-teal-400 dark:bg-teal-500" />
                  <text class="text-sm text-[var(--text-main)] font-bold">
                    {{ meal.mealType }}
                  </text>
                </view>
                <!-- kcal badge -->
                <view class="rounded-full bg-teal-50 px-2.5 py-0.5 dark:bg-teal-900/50">
                  <text class="text-[10px] text-teal-600 font-medium dark:text-teal-400">
                    {{ meal.totalCalories }} kcal
                  </text>
                </view>
              </view>

              <!-- 食物 tag chips -->
              <view class="flex flex-wrap gap-1.5 pl-3">
                <view
                  v-for="(item, idx) in meal.items"
                  :key="idx"
                  class="rounded-lg bg-teal-50/80 px-2 py-1 dark:bg-teal-900/30"
                >
                  <text class="text-[10px] text-teal-700 dark:text-teal-400">
                    {{ item.name }} {{ item.amount }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>

      <wd-loadmore
        v-if="!showSkeleton && hasReachedBottom"
        :state="isLastPage ? 'finished' : (loading ? 'loading' : 'ready')"
        finished-text="我是有底线的"
      />
    </view>
  </view>
</template>

<style scoped>
</style>
