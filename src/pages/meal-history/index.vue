<script setup lang="ts">
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { usePagination } from 'alova/client'
import { computed, ref } from 'vue'
import IconChevronDown from '@/components/icons/IconChevronDown.vue'
import { usePageShare } from '@/composables/usePageShare'
import { useSystemInfo } from '@/composables/useSystemInfo'

const { fixedNavbarHeight } = useSystemInfo()

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
  total,
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

usePageShare({ title: '坚持记录，了解自己的饮食', path: '/pages/meal-history/index' })

const loadedSummary = computed(() => history.value.reduce((summary, day) => ({
  calories: summary.calories + Number(day.totalCalories || 0),
  meals: summary.meals + Number(day.mealCount || 0),
}), { calories: 0, meals: 0 }))

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
    <view :style="{ height: `${fixedNavbarHeight}px` }" />

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

        <template v-if="history.length > 0">
          <view class="relative overflow-hidden border border-teal-100 rounded-2xl bg-teal-50/60 p-5 dark:border-teal-800/40 dark:bg-teal-950/25">
            <view class="flex items-center justify-between">
              <view>
                <text class="block text-xs text-teal-600/70 dark:text-teal-400/70">
                  累计餐食记录
                </text>
                <view class="mt-1 flex items-end gap-2">
                  <text class="text-5xl text-teal-600 font-black leading-none dark:text-teal-400">
                    {{ total || history.length }}
                  </text>
                  <text class="mb-1 text-sm text-teal-600/60 dark:text-teal-400/60">
                    天
                  </text>
                </view>
                <text class="mt-2 block text-xs text-teal-700/70 dark:text-teal-300/70">
                  当前已加载 {{ loadedSummary.meals }} 餐
                </text>
              </view>
              <view class="text-right">
                <text class="block text-[11px] text-teal-600/70 dark:text-teal-400/70">
                  已加载摄入
                </text>
                <text class="mt-1 block text-2xl text-teal-700 font-bold dark:text-teal-300">
                  {{ loadedSummary.calories }}
                </text>
                <text class="text-[11px] text-teal-600/70 dark:text-teal-400/70">
                  kcal
                </text>
              </view>
            </view>
          </view>

          <view class="border border-[var(--border-color)] rounded-2xl bg-[var(--card-bg)] p-4 shadow-sm">
            <view class="mb-3 flex items-center justify-between">
              <text class="text-sm text-[var(--text-main)] font-bold">
                每日记录
              </text>
              <text class="text-[11px] text-[var(--text-sub)]">
                点击日期查看餐食
              </text>
            </view>

            <view class="space-y-2.5">
              <view
                v-for="day in history"
                :key="day.id"
                class="overflow-hidden rounded-xl transition-all"
                :class="expandedDay === day.id ? 'bg-teal-50/60 dark:bg-teal-900/10' : 'bg-[var(--page-bg)]'"
              >
                <view class="p-3 active:opacity-70" @click="toggleDay(day.id)">
                  <view class="mb-3 flex items-center justify-between">
                    <view class="flex items-center gap-2">
                      <text class="text-sm text-[var(--text-main)] font-bold">
                        {{ day.date }}
                      </text>
                      <text class="rounded-full bg-[var(--surface-subtle)] px-2 py-0.5 text-[11px] text-teal-600 dark:text-teal-400">
                        {{ day.mealCount }}餐
                      </text>
                    </view>
                    <IconChevronDown
                      size="15"
                      color="#0d9488"
                      :style="{ transform: expandedDay === day.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'all 0.3s' }"
                    />
                  </view>

                  <view class="grid grid-cols-3 gap-2">
                    <view>
                      <text class="block text-[11px] text-[var(--text-sub)]">
                        摄入
                      </text>
                      <text class="mt-0.5 block text-sm text-[var(--text-main)] font-bold">
                        {{ day.totalCalories }}<text class="text-[8px] font-normal">
                          kcal
                        </text>
                      </text>
                    </view>
                    <view>
                      <text class="block text-[11px] text-[var(--text-sub)]">
                        消耗
                      </text>
                      <text class="mt-0.5 block text-sm text-[var(--text-main)] font-bold">
                        {{ day.totalBurned }}<text class="text-[8px] font-normal">
                          kcal
                        </text>
                      </text>
                    </view>
                    <view class="text-right">
                      <text class="block text-[11px] text-teal-600/70">
                        净摄入
                      </text>
                      <text class="mt-0.5 block text-base text-teal-600 font-black">
                        {{ day.totalIntake }}<text class="text-[8px] font-normal">
                          kcal
                        </text>
                      </text>
                    </view>
                  </view>
                </view>

                <view v-if="expandedDay === day.id" class="border-t border-teal-100 px-3 pb-2 dark:border-teal-900/30">
                  <view v-for="meal in day.meals" :key="meal.id" class="border-b border-teal-100/70 py-3 last:border-b-0 dark:border-teal-900/30">
                    <view class="mb-2 flex items-center justify-between">
                      <text class="text-xs text-[var(--text-main)] font-bold">
                        {{ meal.mealType }}
                      </text>
                      <text class="text-[11px] text-teal-600">
                        {{ meal.totalCalories }} kcal
                      </text>
                    </view>
                    <view class="flex flex-wrap gap-1.5">
                      <text v-for="(item, idx) in meal.items" :key="idx" class="rounded-md bg-[var(--surface-subtle)] px-2 py-1 text-[11px] text-[var(--text-sub)]">
                        {{ item.name }} {{ item.amount }}
                      </text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>
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
