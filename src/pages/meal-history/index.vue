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
          class="relative pl-5"
        >
          <view class="absolute bottom-[-18px] left-[5px] top-3 w-px bg-emerald-100 last:hidden dark:bg-emerald-900/50" />
          <view class="absolute left-0 top-2 h-3 w-3 border-2 border-white rounded-full bg-emerald-500 shadow-sm dark:border-slate-950" />

          <view class="mb-3 flex items-center justify-between" @click="toggleDay(day.id)">
            <view class="flex items-center gap-2">
              <text class="text-base text-[var(--text-main)] font-bold">
                {{ day.date }}
              </text>
              <text class="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {{ day.mealCount }}餐
              </text>
            </view>
            <view class="flex items-center gap-1 text-[10px] text-slate-400">
              <text>{{ expandedDay === day.id ? '收起' : '查看明细' }}</text>
              <IconChevronDown
                size="14"
                color="#94a3b8"
                :style="{ transform: expandedDay === day.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'all 0.3s' }"
              />
            </view>
          </view>

          <view class="overflow-hidden border border-slate-100 rounded-2xl bg-[var(--card-bg)] shadow-[0_5px_20px_rgba(15,23,42,0.06)] dark:border-slate-800">
            <view class="flex items-stretch p-3" @click="toggleDay(day.id)">
              <view class="flex flex-1 flex-col justify-center rounded-xl from-emerald-500 to-teal-500 bg-gradient-to-br px-4 py-3 text-white">
                <text class="text-[10px] opacity-75">
                  当日净摄入
                </text>
                <view class="mt-1 flex items-baseline gap-1">
                  <text class="text-2xl font-black">
                    {{ day.totalIntake }}
                  </text>
                  <text class="text-[10px] opacity-80">
                    kcal
                  </text>
                </view>
              </view>
              <view class="ml-3 w-[42%] flex flex-col justify-center gap-2">
                <view class="flex items-center justify-between">
                  <view class="flex items-center gap-1.5">
                    <IconFlame size="15" color="#10b981" />
                    <text class="text-[10px] text-[var(--text-sub)]">
                      摄入
                    </text>
                  </view>
                  <text class="text-sm text-[var(--text-main)] font-bold">
                    {{ day.totalCalories }}
                  </text>
                </view>
                <view class="h-px bg-slate-100 dark:bg-slate-800" />
                <view class="flex items-center justify-between">
                  <view class="flex items-center gap-1.5">
                    <IconTrendingUp size="15" color="#3b82f6" />
                    <text class="text-[10px] text-[var(--text-sub)]">
                      消耗
                    </text>
                  </view>
                  <text class="text-sm text-[var(--text-main)] font-bold">
                    {{ day.totalBurned }}
                  </text>
                </view>
              </view>
            </view>

            <view v-if="expandedDay === day.id" class="border-t border-slate-100 px-4 py-1 dark:border-slate-800">
              <view v-for="meal in day.meals" :key="meal.id" class="flex border-b border-slate-100 py-3 last:border-b-0 dark:border-slate-800">
                <view class="w-16 shrink-0">
                  <text class="block text-sm text-[var(--text-main)] font-bold">
                    {{ meal.mealType }}
                  </text>
                  <text class="mt-1 block text-[10px] text-emerald-600">
                    {{ meal.totalCalories }} kcal
                  </text>
                </view>
                <view class="flex flex-1 flex-wrap gap-1.5">
                  <view
                    v-for="(item, idx) in meal.items"
                    :key="idx"
                    class="rounded-md bg-slate-50 px-2 py-1 dark:bg-slate-800/60"
                  >
                    <text class="text-[10px] text-slate-600 dark:text-slate-300">
                      {{ item.name }} {{ item.amount }}
                    </text>
                  </view>
                </view>
              </view>
              <view v-if="!day.meals?.length" class="py-5 text-center">
                <text class="text-xs text-slate-400">
                  暂无餐食明细
                </text>
              </view>
            </view>
          </view>
        </view>
      </template>

      <ListLoadMore
        v-if="!showSkeleton"
        :reached-bottom="hasReachedBottom"
        :loading="loading"
        :finished="isLastPage"
      />
    </view>
  </view>
</template>

<style scoped>
</style>
