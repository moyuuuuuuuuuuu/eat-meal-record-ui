<route lang="json">
{
  "style": {
    "navigationBarTitleText": "餐食记录",
    "navigationStyle": "custom"
  }
}
</route>

<template>
  <view class="page-container bg-[var(--page-bg)] h-screen flex flex-col overflow-hidden">
    <wd-navbar title="餐食记录" fixed placeholder left-arrow @click-left="goBack" />

    <scroll-view scroll-y class="flex-1 px-4 py-4 w-full">
      <view class="space-y-4 pb-24 w-full">
        <view v-for="day in history" :key="day.id" class="bg-[var(--card-bg)] rounded-xl shadow-sm overflow-hidden w-full">
          <!-- 日期头部 -->
          <view class="p-4 active:bg-[var(--page-bg)] flex flex-col" @click="toggleDay(day.id)">
            <view class="flex items-center justify-between mb-4">
              <view class="flex items-center gap-2">
                <text class="text-sm font-bold text-[var(--text-main)]">{{ day.date }}</text>
                <text class="text-[10px] text-[var(--text-sub)]">{{ day.mealCount }}餐</text>
              </view>
              <IconChevronDown size="16" color="#9ca3af" :style="{ transform: expandedDay === day.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'all 0.3s' }" />
            </view>

            <view class="flex items-center justify-around">
              <view class="flex items-center gap-2">
                <view class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <IconFlame size="16" color="white" />
                </view>
                <view>
                  <text class="text-xs text-[var(--text-sub)] block">摄入</text>
                  <text class="text-sm font-bold text-[var(--text-main)]">{{ day.totalCalories }}</text>
                </view>
              </view>
              <view class="w-px h-8 bg-[var(--border-color)]"></view>
              <view class="flex items-center gap-2">
                <view class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <IconTrendingUp size="16" color="#3b82f6" />
                </view>
                <view>
                  <text class="text-xs text-[var(--text-sub)] block">消耗</text>
                  <text class="text-sm font-bold text-[var(--text-main)]">{{ day.totalBurned }}</text>
                </view>
              </view>
              <view class="w-px h-8 bg-[var(--border-color)]"></view>
              <view>
                <text class="text-xs text-[var(--text-sub)] block">净摄入</text>
                <text class="text-sm font-bold text-emerald-600">{{ day.totalCalories - day.totalBurned }}</text>
              </view>
            </view>
          </view>

          <!-- 餐食详情 (展开) -->
          <view v-if="expandedDay === day.id" class="border-t border-[var(--border-color)] p-2 space-y-2 bg-[var(--page-bg)]">
            <view v-for="meal in day.meals" :key="meal.id" class="bg-[var(--card-bg)] rounded-lg p-3">
              <view class="flex items-center justify-between mb-2">
                <view class="flex items-center gap-2">
                  <view class="w-1.5 h-1.5 rounded-full bg-emerald-500"></view>
                  <text class="text-xs font-bold text-[var(--text-main)]">{{ meal.mealType }}</text>
                </view>
                <text class="text-xs text-[var(--text-sub)]">{{ meal.totalCalories }} kcal</text>
              </view>
              <view class="flex flex-wrap gap-2">
                <text v-for="(item, idx) in meal.items" :key="idx" class="text-[10px] text-[var(--text-sub)] bg-[var(--page-bg)] px-2 py-0.5 rounded">
                  {{ item.name }} {{ item.amount }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
const expandedDay = ref<string | null>(null)

const history = [
  {
    id: '1',
    date: '今天',
    totalCalories: 1850,
    totalBurned: 420,
    mealCount: 3,
    meals: [
      { id: '1-1', mealType: '早餐', totalCalories: 228, items: [{ name: '燕麦粥', amount: '200g' }, { name: '煮鸡蛋', amount: '1个' }] },
      { id: '1-2', mealType: '午餐', totalCalories: 335, items: [{ name: '糙米饭', amount: '150g' }, { name: '鸡胸肉', amount: '120g' }] },
    ]
  },
  {
    id: '2',
    date: '昨天',
    totalCalories: 1920,
    totalBurned: 380,
    mealCount: 4,
    meals: [
      { id: '2-1', mealType: '早餐', totalCalories: 330, items: [{ name: '全麦面包', amount: '2片' }] },
    ]
  }
]

function goBack() {
  uni.navigateBack()
}

function toggleDay(id: string) {
  expandedDay.value = expandedDay.value === id ? null : id
}
</script>

<style scoped>
</style>
