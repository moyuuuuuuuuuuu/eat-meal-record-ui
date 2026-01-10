<template>
  <view class="page-container" :class="themeStore.effectiveTheme">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="header-content">
        <wd-button type="text" @tap="handleClose" class="close-btn">✕</wd-button>
        <view class="title">选择食物</view>
        <view style="width: 80rpx;"></view>
      </view>
    </view>

    <!-- 搜索框 -->
    <view class="search-section">
      <wd-search
        v-model="searchKeyword"
        placeholder="搜索食物名称"
        @search="onSearch"
        @clear="onClear"
        :clearable="true"
      />
    </view>

    <!-- 拍照识别按钮 -->
    <view class="camera-section" @tap="handleCamera">
      <view class="camera-btn">
        <text class="camera-icon">📸</text>
        <text class="camera-text">拍照识别食物</text>
      </view>
    </view>

    <!-- 识别结果（显示时） -->
    <view v-if="recognitionResults.length > 0" class="section">
      <view class="section-title">识别结果</view>
      <view class="recognition-list">
        <view
          v-for="(item, index) in recognitionResults"
          :key="index"
          class="recognition-item"
          @tap="selectRecognitionItem(item)"
        >
          <view class="recognition-info">
            <text class="recognition-name">{{ item.name }}</text>
            <text class="recognition-amount">{{ item.amount }}</text>
            <text class="recognition-calories">{{ item.calories }}kcal</text>
          </view>
          <view class="confidence">置信度: {{ (item.confidence * 100).toFixed(0) }}%</view>
        </view>
      </view>
    </view>

    <!-- 食物分类 -->
    <view v-if="!searchKeyword && recognitionResults.length === 0" class="section">
      <view class="section-title">食物分类</view>
      <view class="category-grid">
        <view
          v-for="category in foodCategories"
          :key="category.name"
          class="category-card"
          @tap="selectCategory(category)"
        >
          <view class="category-icon">{{ category.icon }}</view>
          <view class="category-name">{{ category.name }}</view>
        </view>
      </view>
    </view>

    <!-- 搜索结果 / 分类详情 -->
    <view v-if="showFoodList" class="section">
      <view class="section-title">{{ currentCategoryName }}</view>
      <view class="food-list">
        <view
          v-for="food in filteredFoods"
          :key="food.name"
          class="food-item"
          @tap="selectFood(food)"
        >
          <view class="food-info">
            <text class="food-name">{{ food.name }}</text>
            <text class="food-nutrients">
              {{ food.caloriesPer100g }}kcal/100{{ food.unit }}
            </text>
          </view>
          <wd-button type="primary" size="small">选择</wd-button>
        </view>
      </view>
    </view>

    <!-- 数量选择弹窗 -->
    <wd-popup v-model="showAmountDialog" position="bottom" :style="{ height: '50vh' }">
      <view class="amount-dialog">
        <view class="dialog-header">
          <view class="dialog-title">{{ selectedFood?.name }}</view>
          <wd-button type="text" @tap="showAmountDialog = false">✕</wd-button>
        </view>

        <view class="amount-input-section">
          <view class="input-label">数量</view>
          <wd-input-number
            v-model="selectedAmount"
            :min="1"
            :max="1000"
            :step="selectedFood?.unit === 'g' ? 10 : 1"
            @change="onAmountChange"
          />
          <view class="unit-display">{{ selectedFood?.unit }}</view>
        </view>

        <view class="nutrition-preview">
          <view class="preview-title">营养预览</view>
          <view class="preview-grid">
            <view class="preview-item">
              <text class="preview-label">卡路里</text>
              <text class="preview-value">{{ previewCalories }}kcal</text>
            </view>
            <view class="preview-item">
              <text class="preview-label">蛋白质</text>
              <text class="preview-value">{{ previewProtein }}g</text>
            </view>
            <view class="preview-item">
              <text class="preview-label">碳水</text>
              <text class="preview-value">{{ previewCarbs }}g</text>
            </view>
            <view class="preview-item">
              <text class="preview-label">脂肪</text>
              <text class="preview-value">{{ previewFat }}g</text>
            </view>
          </view>
        </view>

        <wd-button type="primary" @tap="confirmFood" class="confirm-btn">
          确认添加
        </wd-button>
      </view>
    </wd-popup>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-overlay">
      <wd-loading type="circular" color="#10b981" />
      <text class="loading-text">{{ loadingText }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useThemeStore } from '@/stores/theme';

interface FoodCategory {
  name: string;
  icon: string;
  foods: FoodItem[];
}

interface FoodItem {
  name: string;
  unit: string;
  defaultAmount: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbsPer100g: number;
}

interface RecognitionResult {
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

const emit = defineEmits(['confirm', 'close']);
const themeStore = useThemeStore();

const searchKeyword = ref('');
const showFoodList = ref(false);
const currentCategoryName = ref('');
const selectedFood = ref<FoodItem | null>(null);
const selectedAmount = ref(100);
const showAmountDialog = ref(false);
const loading = ref(false);
const loadingText = ref('');
const recognitionResults = ref<RecognitionResult[]>([]);

// 食物数据库
const foodCategories: FoodCategory[] = [
  {
    name: '主食',
    icon: '🍚',
    foods: [
      { name: '米饭', unit: 'g', defaultAmount: 150, caloriesPer100g: 116, proteinPer100g: 2.7, fatPer100g: 0.3, carbsPer100g: 25.6 },
      { name: '面条', unit: 'g', defaultAmount: 200, caloriesPer100g: 138, proteinPer100g: 4.5, fatPer100g: 0.9, carbsPer100g: 28.0 },
      { name: '馒头', unit: 'g', defaultAmount: 100, caloriesPer100g: 220, proteinPer100g: 7.0, fatPer100g: 1.0, carbsPer100g: 47.0 },
      { name: '红薯', unit: 'g', defaultAmount: 150, caloriesPer100g: 86, proteinPer100g: 1.6, fatPer100g: 0.1, carbsPer100g: 20.1 },
      { name: '全麦面包', unit: '片', defaultAmount: 2, caloriesPer100g: 246, proteinPer100g: 12.0, fatPer100g: 3.0, carbsPer100g: 41.0 }
    ]
  },
  {
    name: '肉类',
    icon: '🥩',
    foods: [
      { name: '鸡胸肉', unit: 'g', defaultAmount: 100, caloriesPer100g: 133, proteinPer100g: 28.0, fatPer100g: 1.5, carbsPer100g: 0 },
      { name: '牛肉', unit: 'g', defaultAmount: 100, caloriesPer100g: 125, proteinPer100g: 26.0, fatPer100g: 2.0, carbsPer100g: 0 },
      { name: '三文鱼', unit: 'g', defaultAmount: 100, caloriesPer100g: 206, proteinPer100g: 22.0, fatPer100g: 13.0, carbsPer100g: 0 },
      { name: '鸡蛋', unit: '个', defaultAmount: 1, caloriesPer100g: 143, proteinPer100g: 13.0, fatPer100g: 9.0, carbsPer100g: 1.0 },
      { name: '猪肉', unit: 'g', defaultAmount: 100, caloriesPer100g: 242, proteinPer100g: 17.0, fatPer100g: 19.0, carbsPer100g: 0 }
    ]
  },
  {
    name: '蔬菜',
    icon: '🥬',
    foods: [
      { name: '西兰花', unit: 'g', defaultAmount: 100, caloriesPer100g: 34, proteinPer100g: 2.8, fatPer100g: 0.4, carbsPer100g: 7.0 },
      { name: '菠菜', unit: 'g', defaultAmount: 100, caloriesPer100g: 23, proteinPer100g: 2.9, fatPer100g: 0.4, carbsPer100g: 3.6 },
      { name: '番茄', unit: 'g', defaultAmount: 150, caloriesPer100g: 18, proteinPer100g: 0.9, fatPer100g: 0.2, carbsPer100g: 3.9 },
      { name: '黄瓜', unit: 'g', defaultAmount: 150, caloriesPer100g: 16, proteinPer100g: 0.9, fatPer100g: 0.1, carbsPer100g: 3.6 },
      { name: '生菜', unit: 'g', defaultAmount: 100, caloriesPer100g: 15, proteinPer100g: 1.4, fatPer100g: 0.2, carbsPer100g: 2.9 }
    ]
  },
  {
    name: '水果',
    icon: '🍎',
    foods: [
      { name: '苹果', unit: '个', defaultAmount: 1, caloriesPer100g: 52, proteinPer100g: 0.3, fatPer100g: 0.2, carbsPer100g: 14.0 },
      { name: '香蕉', unit: '个', defaultAmount: 1, caloriesPer100g: 89, proteinPer100g: 1.1, fatPer100g: 0.3, carbsPer100g: 23.0 },
      { name: '蓝莓', unit: 'g', defaultAmount: 50, caloriesPer100g: 57, proteinPer100g: 0.7, fatPer100g: 0.3, carbsPer100g: 14.0 },
      { name: '橙子', unit: '个', defaultAmount: 1, caloriesPer100g: 47, proteinPer100g: 0.9, fatPer100g: 0.1, carbsPer100g: 12.0 }
    ]
  },
  {
    name: '奶制品',
    icon: '🥛',
    foods: [
      { name: '牛奶', unit: 'ml', defaultAmount: 250, caloriesPer100g: 60, proteinPer100g: 3.2, fatPer100g: 3.5, carbsPer100g: 4.8 },
      { name: '酸奶', unit: 'g', defaultAmount: 200, caloriesPer100g: 59, proteinPer100g: 3.5, fatPer100g: 2.5, carbsPer100g: 7.0 },
      { name: '奶酪', unit: 'g', defaultAmount: 30, caloriesPer100g: 402, proteinPer100g: 25.0, fatPer100g: 33.0, carbsPer100g: 1.3 }
    ]
  }
];

// 计算属性
const filteredFoods = computed(() => {
  if (!searchKeyword.value) {
    const category = foodCategories.find(c => c.name === currentCategoryName.value);
    return category ? category.foods : [];
  }

  // 搜索模式
  const results: FoodItem[] = [];
  foodCategories.forEach(category => {
    category.foods.forEach(food => {
      if (food.name.includes(searchKeyword.value)) {
        results.push(food);
      }
    });
  });
  return results;
});

const previewCalories = computed(() => {
  if (!selectedFood.value) return 0;
  const multiplier = selectedAmount.value / 100;
  return Math.round(selectedFood.value.caloriesPer100g * multiplier);
});

const previewProtein = computed(() => {
  if (!selectedFood.value) return 0;
  const multiplier = selectedAmount.value / 100;
  return Number((selectedFood.value.proteinPer100g * multiplier).toFixed(1));
});

const previewCarbs = computed(() => {
  if (!selectedFood.value) return 0;
  const multiplier = selectedAmount.value / 100;
  return Number((selectedFood.value.carbsPer100g * multiplier).toFixed(1));
});

const previewFat = computed(() => {
  if (!selectedFood.value) return 0;
  const multiplier = selectedAmount.value / 100;
  return Number((selectedFood.value.fatPer100g * multiplier).toFixed(1));
});

// 方法
const onSearch = () => {
  if (searchKeyword.value.trim()) {
    showFoodList.value = true;
    currentCategoryName.value = '搜索结果';
    recognitionResults.value = []; // 清空识别结果
  }
};

const onClear = () => {
  searchKeyword.value = '';
  showFoodList.value = false;
  currentCategoryName.value = '';
};

const selectCategory = (category: FoodCategory) => {
  currentCategoryName.value = category.name;
  showFoodList.value = true;
  searchKeyword.value = '';
  recognitionResults.value = [];
};

const selectFood = (food: FoodItem) => {
  selectedFood.value = food;
  selectedAmount.value = food.defaultAmount;
  showAmountDialog.value = true;
};

const onAmountChange = (value: number) => {
  selectedAmount.value = value;
};

const confirmFood = () => {
  if (!selectedFood.value) return;

  const food = {
    name: selectedFood.value.name,
    amount: selectedAmount.value,
    unit: selectedFood.value.unit,
    totalCalories: previewCalories.value,
    totalProtein: previewProtein.value,
    totalFat: previewFat.value,
    totalCarbs: previewCarbs.value
  };

  emit('confirm', food);
  showAmountDialog.value = false;
  selectedFood.value = null;
};

const handleCamera = () => {
  // 模拟拍照识别
  loading.value = true;
  loadingText.value = '正在识别...';

  setTimeout(() => {
    // 模拟识别结果
    recognitionResults.value = [
      { name: '米饭', amount: '150g', calories: 171, protein: 3, carbs: 37, fat: 0.3, confidence: 0.95 },
      { name: '鸡胸肉', amount: '120g', calories: 130, protein: 28, carbs: 0, fat: 1.5, confidence: 0.88 },
      { name: '西兰花', amount: '100g', calories: 34, protein: 3, carbs: 7, fat: 0.4, confidence: 0.82 }
    ];

    loading.value = false;
    showFoodList.value = false;
    searchKeyword.value = '';

    uni.showToast({
      title: '识别完成',
      icon: 'success'
    });
  }, 2000);
};

const selectRecognitionItem = (item: RecognitionResult) => {
  // 将识别结果转换为食物选择
  const foodItem = {
    name: item.name,
    amount: parseFloat(item.amount),
    unit: item.amount.replace(/[0-9.]/g, ''),
    totalCalories: item.calories,
    totalProtein: item.protein,
    totalCarbs: item.carbs,
    totalFat: item.fat
  };

  emit('confirm', foodItem);
};

const handleClose = () => {
  emit('close');
};

watch(searchKeyword, (newVal) => {
  if (!newVal) {
    showFoodList.value = false;
    currentCategoryName.value = '';
  }
});
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.dark .page-container {
  background-color: #111827;
}

/* 顶部导航 */
.header {
  background: #ffffff;
  padding: 20rpx 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.dark .header {
  background: #1f2937;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  padding: 0;
  min-width: 60rpx;
  font-size: 36rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #111827;
}

.dark .title {
  color: #f9fafb;
}

/* 搜索区域 */
.search-section {
  padding: 16rpx;
  background: #ffffff;
}

.dark .search-section {
  background: #1f2937;
}

/* 拍照识别 */
.camera-section {
  padding: 0 16rpx 16rpx;
}

.camera-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
  padding: 32rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 16rpx rgba(59, 130, 246, 0.3);
}

.camera-icon {
  font-size: 48rpx;
}

.camera-text {
  letter-spacing: 2rpx;
}

/* 通用章节 */
.section {
  background: #ffffff;
  margin: 16rpx;
  padding: 24rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.dark .section {
  background: #1f2937;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #111827;
  margin-bottom: 20rpx;
}

.dark .section-title {
  color: #f9fafb;
}

/* 分类网格 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.category-card {
  background: #f9fafb;
  padding: 24rpx 16rpx;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  transition: all 0.2s ease;
}

.dark .category-card {
  background: #374151;
}

.category-card:active {
  transform: scale(0.95);
  background: #e5e7eb;
}

.dark .category-card:active {
  background: #4b5563;
}

.category-icon {
  font-size: 48rpx;
}

.category-name {
  font-size: 24rpx;
  color: #111827;
  font-weight: 500;
}

.dark .category-name {
  color: #f9fafb;
}

/* 食物列表 */
.food-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.food-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  padding: 20rpx;
  border-radius: 12rpx;
  border: 1rpx solid #e5e7eb;
}

.dark .food-item {
  background: #374151;
  border-color: #4b5563;
}

.food-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.food-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #111827;
}

.dark .food-name {
  color: #f9fafb;
}

.food-nutrients {
  font-size: 22rpx;
  color: #6b7280;
}

.dark .food-nutrients {
  color: #9ca3af;
}

/* 识别结果 */
.recognition-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.recognition-item {
  background: #f0fdf4;
  padding: 20rpx;
  border-radius: 12rpx;
  border: 1rpx solid #bbf7d0;
}

.dark .recognition-item {
  background: #14532d;
  border-color: #166534;
}

.recognition-info {
  display: flex;
  gap: 16rpx;
  align-items: center;
  margin-bottom: 8rpx;
  flex-wrap: wrap;
}

.recognition-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #14532d;
}

.dark .recognition-name {
  color: #86efac;
}

.recognition-amount,
.recognition-calories {
  font-size: 24rpx;
  color: #166534;
}

.dark .recognition-amount,
.dark .recognition-calories {
  color: #4ade80;
}

.confidence {
  font-size: 20rpx;
  color: #166534;
  opacity: 0.8;
}

.dark .confidence {
  color: #4ade80;
}

/* 数量选择弹窗 */
.amount-dialog {
  padding: 32rpx;
  background: #ffffff;
  min-height: 100%;
}

.dark .amount-dialog {
  background: #1f2937;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.dialog-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #111827;
}

.dark .dialog-title {
  color: #f9fafb;
}

.amount-input-section {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 32rpx;
  padding: 24rpx;
  background: #f9fafb;
  border-radius: 12rpx;
}

.dark .amount-input-section {
  background: #374151;
}

.input-label {
  font-size: 28rpx;
  color: #6b7280;
  font-weight: 500;
}

.dark .input-label {
  color: #9ca3af;
}

.unit-display {
  font-size: 28rpx;
  color: #10b981;
  font-weight: bold;
  min-width: 60rpx;
}

.nutrition-preview {
  margin-bottom: 32rpx;
}

.preview-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #111827;
  margin-bottom: 16rpx;
}

.dark .preview-title {
  color: #f9fafb;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.preview-item {
  background: #f9fafb;
  padding: 16rpx;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.dark .preview-item {
  background: #374151;
}

.preview-label {
  font-size: 22rpx;
  color: #6b7280;
}

.dark .preview-label {
  color: #9ca3af;
}

.preview-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #10b981;
}

.confirm-btn {
  width: 100%;
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-text {
  color: #ffffff;
  font-size: 28rpx;
  margin-top: 16rpx;
}
</style>
