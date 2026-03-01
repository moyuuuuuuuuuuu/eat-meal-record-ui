<script setup lang="ts">
import type { FoodItem } from '@/api/globals'
import { useRequest } from 'alova/client'
import IconFlame from '@/components/icons/IconFlame.vue'
import IconHelpCircle from '@/components/icons/IconHelpCircle.vue'
import IconTrendingUp from '@/components/icons/IconTrendingUp.vue'
import { useAuth } from '@/composables/useAuth'
import { useSystemInfo } from '@/composables/useSystemInfo'

const { totalHeight } = useSystemInfo()

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

const { isLogin } = useAuth()

const { send: updateSteps } = useRequest(data => Apis.user.steps({ data }), {
  immediate: false,
})

/**
 * 获取微信运动数据并同步到后端
 */
async function handleWeRunData() {
  // #ifdef MP-WEIXIN
  uni.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.werun']) {
        uni.authorize({
          scope: 'scope.werun',
          success: () => {
            getWeRunDataAndUpload()
          },
          fail: () => {
            console.warn('用户拒绝了微信运动授权')
          },
        })
      }
      else {
        getWeRunDataAndUpload()
      }
    },
  })
  // #endif
}

function getWeRunDataAndUpload() {
  // #ifdef MP-WEIXIN
  uni.getWeRunData({
    success: async (res) => {
      if (res.encryptedData && res.iv) {
        try {
          await updateSteps({
            encryptedData: res.encryptedData,
            iv: res.iv,
          })
          // 标记已获取过，避免重复拉起
          uni.setStorageSync('has_fetched_werun', 'true')
        }
        catch (err) {
          console.error('更新步数失败', err)
        }
      }
    },
    fail: (err) => {
      console.error('获取微信运动数据失败', err)
    },
  })
  // #endif
}

// Combined data fetching
onShow(async () => {
  // #ifdef MP-WEIXIN
  // 登录后第一次返回首页，主动拉起微信运动授权
  const justLoggedIn = uni.getStorageSync('JUST_LOGGED_IN')
  if (justLoggedIn) {
    handleWeRunData()
    uni.removeStorageSync('JUST_LOGGED_IN')
  }
  // #endif

  if (!isLogin.value) {
    // 未登录时，展示默认数据或清空数据
    totalIntake.value = { calories: 0, protein: 0, fat: 0, carbs: 0 }
    burnedCalories.value = 0
    meals.value = { 早餐: [], 午餐: [], 晚餐: [], 加餐: [] }
    return
  }

  // #ifdef MP-WEIXIN
  // 登录状态下，每天检查一次微信运动授权
  const today = new Date().toISOString().split('T')[0]
  const lastSyncDate = uni.getStorageSync('LAST_WERUN_SYNC_DATE')
  console.log('登录状态下，每天检查一次微信运动授权', lastSyncDate, today)
  if (lastSyncDate !== today) {
    handleWeRunData()
    uni.setStorageSync('LAST_WERUN_SYNC_DATE', today)
  }
  // #endif

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

// 监听添加餐食成功事件
uni.$on('refresh-diary', async () => {
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

onUnmounted(() => {
  uni.$off('refresh-diary')
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

function showBurnTips() {
  uni.showModal({
    title: '消耗说明',
    content: '这里的消耗是根据您的身体指标（性别/身高/体重）和今日步数测算出来的。\n'
      + '💡 记得开启“微信运动”授权，让计算更精准。\n'
      + '温馨提示：测算结果仅供参考，请以实际感受为准。',
    showCancel: false,
    confirmText: '我知道了',
    confirmColor: '#10b981',
  })
}
</script>

<template>
  <view class="page-container min-h-screen overflow-x-hidden bg-[var(--page-bg)] pb-20">
    <!-- 顶部卡路里摘要 -->
    <view
      class="bg-[var(--card-bg)] px-4 pb-8 shadow-sm"
      :style="{ paddingTop: `${totalHeight + 12}px` }"
    >
      <view class="mb-6 flex items-center justify-between">
        <!-- 摄入 -->
        <view class="flex-1 text-center">
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
        <view class="px-4">
          <CircularProgress :current="totalIntake.calories" :total="dailyGoal.calories" />
        </view>

        <!-- 消耗 -->
        <view class="flex-1 text-center">
          <view class="mb-1 flex items-center justify-center gap-1 text-[var(--text-sub)]">
            <IconTrendingUp size="14" color="#6b7280" />
            <text class="text-xs">
              消耗
            </text>
            <view class="ml-0.5 flex items-center" @click.stop="showBurnTips">
              <IconHelpCircle :size="16" color="#9ca3af" />
            </view>
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
              / {{ Number(dailyGoal.protein).toFixed(1) }}g
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
              / {{ Number(dailyGoal.fat).toFixed(1) }}g
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
              / {{ Number(dailyGoal.carbs).toFixed(1) }}g
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
  padding-bottom: env(safe-area-inset-bottom);
}
.letter-spacing-1 {
  letter-spacing: 0.1em;
}
</style>
