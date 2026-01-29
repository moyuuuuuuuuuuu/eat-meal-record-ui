<route lang="json">
{
  "style": {
    "navigationBarTitleText": "选择食物",
    "navigationStyle": "custom"
  }
}
</route>

<template>
  <view class="page-container bg-[var(--page-bg)] min-h-screen">
    <view class="header-container fixed top-0 left-0 w-full z-10 bg-[var(--page-bg)]">
      <wd-navbar title="选择食物" left-arrow @click-left="goBack" />
      <view class="bg-[var(--card-bg)] px-4 py-3 border-b border-[var(--border-color)]">
        <wd-search v-model="searchQuery" placeholder="搜索食物..." hide-cancel />
      </view>
    </view>

    <!-- 顶占位 (44px navbar + ~54px search) -->
    <view class="h-[100px]"></view>

    <!-- 食物列表 -->
    <view class="px-4 py-4 space-y-3 pb-32">
      <view
        v-for="(food, index) in filteredFoods"
        :key="index"
        class="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm active:bg-gray-50 flex justify-between items-center w-full"
        @click="selectFood(food)"
      >
        <view>
          <view class="text-sm font-bold text-[var(--text-main)] mb-1">{{ food.name }}</view>
          <view class="flex gap-3 text-[10px] text-[var(--text-sub)]">
            <text>{{ food.calories }}kcal / {{ food.unit }}</text>
            <text>P:{{ food.protein }}g F:{{ food.fat }}g C:{{ food.carbs }}g</text>
          </view>
        </view>
        <IconPlus size="16" color="#10b981" />
      </view>
    </view>

    <!-- 数量选择模态框 (使用 wd-popup 或自定义) -->
    <wd-popup v-model="showPopup" position="bottom" custom-style="border-radius: 20px 20px 0 0; background: white;">
      <view v-if="currentFood" class="p-6">
        <view class="flex justify-between items-center mb-10">
          <view class="p-2" @click="showPopup = false">
            <IconX size="20" color="#111827" />
          </view>
          <text class="text-lg font-bold text-gray-900">{{ currentFood.name }}</text>
          <view class="w-8"></view>
        </view>

        <!-- 营养概览 -->
        <view class="grid grid-cols-4 gap-4 text-center mb-10">
          <view>
            <view class="text-lg font-bold text-gray-900">{{ popupNutrition.calories }}</view>
            <view class="text-[10px] text-gray-400">千卡</view>
          </view>
          <view>
            <view class="text-lg font-bold text-gray-900">{{ popupNutrition.carbs }}</view>
            <view class="text-[10px] text-gray-400">碳水</view>
          </view>
          <view>
            <view class="text-lg font-bold text-gray-900">{{ popupNutrition.protein }}</view>
            <view class="text-[10px] text-gray-400">蛋白质</view>
          </view>
          <view>
            <view class="text-lg font-bold text-gray-900">{{ popupNutrition.fat }}</view>
            <view class="text-[10px] text-gray-400">脂肪</view>
          </view>
        </view>

        <!-- 数量输入 -->
        <view class="flex flex-col items-center mb-10">
          <view class="flex items-center gap-6">
            <view class="text-4xl font-bold text-gray-900 border-b-2 border-gray-100 pb-2 px-6">
              <input type="digit" v-model="quantity" class="text-center w-24" />
            </view>
          </view>
          <text class="text-xs text-gray-400 mt-4">输入数量 ({{ selectedUnit }})</text>
        </view>

        <!-- 单位选择 -->
        <view class="flex justify-center gap-4 mb-10">
          <view
            v-for="unit in availableUnits"
            :key="unit.name"
            class="px-4 py-2 rounded-full border transition-all"
            :class="selectedUnit === unit.name ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-gray-50 border-gray-100 text-gray-500'"
            @click="selectedUnit = unit.name"
          >
            <text class="text-sm">{{ unit.name }}</text>
          </view>
        </view>

        <wd-button block size="large" @click="confirmSelect">确定</wd-button>
      </view>
    </wd-popup>

    <!-- 拍照识别按钮 -->
    <view class="fixed bottom-10 right-6 w-14 h-14 bg-emerald-500 rounded-full shadow-lg flex items-center justify-center z-20 active:opacity-80 transition-all" @click="handleCamera">
      <IconCamera size="24" color="white" />
    </view>

    <!-- AI 识别引导 -->
    <wd-popup 
      v-model="showCameraGuide" 
      position="bottom" 
      custom-style="border-radius: 24px 24px 0 0; background: var(--card-bg);"
      overlay-style="background-color: rgba(6, 78, 59, 0.45);"
    >
      <view class="p-6">
        <view class="flex justify-between items-center mb-8">
          <view class="p-2" @click="showCameraGuide = false">
            <IconX size="20" color="var(--text-main)" />
          </view>
          <text class="text-lg font-bold text-[var(--text-main)]">AI 识别食物</text>
          <view class="w-10"></view>
        </view>

        <view class="flex flex-col items-center mb-10">
          <view class="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
            <IconCamera size="40" color="#10b981" />
          </view>
          <text class="text-xl font-bold text-[var(--text-main)] mb-4">拍照一键识别</text>
          
          <view class="space-y-4 w-full">
            <view class="flex items-start gap-4">
              <view class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <text class="text-white text-xs">1</text>
              </view>
              <text class="text-sm text-[var(--text-sub)]">对准餐盘拍摄清晰照片</text>
            </view>
            <view class="flex items-start gap-4">
              <view class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <text class="text-white text-xs">2</text>
              </view>
              <text class="text-sm text-[var(--text-sub)]">系统自动识别盘中多种食物</text>
            </view>
            <view class="flex items-start gap-4">
              <view class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <text class="text-white text-xs">3</text>
              </view>
              <text class="text-sm text-[var(--text-sub)]">确认并快速添加到今日餐食</text>
            </view>
          </view>
        </view>

        <view class="space-y-3">
          <wd-button block size="large" @click="handleCameraRecognition" custom-style="background-color: #10b981 !important; border-color: #10b981 !important;">开始识别</wd-button>
          <wd-button block size="large" plain @click="showCameraGuide = false" custom-style="color: #10b981 !important; border-color: #10b981 !important;">返回</wd-button>
        </view>
      </view>
    </wd-popup>

    <!-- 识别结果展示 -->
    <wd-popup 
      v-model="showRecognitionResults" 
      position="bottom" 
      custom-style="border-radius: 24px 24px 0 0; background: var(--card-bg);"
      overlay-style="background-color: rgba(6, 78, 59, 0.45);"
    >
      <view class="p-6">
        <view class="flex justify-between items-center mb-6">
          <view class="p-2" @click="showRecognitionResults = false">
            <IconX size="20" color="var(--text-main)" />
          </view>
          <text class="text-lg font-bold text-[var(--text-main)]">识别结果</text>
          <view class="w-10"></view>
        </view>

        <view class="grid grid-cols-2 gap-3 mb-8">
          <view
            v-for="(food, idx) in recognizedFoods"
            :key="idx"
            class="bg-[var(--page-bg)] rounded-xl p-3 border border-[var(--border-color)] active:border-emerald-500 transition-all font-sans"
            @click="handleRecognizedFoodSelect(food)"
          >
            <view class="text-sm font-bold text-[var(--text-main)] mb-1">{{ food.name }}</view>
            <view class="text-[10px] text-[var(--text-sub)] mb-2">{{ food.unit }} | {{ food.calories }}kcal</view>
            <view class="flex items-center justify-between">
              <text class="text-[9px] text-emerald-600 font-bold">匹配度 98%</text>
              <IconPlus size="12" color="#10b981" />
            </view>
          </view>
        </view>

        <wd-button block size="large" plain @click="showRecognitionResults = false" custom-style="color: #10b981 !important; border-color: #10b981 !important;">重新拍摄</wd-button>
      </view>
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import IconPlus from '@/components/icons/IconPlus.vue'
import IconX from '@/components/icons/IconX.vue'
import IconCamera from '@/components/icons/IconCamera.vue'

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
  if (!searchQuery.value) return commonFoods
  return commonFoods.filter(f => f.name.includes(searchQuery.value))
})

const availableUnits = [
  { name: '份', ratio: 1 },
  { name: '100g', ratio: 1 },
  { name: '克', ratio: 0.01 },
]

const popupNutrition = computed(() => {
  if (!currentFood.value) return { calories: 0, protein: 0, fat: 0, carbs: 0 }
  const ratio = availableUnits.find(u => u.name === selectedUnit.value)?.ratio || 1
  const q = parseFloat(quantity.value.toString()) || 0
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
  // 模拟逻辑：发送数据回上一个页面或存入 Store
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

<style scoped>
:deep(.wd-search) {
  padding: 0;
  background: transparent;
}
</style>
