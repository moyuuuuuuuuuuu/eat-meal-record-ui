<template>
  <view class="page-container" :class="themeStore.effectiveTheme">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="header-content">
        <wd-button type="text" @tap="goBack" class="back-btn">
          <text>←</text>
        </wd-button>
        <view class="title">添加{{ mealType }}</view>
        <wd-button
          type="primary"
          size="small"
          :disabled="foodItems.length === 0"
          @tap="saveMeal"
          class="save-btn"
        >
          保存
        </wd-button>
      </view>
    </view>

    <!-- 餐次选择标签 -->
    <view class="tabs-container">
      <wd-tabs v-model="mealType" @change="onMealTypeChange">
        <wd-tab title="早餐" name="早餐" />
        <wd-tab title="午餐" name="午餐" />
        <wd-tab title="晚餐" name="晚餐" />
        <wd-tab title="加餐" name="加餐" />
      </wd-tabs>
    </view>

    <!-- 已选食物列表 -->
    <view class="section">
      <view class="section-header">
        <view class="section-title">已选食物</view>
        <wd-button type="text" size="small" @tap="showFoodSelector">
          + 添加食物
        </wd-button>
      </view>

      <view v-if="foodItems.length > 0" class="food-list">
        <view v-for="(item, index) in foodItems" :key="index" class="food-item-card">
          <view class="food-info">
            <view class="food-name">{{ item.name }}</view>
            <view class="food-details">
              {{ item.amount }}{{ item.unit }} · {{ item.totalCalories }}kcal
            </view>
            <view class="nutrient-tags">
              <text class="tag">P: {{ item.totalProtein }}g</text>
              <text class="tag">C: {{ item.totalCarbs }}g</text>
              <text class="tag">F: {{ item.totalFat }}g</text>
            </view>
          </view>
          <wd-button type="danger" size="small" @tap="removeFood(index)">
            删除
          </wd-button>
        </view>
      </view>

      <view v-else class="empty-state">
        <text>暂未添加食物</text>
        <wd-button type="primary" @tap="showFoodSelector" style="margin-top: 24rpx;">
          选择食物
        </wd-button>
      </view>
    </view>

    <!-- 营养总计 -->
    <view class="section" v-if="foodItems.length > 0">
      <view class="section-title">营养总计</view>
      <view class="totals-grid">
        <view class="total-item">
          <view class="total-label">卡路里</view>
          <view class="total-value">{{ totals.calories }}kcal</view>
        </view>
        <view class="total-item">
          <view class="total-label">蛋白质</view>
          <view class="total-value">{{ totals.protein }}g</view>
        </view>
        <view class="total-item">
          <view class="total-label">碳水</view>
          <view class="total-value">{{ totals.carbs }}g</view>
        </view>
        <view class="total-item">
          <view class="total-label">脂肪</view>
          <view class="total-value">{{ totals.fat }}g</view>
        </view>
      </view>
    </view>

    <!-- 备注输入 -->
    <view class="section">
      <view class="section-title">备注（可选）</view>
      <wd-textarea
        v-model="note"
        placeholder="添加备注信息，如：少油、不加糖等"
        maxlength="140"
        show-word-limit
        :rows="3"
      />
    </view>

    <!-- 食物选择器弹窗 -->
    <wd-popup v-model="showSelector" position="bottom" :style="{ height: '80vh' }">
      <FoodSelectorPage
        @confirm="handleFoodConfirm"
        @close="showSelector = false"
      />
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useMealStore } from '@/stores/meal';
import { useThemeStore } from '@/stores/theme';
import FoodSelectorPage from '@/pages/food-selector/index.vue';

interface FoodItem {
  name: string;
  amount: number;
  unit: string;
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

const mealStore = useMealStore();
const themeStore = useThemeStore();

const mealType = ref<'早餐' | '午餐' | '晚餐' | '加餐'>('早餐');
const foodItems = ref<FoodItem[]>([]);
const note = ref('');
const showSelector = ref(false);

const totals = computed(() => {
  return foodItems.value.reduce(
    (acc, item) => ({
      calories: acc.calories + item.totalCalories,
      protein: acc.protein + item.totalProtein,
      fat: acc.fat + item.totalFat,
      carbs: acc.carbs + item.totalCarbs
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
});

onLoad((options) => {
  if (options?.mealType) {
    mealType.value = decodeURIComponent(options.mealType) as any;
  }
});

const onMealTypeChange = (value: any) => {
  mealType.value = value.name;
};

const showFoodSelector = () => {
  showSelector.value = true;
};

const handleFoodConfirm = (food: FoodItem) => {
  foodItems.value.push(food);
  showSelector.value = false;

  uni.showToast({
    title: `已添加 ${food.name}`,
    icon: 'success'
  });
};

const removeFood = (index: number) => {
  foodItems.value.splice(index, 1);
};

const saveMeal = () => {
  if (foodItems.value.length === 0) {
    uni.showToast({
      title: '请先添加食物',
      icon: 'none'
    });
    return;
  }

  const now = new Date();
  const mealRecord = {
    id: Date.now().toString(),
    date: now.toISOString().split('T')[0],
    time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    mealType: mealType.value,
    items: foodItems.value.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      name: item.name,
      amount: item.amount,
      unit: item.unit,
      calories: item.totalCalories,
      protein: item.totalProtein,
      fat: item.totalFat,
      carbs: item.totalCarbs
    })),
    totalCalories: totals.value.calories,
    totalProtein: totals.value.protein,
    totalCarbs: totals.value.carbs,
    totalFat: totals.value.fat,
    note: note.value
  };

  mealStore.addMeal(mealRecord);

  // 返回首页
  uni.switchTab({
    url: '/pages/index/index'
  });
};

const goBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding-bottom: 40rpx;
}

.dark .page-container {
  background-color: #111827;
}

/* 顶部导航 */
.header {
  background: #ffffff;
  padding: 20rpx 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
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

.back-btn {
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

.save-btn {
  padding: 0 24rpx;
}

/* 标签容器 */
.tabs-container {
  background: #ffffff;
  margin: 16rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.dark .tabs-container {
  background: #1f2937;
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #111827;
}

.dark .section-title {
  color: #f9fafb;
}

/* 食物列表 */
.food-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.food-item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  padding: 20rpx;
  border-radius: 12rpx;
  border: 1rpx solid #e5e7eb;
}

.dark .food-item-card {
  background: #374151;
  border-color: #4b5563;
}

.food-info {
  flex: 1;
}

.food-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #111827;
  margin-bottom: 8rpx;
}

.dark .food-name {
  color: #f9fafb;
}

.food-details {
  font-size: 24rpx;
  color: #6b7280;
  margin-bottom: 8rpx;
}

.dark .food-details {
  color: #9ca3af;
}

.nutrient-tags {
  display: flex;
  gap: 12rpx;
}

.tag {
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-radius: 6rpx;
}

/* 空状态 */
.empty-state {
  padding: 40rpx;
  text-align: center;
  color: #9ca3af;
  font-size: 28rpx;
}

/* 营养总计 */
.totals-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.total-item {
  background: #f9fafb;
  padding: 20rpx;
  border-radius: 12rpx;
  text-align: center;
}

.dark .total-item {
  background: #374151;
}

.total-label {
  font-size: 22rpx;
  color: #6b7280;
  margin-bottom: 8rpx;
}

.dark .total-label {
  color: #9ca3af;
}

.total-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #10b981;
}
</style>
