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
const notices = ref<string[]>([])
const { send: getNotice } = useRequest(Apis.article.notices(), {
  immediate: true,
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

function getWeRunDataAndUpload(): Promise<void> {
  // #ifdef MP-WEIXIN
  return new Promise((resolve, reject) => {
    uni.getWeRunData({
      success: async (res) => {
        if (res.encryptedData && res.iv) {
          try {
            await updateSteps({
              encryptedData: res.encryptedData,
              iv: res.iv,
            })
            resolve()
          }
          catch (err) {
            console.error('更新步数失败', err)
            reject(err)
          }
        }
        else {
          reject(new Error('微信运动数据为空'))
        }
      },
      fail: (err) => {
        // 用户点击“拒绝”会进入这里
        console.warn('获取微信运动数据失败或用户拒绝:', err)

        // 如果用户之前拒绝过，再次调用会直接进入 fail，此时需引导去设置页
        if (err.errMsg.includes('auth deny')) {
          uni.showModal({
            title: '授权提示',
            content: '需要读取微信运动数据以计算消耗，请在设置中开启',
            confirmText: '去开启',
            confirmColor: '#10b981',
            success: (modalRes) => {
              if (modalRes.confirm) {
                uni.openSetting()
              }
            },
          })
        }
        reject(err)
      },
    })
  })
  // #endif

  // #ifndef MP-WEIXIN
  return Promise.resolve()
  // #endif
}
// 步数同步参数接口
// 缓存键名枚举（可选，推荐）
enum StorageKeys {
  LastWeRunSyncDate = 'LAST_WERUN_SYNC_DATE',
  JustLoggedIn = 'JUST_LOGGED_IN',
}
// 1. 内存锁：防止单次运行期间多次触发（TS 自动推导为 boolean）
let isWeRunSyncing = false
function getLocalDateKey(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}
/**
 * 逻辑判断归口
 */
async function syncWeRunIfNeeded(): Promise<void> {
  // #ifndef MP-WEIXIN
  return
  // #endif

  if (isWeRunSyncing) {
    return
  }
  const today = getLocalDateKey()
  const lastSyncDate = uni.getStorageSync(StorageKeys.LastWeRunSyncDate) as string
  const justLoggedIn = uni.getStorageSync(StorageKeys.JustLoggedIn) as boolean

  // 刚登录或今天未同步时触发
  if (justLoggedIn || lastSyncDate !== today) {
    isWeRunSyncing = true
    try {
      await getWeRunDataAndUpload()
      uni.setStorageSync(StorageKeys.LastWeRunSyncDate, today)
      if (justLoggedIn)
        uni.removeStorageSync(StorageKeys.JustLoggedIn)
    }
    catch (err) {
      console.warn('本次微信运动同步未完成', err)
    }
    finally {
      isWeRunSyncing = false
    }
  }
}
// Combined data fetching
onShow(async () => {
  const noticesRes = await getNotice()

  if (noticesRes) {
    notices.value = noticesRes
  }
  if (!isLogin.value) {
    // 未登录时，展示默认数据或清空数据
    totalIntake.value = { calories: 0, protein: 0, fat: 0, carbs: 0 }
    burnedCalories.value = 0
    meals.value = { 早餐: [], 午餐: [], 晚餐: [], 加餐: [] }
    return
  }

  // #ifdef MP-WEIXIN
  await syncWeRunIfNeeded()
  // #endif
  console.log('Check 2')

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
  useRequest(Apis.diary.deleteFood({ data: { meal_record_food_id: id } })).send().then(() => {
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
      <view
        v-if="notices.length > 0"
        class="notice"
      >
        <wd-notice-bar
          :text="notices"
          prefix="check-outline"
          closable
          color="#34D19D"
          background-color="#f0f9eb"
          closeable
        />
      </view>
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
          <view class="text-xs text-[var(--text-sub)]">
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
          <view class="text-xs text-[var(--text-sub)]">
            kcal
          </view>
        </view>
      </view>

      <view class="text-center text-xs text-[var(--text-sub)]">
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
        <view class="border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)] p-3">
          <view class="mb-1 text-[11px] text-[var(--text-sub)]">
            蛋白质
          </view>
          <view class="mb-2">
            <text class="text-base text-[var(--text-main)] font-bold">
              {{ Number(totalIntake.protein).toFixed(1) || 0 }}
            </text>
            <text class="ml-1 text-[11px] text-[var(--text-sub)]">
              / {{ Number(dailyGoal.protein).toFixed(1) }}g
            </text>
          </view>
          <wd-progress :percentage="Math.min(Number(((totalIntake.protein / dailyGoal.protein) * 100).toFixed(1)), 100)" color="#3b82f6" :show-pivot="false" stroke-width="4px" />
        </view>

        <!-- 脂肪 -->
        <view class="border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)] p-3">
          <view class="mb-1 text-[11px] text-[var(--text-sub)]">
            脂肪
          </view>
          <view class="mb-2">
            <text class="text-base text-[var(--text-main)] font-bold">
              {{ Number(totalIntake.fat).toFixed(1) || 0 }}
            </text>
            <text class="ml-1 text-[11px] text-[var(--text-sub)]">
              / {{ Number(dailyGoal.fat).toFixed(1) }}g
            </text>
          </view>
          <wd-progress :percentage="Math.min(Number(((totalIntake.fat / dailyGoal.fat) * 100).toFixed(1)), 100)" color="#f59e0b" :show-pivot="false" stroke-width="4px" />
        </view>

        <!-- 碳水 -->
        <view class="border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)] p-3">
          <view class="mb-1 text-[11px] text-[var(--text-sub)]">
            碳水
          </view>
          <view class="mb-2">
            <text class="text-base text-[var(--text-main)] font-bold">
              {{ Number(totalIntake.carbs).toFixed(1) || 0 }}
            </text>
            <text class="ml-1 text-[11px] text-[var(--text-sub)]">
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
            @click="goMealRerecord()"
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
.notice{
  margin-bottom: 20rpx;
}
</style>
