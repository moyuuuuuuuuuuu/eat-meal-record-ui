<route lang="json">
{
  "style": {
    "navigationBarTitleText": "添加餐食",
    "navigationStyle": "custom"
  }
}
</route>

<template>
  <view class="page-container bg-[var(--page-bg)] h-screen flex flex-col overflow-hidden">
    <wd-navbar title="添加餐食" fixed placeholder left-arrow @click-left="goBack">
      <template #right>
        <view class="save-btn" :class="{ 'disabled': !foodItems.length }" @click="handleSave">
          <IconSave size="14" color="white" />
          <text class="ml-1">保存</text>
        </view>
      </template>
    </wd-navbar>

    <scroll-view scroll-y class="flex-1 px-4 py-4 space-y-4">
      <view class="pb-24 space-y-4">
      <!-- 餐次提示 -->
      <view class="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
        <view class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></view>
        <text class="text-sm font-bold text-gray-900">正在添加：</text>
        <text class="text-sm font-bold text-emerald-600">{{ mealType }}</text>
      </view>

      <!-- 已添加食物 -->
      <view v-if="foodItems.length" class="bg-white rounded-xl p-4 shadow-sm">
        <view class="flex items-center justify-between mb-3 px-1">
          <text class="text-xs font-bold text-gray-400 uppercase">已选食物</text>
          <text class="text-[10px] text-gray-300">{{ foodItems.length }} 项</text>
        </view>
        <view class="space-y-3">
          <view v-for="(item, index) in foodItems" :key="index" class="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
            <view>
              <view class="flex items-center gap-2 mb-1">
                <text class="text-sm font-bold text-gray-900">{{ item.name }}</text>
                <text class="text-xs text-emerald-600 font-bold">{{ item.quantity }} {{ item.selectedUnit }}</text>
              </view>
              <text class="text-[10px] text-gray-400">{{ item.totalCalories }}kcal | P:{{ item.totalProtein }}g F:{{ item.totalFat }}g C:{{ item.totalCarbs }}g</text>
            </view>
            <view class="p-1" @click="removeItem(index)">
              <IconX size="14" color="#ef4444" />
            </view>
          </view>
        </view>
      </view>

      <!-- 汇总卡片 -->
      <view v-if="foodItems.length" class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 shadow-lg text-white">
        <text class="text-[10px] font-bold opacity-40 uppercase mb-3 block">今日营养汇总</text>
        <view class="grid grid-cols-2 gap-3">
          <view class="bg-white/5 rounded-lg p-3">
            <view class="text-[10px] opacity-40 mb-1">热量</view>
            <view class="text-xl font-bold text-emerald-400">{{ totals.calories.toFixed(0) }} <text class="text-[10px] font-normal opacity-40 ml-1">kcal</text></view>
          </view>
          <view class="bg-white/5 rounded-lg p-3">
            <view class="text-[10px] opacity-40 mb-1">蛋白质</view>
            <view class="text-xl font-bold text-blue-400">{{ totals.protein.toFixed(1) }} <text class="text-[10px] font-normal opacity-40 ml-1">g</text></view>
          </view>
          <view class="bg-white/5 rounded-lg p-3">
            <view class="text-[10px] opacity-40 mb-1">脂肪</view>
            <view class="text-xl font-bold text-orange-400">{{ totals.fat.toFixed(1) }} <text class="text-[10px] font-normal opacity-40 ml-1">g</text></view>
          </view>
          <view class="bg-white/5 rounded-lg p-3">
            <view class="text-[10px] opacity-40 mb-1">碳水</view>
            <view class="text-xl font-bold text-purple-400">{{ totals.carbs.toFixed(1) }} <text class="text-[10px] font-normal opacity-40 ml-1">g</text></view>
          </view>
        </view>
      </view>

      <!-- 添加按钮 -->
      <view class="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2" @click="goToFoodSelector">
        <view class="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
          <IconPlus size="20" color="#10b981" />
        </view>
        <text class="text-sm font-bold text-emerald-600">添加食物</text>
      </view>
    </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
const mealType = ref('早餐')
const foodItems = ref<any[]>([])

onLoad((options: any) => {
  if (options.type) mealType.value = options.type
})

const totals = computed(() => {
  return foodItems.value.reduce((acc, item) => ({
    calories: acc.calories + item.totalCalories,
    protein: acc.protein + item.totalProtein,
    fat: acc.fat + item.totalFat,
    carbs: acc.carbs + item.totalCarbs
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
    url: '/pages/food-selector/index'
  })
}

function handleSave() {
  if (!foodItems.value.length) return
  uni.showToast({ title: '已保存', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1500)
}
</script>

<style scoped>
.save-btn {
  background-color: #10b981;
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
