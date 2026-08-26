<script setup lang="ts">
import type { FoodInfo, TmpFoodUnit } from '@/api/globals'
import { usePagination } from 'alova/client'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconX from '@/components/icons/IconX.vue'
import { useAuth } from '@/composables/useAuth'
import { useSystemInfo } from '@/composables/useSystemInfo'

const { statusBarHeight, navBarHeight } = useSystemInfo()

definePage({
  style: {
    navigationBarTitleText: '选择食物',
    navigationStyle: 'custom',
  },
})

const { isLogin } = useAuth()

onShow(() => {
  if (!isLogin.value) {
    uni.navigateTo({ url: '/pages/login/index' })
  }
})

const searchQuery = ref('')

const {
  loading,
  data: foodList,
  isLastPage,
  page,
} = usePagination(
  (page, pageSize) => Apis.food.search({ params: { page, pageSize, name: searchQuery.value } }),
  {
    initialData: { total: 0, data: [] },
    data: res => res.data,
    total: res => res.total,
    initialPageSize: 15,
    watchingStates: [searchQuery],
    debounce: 300,
    append: true,
  },
)

const showSkeleton = computed(() => {
  return loading.value && page.value === 1 && foodList.value.length === 0
})

const showPopup = ref(false)
const currentFood = ref<FoodInfo | null>(null)
const quantity = ref(1)
const selectedUnit = ref<TmpFoodUnit>()
const hasReachedBottom = ref(false)

onReachBottom(() => {
  hasReachedBottom.value = true
  if (!isLastPage.value && !loading.value)
    page.value++
})

const availableUnits = computed<TmpFoodUnit[]>(() => {
  if (!currentFood.value || !currentFood.value.units)
    return []
  return currentFood.value.units.map(u => ({
    name: u.unit_name,
    id: u.unit_id,
    isDefault: u.is_default,
    nutrition: u.nutrition,
  }))
})

const popupNutrition = computed(() => {
  if (!currentFood.value)
    return { calories: 0, protein: 0, fat: 0, carbs: 0 }
  const unit = availableUnits.value.find(u => u.name === selectedUnit.value?.name)
  if (!unit)
    return { calories: 0, protein: 0, fat: 0, carbs: 0 }
  const q = Number.parseFloat(quantity.value.toString()) || 0
  return {
    calories: Math.round(Number(unit.nutrition.calories) * q),
    protein: (Number(unit.nutrition.protein) * q).toFixed(1),
    fat: (Number(unit.nutrition.fat || 0) * q).toFixed(1),
    carbs: (Number(unit.nutrition.carbs) * q).toFixed(1),
  }
})

onPullDownRefresh(async () => {
  page.value = 1
  hasReachedBottom.value = false
  uni.stopPullDownRefresh()
})

function goBack() {
  uni.navigateBack()
}

function selectFood(food: FoodInfo) {
  currentFood.value = food
  selectedUnit.value = availableUnits.value.find(u => u.isDefault) || availableUnits.value[0]
  quantity.value = 1
  showPopup.value = true
}

function confirmSelect() {
  if (!currentFood.value)
    return
  const unit = selectedUnit.value
  if (!unit)
    return
  const q = Number.parseFloat(quantity.value.toString()) || 0
  const selectedFood = {
    ...currentFood.value,
    quantity: q,
    selectedUnit: selectedUnit.value,
    totalCalories: Math.round(Number(unit.nutrition.calories) * q),
    totalProtein: (Number(unit.nutrition.protein) * q).toFixed(1),
    totalFat: (Number(unit.nutrition.fat || 0) * q).toFixed(1),
    totalCarbs: (Number(unit.nutrition.carbs) * q).toFixed(1),
  }
  uni.$emit('add-food-item', selectedFood)
  uni.showToast({ title: '已添加', icon: 'success' })
  showPopup.value = false
  setTimeout(() => uni.navigateBack(), 1000)
}
</script>

<template>
  <view class="page-container min-h-screen bg-[var(--page-bg)]">
    <!-- 顶部固定区：导航 + 搜索栏 -->
    <view class="fixed left-0 top-0 z-10 w-full bg-[var(--page-bg)]">
      <wd-navbar title="选择食物" left-arrow safe-area-inset-top @click-left="goBack" />
      <view class="border-b border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3">
        <wd-search v-model="searchQuery" placeholder="搜索食物..." hide-cancel />
      </view>
    </view>

    <!-- 顶部占位 -->
    <view :style="{ height: `${statusBarHeight + navBarHeight + 64}px` }" />

    <!-- 食物列表 -->
    <view class="mt-6 px-4 pb-10 space-y-2">
      <!-- 骨架屏 -->
      <template v-if="showSkeleton">
        <view v-for="i in 5" :key="i" class="mt-6 w-full rounded-xl bg-[var(--card-bg)] shadow-sm">
          <wd-skeleton title :row="1" loading />
        </view>
      </template>

      <template v-else>
        <!-- 空状态 -->
        <view v-if="!loading && foodList.length === 0" class="flex flex-col items-center justify-center py-24 space-y-4">
          <view class="h-20 w-20 flex items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/20">
            <IconSearch size="36" color="#0d9488" class="opacity-60" />
          </view>
          <view class="text-center space-y-1">
            <text class="block text-sm text-[var(--text-main)] font-semibold">
              没有找到相关食物
            </text>
            <text class="block text-xs text-[var(--text-sub)]">
              换个关键词试试吧
            </text>
          </view>
        </view>

        <!-- 列表项 -->
        <view
          v-for="(food, index) in foodList"
          :key="index"
          class="w-full flex items-center justify-between border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)] p-4 shadow-sm transition-all active:border-teal-200 active:bg-teal-50/40 dark:active:border-teal-800/50 dark:active:bg-teal-950/20"
          @click="selectFood(food)"
        >
          <view class="min-w-0 flex-1">
            <view class="mb-1.5 text-sm text-[var(--text-main)] font-bold">
              {{ food.name }}
            </view>
            <view class="flex flex-wrap gap-x-3 gap-y-0.5">
              <view class="flex items-center gap-1">
                <view class="h-1.5 w-1.5 rounded-full bg-teal-400" />
                <text class="text-[10px] text-teal-600 font-medium dark:text-teal-400">
                  {{ food.calories }} kcal / {{ food.unit }}
                </text>
              </view>
              <text class="text-[10px] text-[var(--text-sub)]">
                蛋白 {{ food.protein || 0 }}g · 脂肪 {{ food.fat || 0 }}g · 碳水 {{ food.carbs || 0 }}g
              </text>
            </view>
          </view>
          <view class="ml-3 h-8 w-8 flex flex-shrink-0 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/30">
            <IconPlus size="15" color="#0d9488" />
          </view>
        </view>
      </template>

      <!-- 加载更多 -->
      <ListLoadMore
        v-if="!showSkeleton"
        :reached-bottom="hasReachedBottom"
        :loading="loading"
        :finished="isLastPage"
      />
    </view>

    <!-- ── 食物详情弹窗 ── -->
    <wd-popup
      v-model="showPopup"
      position="bottom"
      :z-index="50"
      custom-style="border-radius: 20px 20px 0 0; background: var(--card-bg);"
    >
      <view v-if="currentFood" class="p-5">
        <!-- 标题栏 -->
        <view class="mb-5 flex items-center justify-between">
          <view
            class="h-8 w-8 flex items-center justify-center rounded-full active:opacity-70"
            @click="showPopup = false"
          >
            <IconX size="16" color="var(--text-main)" />
          </view>
          <text class="text-base text-[var(--text-main)] font-bold">
            {{ currentFood.name }}
          </text>
          <view class="w-8" />
        </view>

        <!-- 营养概览四格 -->
        <view class="grid grid-cols-4 mb-6 gap-2 rounded-xl bg-teal-50/60 p-3 text-center dark:bg-teal-900/15">
          <view>
            <text class="block text-base text-teal-600 font-bold dark:text-teal-400">
              {{ popupNutrition.calories }}
            </text>
            <text class="text-[9px] text-[var(--text-sub)]">
              千卡
            </text>
          </view>
          <view>
            <text class="block text-base text-[var(--text-main)] font-bold">
              {{ popupNutrition.carbs }}
            </text>
            <text class="text-[9px] text-[var(--text-sub)]">
              碳水
            </text>
          </view>
          <view>
            <text class="block text-base text-[var(--text-main)] font-bold">
              {{ popupNutrition.protein }}
            </text>
            <text class="text-[9px] text-[var(--text-sub)]">
              蛋白质
            </text>
          </view>
          <view>
            <text class="block text-base text-[var(--text-main)] font-bold">
              {{ popupNutrition.fat }}
            </text>
            <text class="text-[9px] text-[var(--text-sub)]">
              脂肪
            </text>
          </view>
        </view>

        <!-- 数量输入 -->
        <view class="mb-6 flex flex-col items-center">
          <view class="border-b-2 border-teal-200 px-4 pb-1 dark:border-teal-700">
            <input v-model="quantity" type="digit" class="h-24 w-40 text-center text-7xl text-[var(--text-main)]">
          </view>
          <text class="mt-2 text-xs text-[var(--text-sub)]">
            输入数量 ({{ selectedUnit?.name || '' }})
          </text>
        </view>

        <!-- 单位选择 -->
        <view class="mb-8 flex justify-center gap-3">
          <view
            v-for="unit in availableUnits"
            :key="unit.name"
            class="border rounded-full px-3 py-1.5 text-xs transition-all"
            :class="selectedUnit?.id === unit.id
              ? 'border-teal-500 bg-teal-500 text-white'
              : 'border-[var(--border-color)] bg-[var(--page-bg)] text-[var(--text-sub)]'"
            @click="selectedUnit = unit"
          >
            <text>{{ unit.name }}</text>
          </view>
        </view>

        <!-- 确定按钮 -->
        <view
          class="h-12 w-full flex items-center justify-center rounded-xl bg-teal-500 active:opacity-80"
          @click="confirmSelect"
        >
          <text class="text-base text-white font-semibold">
            确定添加
          </text>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<style scoped>
.page-container {
  padding-bottom: env(safe-area-inset-bottom);
}

:deep(.wd-search) {
  padding: 0;
  background: transparent;
}
</style>
