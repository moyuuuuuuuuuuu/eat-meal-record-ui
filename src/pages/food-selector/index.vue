<route lang="json">
{
  "style": {
    "navigationBarTitleText": "选择食物",
    "navigationStyle": "custom"
  }
}
</route>

<script setup lang="ts">
import IconCamera from '@/components/icons/IconCamera.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconX from '@/components/icons/IconX.vue'

const searchQuery = ref('')
const showPopup = ref(false)
const currentFood = ref<any>(null)
const quantity = ref(1)
const selectedUnit = ref('')

const commonFoods = [
  { name: '燕麦粥', unit: '100g', calories: 68, protein: 2.4, fat: 1.4, carbs: 12 },
  { name: '煮鸡蛋', unit: '1个', calories: 78, protein: 6.3, fat: 5.3, carbs: 0.6 },
  { name: '全麦面包', unit: '1片', calories: 90, protein: 3.5, fat: 1.2, carbs: 17 },
  { name: '牛奶', unit: '100ml', calories: 60, protein: 3.2, fat: 3.4, carbs: 4.8 },
  { name: '糙米饭', unit: '100g', calories: 111, protein: 2.6, fat: 0.9, carbs: 23 },
  { name: '鸡胸肉', unit: '100g', calories: 133, protein: 24, fat: 5, carbs: 0 },
  { name: '西兰花', unit: '100g', calories: 34, protein: 2.8, fat: 0.4, carbs: 6.6 },
  { name: '三文鱼', unit: '100g', calories: 206, protein: 20, fat: 13, carbs: 0 },
]

const filteredFoods = computed(() => {
  if (!searchQuery.value)
    return commonFoods
  return commonFoods.filter(f => f.name.includes(searchQuery.value))
})

const availableUnits = [
  { name: '份', ratio: 1 },
  { name: '100g', ratio: 1 },
  { name: '克', ratio: 0.01 },
]

const popupNutrition = computed(() => {
  if (!currentFood.value)
    return { calories: 0, protein: 0, fat: 0, carbs: 0 }
  const ratio = availableUnits.find(u => u.name === selectedUnit.value)?.ratio || 1
  const q = Number.parseFloat(quantity.value.toString()) || 0
  return {
    calories: Math.round(currentFood.value.calories * ratio * q),
    protein: (currentFood.value.protein * ratio * q).toFixed(1),
    fat: (currentFood.value.fat * ratio * q).toFixed(1),
    carbs: (currentFood.value.carbs * ratio * q).toFixed(1),
  }
})

function goBack() {
  uni.navigateBack()
}

function selectFood(food: any) {
  currentFood.value = food
  selectedUnit.value = food.unit === '100g' ? '100g' : '份'
  quantity.value = 1
  showPopup.value = true
}

function confirmSelect() {
  if (!currentFood.value)
    return

  const ratio = availableUnits.find(u => u.name === selectedUnit.value)?.ratio || 1
  const q = Number.parseFloat(quantity.value.toString()) || 0

  const selectedFood = {
    ...currentFood.value,
    quantity: q,
    selectedUnit: selectedUnit.value,
    totalCalories: Math.round(currentFood.value.calories * ratio * q),
    totalProtein: (currentFood.value.protein * ratio * q).toFixed(1),
    totalFat: (currentFood.value.fat * ratio * q).toFixed(1),
    totalCarbs: (currentFood.value.carbs * ratio * q).toFixed(1),
  }

  uni.$emit('add-food-item', selectedFood)
  uni.showToast({ title: '已添加', icon: 'success' })
  showPopup.value = false
  setTimeout(() => uni.navigateBack(), 1000)
}

const showCameraGuide = ref(false)
const showRecognitionResults = ref(false)
const recognizedFoods = ref<any[]>([])

function handleCamera() {
  showCameraGuide.value = true
}

function handleCameraRecognition() {
  uni.showLoading({ title: 'AI 识别中...' })
  setTimeout(() => {
    uni.hideLoading()
    recognizedFoods.value = [
      { name: '糙米饭', unit: '100g', calories: 111, protein: 2.6, fat: 0.9, carbs: 23 },
      { name: '鸡胸肉', unit: '100g', calories: 133, protein: 24, fat: 5, carbs: 0 },
      { name: '西兰花', unit: '100g', calories: 34, protein: 2.8, fat: 0.4, carbs: 6.6 },
      { name: '煮鸡蛋', unit: '1个', calories: 78, protein: 6.3, fat: 5.3, carbs: 0.6 },
    ]
    showCameraGuide.value = false
    showRecognitionResults.value = true
  }, 1500)
}

function handleRecognizedFoodSelect(food: any) {
  showRecognitionResults.value = false
  selectFood(food)
}
</script>

<template>
  <view class="page-container min-h-screen bg-[var(--page-bg)]">
    <view class="header-container fixed left-0 top-0 z-10 w-full bg-[var(--page-bg)]">
      <wd-navbar title="选择食物" left-arrow @click-left="goBack" />
      <view class="border-b border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3">
        <wd-search v-model="searchQuery" placeholder="搜索食物..." hide-cancel />
      </view>
    </view>

    <!-- 顶占位 (44px navbar + ~54px search) -->
    <view class="h-[100px]" />

    <!-- 食物列表 -->
    <view class="px-4 py-4 pb-32 space-y-3">
      <view
        v-for="(food, index) in filteredFoods"
        :key="index"
        class="w-full flex items-center justify-between rounded-xl bg-[var(--card-bg)] p-4 shadow-sm active:bg-[var(--page-bg)]"
        @click="selectFood(food)"
      >
        <view>
          <view class="mb-1 text-sm text-[var(--text-main)] font-bold">
            {{ food.name }}
          </view>
          <view class="flex gap-3 text-[10px] text-[var(--text-sub)]">
            <text>{{ food.calories }}kcal / {{ food.unit }}</text>
            <text>P:{{ food.protein }}g F:{{ food.fat }}g C:{{ food.carbs }}g</text>
          </view>
        </view>
        <IconPlus size="16" color="#10b981" />
      </view>
    </view>

    <wd-popup v-model="showPopup" position="bottom" :z-index="50" custom-style="border-radius: 20px 20px 0 0; background: var(--card-bg);">
      <view v-if="currentFood" class="p-5">
        <view class="mb-6 flex items-center justify-between">
          <view class="p-1" @click="showPopup = false">
            <IconX size="20" color="var(--text-main)" />
          </view>
          <text class="text-base text-[var(--text-main)] font-bold">
            {{ currentFood.name }}
          </text>
          <view class="w-7" />
        </view>

        <!-- 营养概览 -->
        <view class="grid grid-cols-4 mb-6 gap-2 text-center">
          <view>
            <view class="text-base text-[var(--text-main)] font-bold">
              {{ popupNutrition.calories }}
            </view>
            <view class="text-[9px] text-[var(--text-sub)]">
              千卡
            </view>
          </view>
          <view>
            <view class="text-base text-[var(--text-main)] font-bold">
              {{ popupNutrition.carbs }}
            </view>
            <view class="text-[9px] text-[var(--text-sub)]">
              碳水
            </view>
          </view>
          <view>
            <view class="text-base text-[var(--text-main)] font-bold">
              {{ popupNutrition.protein }}
            </view>
            <view class="text-[9px] text-[var(--text-sub)]">
              蛋白质
            </view>
          </view>
          <view>
            <view class="text-base text-[var(--text-main)] font-bold">
              {{ popupNutrition.fat }}
            </view>
            <view class="text-[9px] text-[var(--text-sub)]">
              脂肪
            </view>
          </view>
        </view>

        <!-- 数量输入 -->
        <view class="mb-6 flex flex-col items-center">
          <view class="flex items-center gap-4">
            <view class="border-b-2 border-[var(--border-color)] px-4 pb-1 font-bold">
              <input v-model="quantity" type="digit" class="h-24 w-40 text-center text-7xl text-[var(--text-main)]">
            </view>
          </view>
          <text class="mt-2 text-xs text-[var(--text-sub)]">
            输入数量 ({{ selectedUnit }})
          </text>
        </view>

        <!-- 单位选择 -->
        <view class="mb-8 flex justify-center gap-3">
          <view
            v-for="unit in availableUnits"
            :key="unit.name"
            class="border rounded-full px-3 py-1.5 text-xs transition-all"
            :class="selectedUnit === unit.name ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-[var(--page-bg)] border-[var(--border-color)] text-[var(--text-sub)]'"
            @click="selectedUnit = unit.name"
          >
            <text>
              {{ unit.name }}
            </text>
          </view>
        </view>

        <wd-button block type="success" size="large" class="from-emerald-500 to-emerald-600 bg-gradient-to-r !border-none !text-white" @click="confirmSelect">
          确定
        </wd-button>
      </view>
    </wd-popup>

    <!-- 拍照识别按钮 -->
    <view class="fixed bottom-10 right-6 z-20 h-14 w-14 flex items-center justify-center rounded-full from-emerald-500 to-emerald-600 bg-gradient-to-r shadow-lg transition-all active:opacity-80" @click="handleCamera">
      <IconCamera size="24" color="white" />
    </view>

    <!-- AI 识别引导 -->
    <wd-popup
      v-model="showCameraGuide"
      position="bottom"
      :z-index="50"
      custom-style="border-radius: 24px 24px 0 0; background: var(--card-bg);"
      overlay-style="background-color: rgba(0, 0, 0, 0.5);"
    >
      <view class="p-6">
        <view class="mb-8 flex items-center justify-between">
          <view class="p-2" @click="showCameraGuide = false">
            <IconX size="20" color="var(--text-main)" />
          </view>
          <text class="text-lg text-[var(--text-main)] font-bold">
            AI 识别食物
          </text>
          <view class="w-10" />
        </view>

        <view class="mb-10 flex flex-col items-center">
          <view class="mb-6 h-20 w-20 flex items-center justify-center rounded-full bg-emerald-50">
            <IconCamera size="40" class="text-emerald-500" />
          </view>
          <text class="mb-4 text-xl text-[var(--text-main)] font-bold">
            拍照一键识别
          </text>

          <view class="w-full space-y-4">
            <view class="flex items-start gap-4">
              <view class="mt-0.5 h-6 w-6 flex flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <text class="text-xs text-white">
                  1
                </text>
              </view>
              <text class="text-sm text-[var(--text-sub)]">
                对准餐盘拍摄清晰照片
              </text>
            </view>
            <view class="flex items-start gap-4">
              <view class="mt-0.5 h-6 w-6 flex flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <text class="text-xs text-white">
                  2
                </text>
              </view>
              <text class="text-sm text-[var(--text-sub)]">
                系统自动识别盘中多种食物
              </text>
            </view>
            <view class="flex items-start gap-4">
              <view class="mt-0.5 h-6 w-6 flex flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <text class="text-xs text-white">
                  3
                </text>
              </view>
              <text class="text-sm text-[var(--text-sub)]">
                确认并快速添加到今日餐食
              </text>
            </view>
          </view>
        </view>

        <view class="space-y-3">
          <wd-button block size="large" type="success" custom-class="confirm-btn" @click="handleCameraRecognition">
            开始识别
          </wd-button>
          <wd-button size="large" plain type="success" block @click="showCameraGuide = false">
            返回
          </wd-button>
        </view>
      </view>
    </wd-popup>

    <!-- 识别结果展示 -->
    <wd-popup
      v-model="showRecognitionResults"
      position="bottom"
      :z-index="50"
      custom-style="border-radius: 24px 24px 0 0; background: var(--card-bg);"
      overlay-style="background-color: rgba(0, 0, 0, 0.5);"
    >
      <view class="p-6">
        <view class="mb-6 flex items-center justify-between">
          <view class="p-2" @click="showRecognitionResults = false">
            <IconX size="20" color="var(--text-main)" />
          </view>
          <text class="text-lg text-[var(--text-main)] font-bold">
            识别结果
          </text>
          <view class="w-10" />
        </view>

        <view class="grid grid-cols-2 mb-8 gap-3">
          <view
            v-for="(food, idx) in recognizedFoods"
            :key="idx"
            class="border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)] p-3 font-sans transition-all active:border-emerald-500"
            @click="handleRecognizedFoodSelect(food)"
          >
            <view class="mb-1 text-sm text-[var(--text-main)] font-bold">
              {{ food.name }}
            </view>
            <view class="mb-2 text-[10px] text-[var(--text-sub)]">
              {{ food.unit }} | {{ food.calories }}kcal
            </view>
            <view class="flex items-center justify-between">
              <text class="text-[9px] text-emerald-600 font-bold">
                匹配度 98%
              </text>
              <IconPlus size="12" class="text-emerald-500" />
            </view>
          </view>
        </view>

        <wd-button size="large" type="success" plain block @click="showRecognitionResults = false">
          重新拍摄
        </wd-button>
      </view>
    </wd-popup>
  </view>
</template>

<style scoped>
:deep(.wd-search) {
  padding: 0;
  background: transparent;
}
:deep(.confirm-btn) {
  --at-apply: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-none";
}
</style>
