<route lang="json">
{
  "name": "home",
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "首页",
    "navigationStyle": "custom"
  }
}
</route>

<template>
  <view class="page-container bg-[var(--page-bg)] min-h-screen pb-20 overflow-x-hidden">
    <!-- 顶部卡路里摘要 -->
    <view class="bg-[var(--card-bg)] px-4 pt-16 pb-8 shadow-sm">
      <view class="flex items-center justify-center gap-10 mb-6">
        <!-- 摄入 -->
        <view class="text-center">
          <view class="flex items-center gap-1 text-[var(--text-sub)] mb-1 justify-center">
            <IconFlame size="14" color="#6b7280" />
            <text class="text-xs">摄入</text>
          </view>
          <view class="text-2xl font-bold text-[var(--text-main)]">{{ totalIntake.calories }}</view>
          <view class="text-[10px] text-[var(--text-sub)]">kcal</view>
        </view>

        <!-- 环形进度条 -->
        <CircularProgress :current="totalIntake.calories" :total="dailyGoal.calories" />

        <!-- 消耗 -->
        <view class="text-center">
          <view class="flex items-center gap-1 text-[var(--text-sub)] mb-1 justify-center">
            <IconTrendingUp size="14" color="#6b7280" />
            <text class="text-xs">消耗</text>
          </view>
          <view class="text-2xl font-bold text-[var(--text-main)]">{{ burnedCalories }}</view>
          <view class="text-[10px] text-[var(--text-sub)]">kcal</view>
        </view>
      </view>

      <view class="text-center text-[10px] text-[var(--text-sub)]">
        目标: {{ dailyGoal.calories }} kcal/天
      </view>
    </view>

    <!-- 营养素摘要 -->
    <view class="px-4 mt-4">
      <view class="text-xs font-bold text-[var(--text-sub)] mb-3 ml-1 uppercase tracking-wider">今日营养素</view>
      <view class="grid grid-cols-3 gap-3">
        <!-- 蛋白质 -->
        <view class="bg-[var(--card-bg)] rounded-xl p-3 shadow-sm">
          <view class="text-[10px] text-[var(--text-sub)] mb-1 uppercase">蛋白质</view>
          <view class="mb-2">
            <text class="text-base font-bold text-[var(--text-main)]">{{ totalIntake.protein.toFixed(1) }}</text>
            <text class="text-[10px] text-[var(--text-sub)] ml-1">/ {{ dailyGoal.protein }}g</text>
          </view>
          <wd-progress :percentage="Math.min((totalIntake.protein / dailyGoal.protein) * 100, 100)" color="#3b82f6" :show-pivot="false" stroke-width="4px" />
        </view>

        <!-- 脂肪 -->
        <view class="bg-[var(--card-bg)] rounded-xl p-3 shadow-sm">
          <view class="text-[10px] text-[var(--text-sub)] mb-1 uppercase">脂肪</view>
          <view class="mb-2">
            <text class="text-base font-bold text-[var(--text-main)]">{{ totalIntake.fat.toFixed(1) }}</text>
            <text class="text-[10px] text-[var(--text-sub)] ml-1">/ {{ dailyGoal.fat }}g</text>
          </view>
          <wd-progress :percentage="Math.min((totalIntake.fat / dailyGoal.fat) * 100, 100)" color="#f59e0b" :show-pivot="false" stroke-width="4px" />
        </view>

        <!-- 碳水 -->
        <view class="bg-[var(--card-bg)] rounded-xl p-3 shadow-sm">
          <view class="text-[10px] text-[var(--text-sub)] mb-1 uppercase">碳水</view>
          <view class="mb-2">
            <text class="text-base font-bold text-[var(--text-main)]">{{ totalIntake.carbs.toFixed(1) }}</text>
            <text class="text-[10px] text-[var(--text-sub)] ml-1">/ {{ dailyGoal.carbs }}g</text>
          </view>
          <wd-progress :percentage="Math.min((totalIntake.carbs / dailyGoal.carbs) * 100, 100)" color="#8b5cf6" :show-pivot="false" stroke-width="4px" />
        </view>
      </view>
    </view>

    <!-- 今日吃什么 -->
    <view class="px-4 mt-4">
      <FoodSuggestion />
    </view>

    <!-- 餐食记录 -->
    <view class="px-4 mt-4">
      <view class="text-xs font-bold text-[var(--text-sub)] mb-3 ml-1 uppercase tracking-wider">今日餐食</view>
      <MealRecord meal-type="早餐" :foods="meals.早餐" @delete-food="deleteFood" />
      <MealRecord meal-type="午餐" :foods="meals.午餐" @delete-food="deleteFood" />
      <MealRecord meal-type="晚餐" :foods="meals.晚餐" @delete-food="deleteFood" />
      <MealRecord meal-type="加餐" :foods="meals.加餐" @delete-food="deleteFood" />
    </view>

    <!-- 悬浮添加按钮 -->
    <FloatingActionButton @select="handleAddMeal" />
  </view>
</template>

<script setup lang="ts">
import type { FoodItem } from '@/components/MealRecord.vue'

const dailyGoal = ref({
  calories: 2000,
  protein: 150,
  fat: 60,
  carbs: 250,
})

const meals = ref<Record<string, FoodItem[]>>({
  早餐: [
    { id: '1', name: '全麦面包', amount: 2, unit: '片', calories: 180, protein: 8, fat: 2, carbs: 32 },
    { id: '2', name: '煮鸡蛋', amount: 1, unit: '个', calories: 78, protein: 6, fat: 5, carbs: 1 },
  ],
  午餐: [
    { id: '4', name: '糙米饭', amount: 150, unit: 'g', calories: 180, protein: 4, fat: 1, carbs: 38 },
    { id: '5', name: '鸡胸肉', amount: 120, unit: 'g', calories: 165, protein: 31, fat: 4, carbs: 0 },
  ],
  晚餐: [],
  加餐: [],
})

const burnedCalories = ref(350)

const allFoods = computed(() => {
  return Object.values(meals.value).flat()
})

const totalIntake = computed(() => {
  return allFoods.value.reduce((acc, f) => ({
    calories: acc.calories + f.calories,
    protein: acc.protein + f.protein,
    fat: acc.fat + f.fat,
    carbs: acc.carbs + f.carbs
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 })
})

function deleteFood(id: string) {
  Object.keys(meals.value).forEach(type => {
    meals.value[type] = meals.value[type].filter(f => f.id !== id)
  })
}

function handleAddMeal(type: string) {
  uni.navigateTo({
    url: `/pages/add-meal/index?type=${type}`
  })
}
</script>

<style scoped>
.page-container {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.letter-spacing-1 {
  letter-spacing: 0.1em;
}
</style>
