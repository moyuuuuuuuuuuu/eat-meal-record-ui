<script setup lang="ts">
import { usePagination } from 'alova/client'

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
    <wd-navbar title="餐食记录" placeholder left-arrow fixed @click-left="goBack" />

    <view class="px-4 py-4 space-y-4">
      <!-- 骨架屏 -->
      <template v-if="showSkeleton">
        <view v-for="i in 3" :key="i" class="rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
          <wd-skeleton title avatar :row="3" loading />
        </view>
      </template>

      <!-- 列表内容 -->
      <template v-else>
        <view v-for="day in history" :key="day.id" class="w-full overflow-hidden rounded-xl bg-[var(--card-bg)] shadow-sm">
          <!-- 日期头部 -->
          <view class="flex flex-col p-4 active:bg-[var(--page-bg)]" @click="toggleDay(day.id)">
            <view class="mb-4 flex items-center justify-between">
              <view class="flex items-center gap-2">
                <text class="text-sm text-[var(--text-main)] font-bold">
                  {{ day.date }}
                </text>
                <text class="text-[10px] text-[var(--text-sub)]">
                  {{ day.mealCount }}餐
                </text>
              </view>
              <IconChevronDown size="16" color="#9ca3af" :style="{ transform: expandedDay === day.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'all 0.3s' }" />
            </view>

            <view class="flex items-center justify-around">
              <view class="flex items-center gap-2">
                <view class="h-8 w-8 flex items-center justify-center rounded-full bg-emerald-500">
                  <IconFlame size="16" color="white" />
                </view>
                <view>
                  <text class="block text-xs text-[var(--text-sub)]">
                    摄入
                  </text>
                  <text class="text-sm text-[var(--text-main)] font-bold">
                    {{ day.totalCalories }}
                  </text>
                </view>
              </view>
              <view class="h-8 w-px bg-[var(--border-color)]" />
              <view class="flex items-center gap-2">
                <view class="h-8 w-8 flex items-center justify-center rounded-full bg-blue-50">
                  <IconTrendingUp size="16" color="#3b82f6" />
                </view>
                <view>
                  <text class="block text-xs text-[var(--text-sub)]">
                    消耗
                  </text>
                  <text class="text-sm text-[var(--text-main)] font-bold">
                    {{ day.totalBurned }}
                  </text>
                </view>
              </view>
              <view class="h-8 w-px bg-[var(--border-color)]" />
              <view>
                <text class="block text-xs text-[var(--text-sub)]">
                  净摄入
                </text>
                <text class="text-sm text-emerald-600 font-bold">
                  {{ day.totalCalories - day.totalBurned }}
                </text>
              </view>
            </view>
          </view>

          <!-- 餐食详情 (展开) -->
          <view v-if="expandedDay === day.id" class="border-t border-[var(--border-color)] bg-[var(--page-bg)] p-2 space-y-2">
            <view v-for="meal in day.meals" :key="meal.id" class="rounded-lg bg-[var(--card-bg)] p-3">
              <view class="mb-2 flex items-center justify-between">
                <view class="flex items-center gap-2">
                  <view class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <text class="text-xs text-[var(--text-main)] font-bold">
                    {{ meal.mealType }}
                  </text>
                </view>
                <text class="text-xs text-[var(--text-sub)]">
                  {{ meal.totalCalories }} kcal
                </text>
              </view>
              <view class="flex flex-wrap gap-2">
                <text v-for="(item, idx) in meal.items" :key="idx" class="rounded bg-[var(--page-bg)] px-2 py-0.5 text-[10px] text-[var(--text-sub)]">
                  {{ item.name }} {{ item.amount }}
                </text>
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
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
