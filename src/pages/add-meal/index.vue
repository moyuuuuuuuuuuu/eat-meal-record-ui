<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '添加餐食',
    navigationStyle: 'custom',
  },
})
const mealType = ref('早餐')
const foodItems = ref<any[]>([])

onLoad((options: any) => {
  if (options.type)
    mealType.value = options.type
})

const totals = computed(() => {
  return foodItems.value.reduce((acc, item) => ({
    calories: Number(acc.calories) + Number(item.totalCalories),
    protein: Number(acc.protein) + Number(item.totalProtein),
    fat: Number(acc.fat) + Number(item.totalFat),
    carbs: Number(acc.carbs) + Number(item.totalCarbs),
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 })
})

function goBack() {
  uni.navigateBack()
}

function removeItem(index: number) {
  foodItems.value.splice(index, 1)
}

function goToFoodSelector() {
  uni.navigateTo({
    url: '/pages/food-selector/index',
  })
}

onMounted(() => {
  uni.$on('add-food-item', (item: any) => {
    foodItems.value.push(item)
  })
})

onUnload(() => {
  uni.$off('add-food-item')
})

function handleSave() {
  if (!foodItems.value.length)
    return
  uni.showToast({ title: '已保存', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1500)
}
</script>

<template>
  <view class="page-container h-screen flex flex-col overflow-hidden bg-[var(--page-bg)]">
    <wd-navbar title="添加餐食" placeholder left-arrow fixed @click-left="goBack">
      <template #right>
        <view
          class="save-btn from-emerald-500 to-emerald-600 bg-gradient-to-r" :class="{ disabled: !foodItems.length }"
          @click="handleSave"
        >
          <IconSave size="14" color="white" />
          <text class="ml-1">
            保存
          </text>
        </view>
      </template>
    </wd-navbar>

    <scroll-view scroll-y class="flex-1 px-4 py-4 space-y-4">
      <view class="pb-24 space-y-4">
        <!-- 餐次提示 -->
        <view
          class="flex items-center gap-3 border border-emerald-100 rounded-xl bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20"
        >
          <view class="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgb(16,185,129,0.6)]" />
          <text class="text-sm text-[var(--text-main)] font-bold">
            正在添加：
          </text>
          <text class="text-sm text-emerald-600 font-bold">
            {{ mealType }}
          </text>
        </view>

        <!-- 已添加食物 -->
        <view v-if="foodItems.length" class="rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
          <view class="mb-3 flex items-center justify-between px-1">
            <text class="text-xs text-[var(--text-sub)] font-bold uppercase">
              已选食物
            </text>
            <text class="text-[10px] text-[var(--text-sub)]/40">
              {{ foodItems.length }} 项
            </text>
          </view>
          <view class="space-y-3">
            <view
              v-for="(item, index) in foodItems" :key="index"
              class="flex items-center justify-between rounded-lg bg-[var(--page-bg)] p-3"
            >
              <view>
                <view class="mb-1 flex items-center gap-2">
                  <text class="text-sm text-[var(--text-main)] font-bold">
                    {{ item.name }}
                  </text>
                  <text class="text-xs text-emerald-600 font-bold">
                    {{ item.quantity }} {{ item.selectedUnit.name }}
                  </text>
                </view>
                <text class="text-[10px] text-[var(--text-sub)]">
                  {{ item.totalCalories || 0 }}kcal | 蛋白质:{{ item.totalProtein || 0 }}g 脂肪:{{ item.totalFat || 0 }}g 碳水:{{ item.totalCarbs || 0 }}g
                </text>
              </view>
              <view class="p-1" @click="removeItem(index)">
                <IconX size="14" color="#ef4444" />
              </view>
            </view>
          </view>
        </view>

        <!-- 汇总卡片 -->
        <view
          v-if="foodItems.length"
          class="border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)] p-4 shadow-sm transition-all dark:border-[var(--wot-color-theme)]/10"
        >
          <text class="mb-4 block text-[10px] text-[var(--text-sub)] font-bold uppercase">
            今日营养汇总
          </text>
          <view class="grid grid-cols-2 gap-3">
            <view class="border border-[var(--border-color)] rounded-lg bg-[var(--page-bg)] p-3 shadow-sm">
              <view class="mb-1 text-[10px] text-[var(--text-sub)]">
                热量
              </view>
              <view class="text-xl text-emerald-500 font-bold">
                {{ totals.calories.toFixed(0) }}
                <text class="ml-1 text-[10px] text-[var(--text-sub)] font-normal">
                  kcal
                </text>
              </view>
            </view>
            <view class="border border-[var(--border-color)] rounded-lg bg-[var(--page-bg)] p-3 shadow-sm">
              <view class="mb-1 text-[10px] text-[var(--text-sub)]">
                蛋白质
              </view>
              <view class="text-xl text-blue-500 font-bold dark:text-blue-400">
                {{ totals.protein.toFixed(1) }}
                <text class="ml-1 text-[10px] text-[var(--text-sub)] font-normal">
                  g
                </text>
              </view>
            </view>
            <view class="border border-[var(--border-color)] rounded-lg bg-[var(--page-bg)] p-3 shadow-sm">
              <view class="mb-1 text-[10px] text-[var(--text-sub)]">
                脂肪
              </view>
              <view class="text-xl text-orange-500 font-bold dark:text-orange-400">
                {{ totals.fat.toFixed(1) }}
                <text class="ml-1 text-[10px] text-[var(--text-sub)] font-normal">
                  g
                </text>
              </view>
            </view>
            <view class="border border-[var(--border-color)] rounded-lg bg-[var(--page-bg)] p-3 shadow-sm">
              <view class="mb-1 text-[10px] text-[var(--text-sub)]">
                碳水
              </view>
              <view class="text-xl text-purple-500 font-bold dark:text-purple-400">
                {{ totals.carbs.toFixed(1) }}
                <text class="ml-1 text-[10px] text-[var(--text-sub)] font-normal">
                  g
                </text>
              </view>
            </view>
          </view>
        </view>

        <!-- 添加按钮 -->
        <view
          class="flex flex-col items-center justify-center gap-2 border-2 border-[var(--border-color)] rounded-xl border-dashed bg-[var(--card-bg)] p-6 transition-all active:border-emerald-500 active:bg-emerald-50"
          @click="goToFoodSelector"
        >
          <view
            class="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20"
          >
            <IconPlus size="20" />
          </view>
          <text class="text-sm text-emerald-600 font-bold">
            添加食物
          </text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.save-btn {
  color: white;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  font-size: 13px;
  display: flex;
  align-items: center;
  font-weight: bold;
}

.save-btn.disabled {
  opacity: 0.5;
  background-color: #9ca3af;
}
</style>
