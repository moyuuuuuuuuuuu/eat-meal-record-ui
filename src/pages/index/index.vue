<script setup lang="ts">
import type { FoodItem } from '@/api/globals'
import { useRequest } from 'alova/client'

definePage({
  name: 'home',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '首页',
    navigationStyle: 'custom',
  },
})

const dailyGoal = ref({
  calories: 2000,
  protein: 150,
  fat: 60,
  carbs: 250,
})

const burnedCalories = ref(0)
const totalIntake = ref({
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
})

const meals = ref<Record<string, FoodItem[]>>({
  早餐: [],
  午餐: [],
  晚餐: [],
  加餐: [],
})

const isAllMealsEmpty = computed(() => {
  return Object.values(meals.value).every(mealList => mealList.length === 0)
})

// Fetch summary data
const { send: getSummary } = useRequest(Apis.diary.summary(), {
  immediate: true,
})

// Fetch meals data
const { send: getMeals } = useRequest(Apis.diary.meals(), {
  immediate: true,
})

// Combined data fetching
onShow(async () => {
  const summaryRes = await getSummary()
  const mealsRes = await getMeals()

  if (summaryRes) {
    dailyGoal.value = summaryRes.dailyGoal
    totalIntake.value = summaryRes.totalIntake
    burnedCalories.value = summaryRes.burnedCalories
  }

  if (mealsRes) {
    meals.value = mealsRes
  }
})

function deleteFood(id: string) {
  useRequest(Apis.diary.deleteFood({ params: { id } })).send().then(() => {
    // Refresh data
    getSummary().then((res) => {
      if (res) {
        dailyGoal.value = res.dailyGoal
        totalIntake.value = res.totalIntake
        burnedCalories.value = res.burnedCalories
      }
    })
    getMeals().then((res) => {
      if (res)
        meals.value = res
    })
  })
}

function handleAddMeal(type: string) {
  uni.navigateTo({
    url: `/pages/add-meal/index?type=${type}`,
  })
}
</script>

<template>
  <view class="page-container min-h-screen overflow-x-hidden bg-[var(--page-bg)] pb-20">
    <!-- 顶部卡路里摘要 -->
    <view class="bg-[var(--card-bg)] px-4 pb-8 pt-16 shadow-sm">
      <view class="mb-6 flex items-center justify-center gap-10">
        <!-- 摄入 -->
        <view class="text-center">
          <view class="mb-1 flex items-center justify-center gap-1 text-[var(--text-sub)]">
            <IconFlame size="14" color="#6b7280" />
            <text class="text-xs">
              摄入
            </text>
          </view>
          <view class="text-2xl text-[var(--text-main)] font-bold">
            {{ totalIntake.calories }}
          </view>
          <view class="text-[10px] text-[var(--text-sub)]">
            kcal
          </view>
        </view>

        <!-- 环形进度条 -->
        <CircularProgress :current="totalIntake.calories" :total="dailyGoal.calories" />

        <!-- 消耗 -->
        <view class="text-center">
          <view class="mb-1 flex items-center justify-center gap-1 text-[var(--text-sub)]">
            <IconTrendingUp size="14" color="#6b7280" />
            <text class="text-xs">
              消耗
            </text>
          </view>
          <view class="text-2xl text-[var(--text-main)] font-bold">
            {{ burnedCalories }}
          </view>
          <view class="text-[10px] text-[var(--text-sub)]">
            kcal
          </view>
        </view>
      </view>

      <view class="text-center text-[10px] text-[var(--text-sub)]">
        目标: {{ dailyGoal.calories }} kcal/天
      </view>
    </view>

    <!-- 营养素摘要 -->
    <view class="mt-4 px-4">
      <view class="mb-3 ml-1 text-xs text-[var(--text-sub)] font-bold tracking-wider uppercase">
        今日营养素
      </view>
      <view class="grid grid-cols-3 gap-3">
        <!-- 蛋白质 -->
        <view class="rounded-xl bg-[var(--card-bg)] p-3 shadow-sm">
          <view class="mb-1 text-[10px] text-[var(--text-sub)] uppercase">
            蛋白质
          </view>
          <view class="mb-2">
            <text class="text-base text-[var(--text-main)] font-bold">
              {{ Number(totalIntake.protein).toFixed(1) || 0 }}
            </text>
            <text class="ml-1 text-[10px] text-[var(--text-sub)]">
              / {{ dailyGoal.protein }}g
            </text>
          </view>
          <wd-progress :percentage="Math.min(Number(((totalIntake.protein / dailyGoal.protein) * 100).toFixed(1)), 100)" color="#3b82f6" :show-pivot="false" stroke-width="4px" />
        </view>

        <!-- 脂肪 -->
        <view class="rounded-xl bg-[var(--card-bg)] p-3 shadow-sm">
          <view class="mb-1 text-[10px] text-[var(--text-sub)] uppercase">
            脂肪
          </view>
          <view class="mb-2">
            <text class="text-base text-[var(--text-main)] font-bold">
              {{ Number(totalIntake.fat).toFixed(1) || 0 }}
            </text>
            <text class="ml-1 text-[10px] text-[var(--text-sub)]">
              / {{ dailyGoal.fat }}g
            </text>
          </view>
          <wd-progress :percentage="Math.min(Number(((totalIntake.fat / dailyGoal.fat) * 100).toFixed(1)), 100)" color="#f59e0b" :show-pivot="false" stroke-width="4px" />
        </view>

        <!-- 碳水 -->
        <view class="rounded-xl bg-[var(--card-bg)] p-3 shadow-sm">
          <view class="mb-1 text-[10px] text-[var(--text-sub)] uppercase">
            碳水
          </view>
          <view class="mb-2">
            <text class="text-base text-[var(--text-main)] font-bold">
              {{ Number(totalIntake.carbs).toFixed(1) || 0 }}
            </text>
            <text class="ml-1 text-[10px] text-[var(--text-sub)]">
              / {{ dailyGoal.carbs }}g
            </text>
          </view>
          <wd-progress :percentage="Math.min(Number(((totalIntake.carbs / dailyGoal.carbs) * 100).toFixed(1)), 100)" color="#8b5cf6" :show-pivot="false" stroke-width="4px" />
        </view>
      </view>
    </view>

    <!-- 今日吃什么 -->
    <view class="mt-4 px-4">
      <FoodSuggestion />
    </view>

    <!-- 餐食记录 -->
    <view class="mb-10 mt-4 px-4">
      <view class="mb-3 ml-1 text-xs text-[var(--text-sub)] font-bold tracking-wider uppercase">
        今日餐食
      </view>

      <view v-if="isAllMealsEmpty" class="rounded-2xl bg-[var(--card-bg)] py-10 shadow-sm">
        <view class="flex flex-col items-center justify-center">
          <view class="mb-4 h-20 w-20 flex items-center justify-center rounded-full bg-[var(--page-bg)]">
            <IconCoffee size="40" color="#9ca3af" />
          </view>
          <text class="mb-2 text-sm text-[var(--text-main)] font-medium">
            暂无餐食记录
          </text>
          <text class="mb-6 text-xs text-[var(--text-sub)]">
            开启健康生活，从记录第一餐开始
          </text>
          <wd-button
            size="small"
            plain
            type="success"
            custom-class="!rounded-full"
            @click="handleAddMeal('早餐')"
          >
            去记录
          </wd-button>
        </view>
      </view>

      <template v-else>
        <MealRecord meal-type="早餐" :foods="meals.早餐" @delete-food="deleteFood" />
        <MealRecord meal-type="午餐" :foods="meals.午餐" @delete-food="deleteFood" />
        <MealRecord meal-type="晚餐" :foods="meals.晚餐" @delete-food="deleteFood" />
        <MealRecord meal-type="加餐" :foods="meals.加餐" @delete-food="deleteFood" />
      </template>
    </view>

    <!-- 悬浮添加按钮 -->
    <FloatingActionButton @select="handleAddMeal" />
  </view>
</template>

<style scoped>
.page-container {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.letter-spacing-1 {
  letter-spacing: 0.1em;
}
</style>
