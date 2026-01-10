<template>
  <view class="page-container" :class="themeStore.effectiveTheme">
    <!-- 顶部卡路里摘要 -->
    <view class="summary-card">
      <view class="summary-header">
        <view class="summary-item">
          <view class="label">
            <text>🔥</text>
            <text>摄入</text>
          </view>
          <view class="value">{{ totalIntake.calories }}</view>
          <view class="unit">kcal</view>
        </view>

        <!-- 环形进度条 -->
        <view class="progress-circle">
          <wd-progress
            type="circle"
            :percentage="caloriePercentage"
            :stroke-width="8"
            :color="calorieColor"
            :track-color="calorieTrackColor"
            :width="120"
          >
            <template #default>
              <view class="progress-center">
                <view class="progress-text">{{ remainingCalories }}</view>
                <view class="progress-subtext">剩余</view>
              </view>
            </template>
          </wd-progress>
        </view>

        <view class="summary-item">
          <view class="label">
            <text>📈</text>
            <text>消耗</text>
          </view>
          <view class="value">{{ burnedCalories }}</view>
          <view class="unit">kcal</view>
        </view>
      </view>

      <view class="goal-text">
        目标: {{ dailyGoal.calories }} kcal/天
      </view>
    </view>

    <!-- 营养素摘要 -->
    <view class="section">
      <view class="section-title">今日营养素</view>
      <view class="nutrient-grid">
        <!-- 蛋白质 -->
        <view class="nutrient-card">
          <view class="nutrient-name">蛋白质</view>
          <view class="nutrient-value">
            <text>{{ totalIntake.protein.toFixed(1) }}</text>
            <text class="nutrient-target">/ {{ dailyGoal.protein }}g</text>
          </view>
          <wd-progress
            :percentage="nutrientPercentage.protein"
            :stroke-width="6"
            color="#fb923c"
            :show-text="false"
          />
        </view>

        <!-- 脂肪 -->
        <view class="nutrient-card">
          <view class="nutrient-name">脂肪</view>
          <view class="nutrient-value">
            <text>{{ totalIntake.fat.toFixed(1) }}</text>
            <text class="nutrient-target">/ {{ dailyGoal.fat }}g</text>
          </view>
          <wd-progress
            :percentage="nutrientPercentage.fat"
            :stroke-width="6"
            color="#f59e0b"
            :show-text="false"
          />
        </view>

        <!-- 碳水化合物 -->
        <view class="nutrient-card">
          <view class="nutrient-name">碳水</view>
          <view class="nutrient-value">
            <text>{{ totalIntake.carbs.toFixed(1) }}</text>
            <text class="nutrient-target">/ {{ dailyGoal.carbs }}g</text>
          </view>
          <wd-progress
            :percentage="nutrientPercentage.carbs"
            :stroke-width="6"
            color="#8b5cf6"
            :show-text="false"
          />
        </view>
      </view>
    </view>

    <!-- 今日吃什么 -->
    <view class="section">
      <view class="section-title">今日吃什么</view>
      <FoodSuggestion />
    </view>

    <!-- 餐食记录 -->
    <view class="section">
      <view class="section-title">今日餐食</view>

      <view v-for="meal in todayMeals" :key="meal.id" class="meal-card">
        <view class="meal-header" @tap="toggleMeal(meal.id)">
          <view class="meal-info">
            <view class="meal-icon" :style="{ color: getMealColor(meal.mealType) }">
              {{ getMealIcon(meal.mealType) }}
            </view>
            <view class="meal-name">{{ meal.mealType }}</view>
            <view class="meal-time">{{ meal.time }}</view>
          </view>
          <view class="meal-calories">{{ meal.totalCalories }} kcal</view>
        </view>

        <!-- 展开的食物列表 -->
        <view v-if="expandedMeals.includes(meal.id)" class="meal-items">
          <view v-for="item in meal.items" :key="item.id" class="food-item">
            <view class="food-info">
              <text class="food-name">{{ item.name }}</text>
              <text class="food-amount">{{ item.amount }}{{ item.unit }}</text>
            </view>
            <view class="food-calories">{{ item.calories }}kcal</view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="todayMeals.length === 0" class="empty-state">
        <text>暂无餐食记录</text>
      </view>
    </view>

    <!-- 悬浮添加按钮 -->
    <view class="fab-container">
      <wd-action-sheet
        v-model="showMealOptions"
        :actions="mealActions"
        @select="handleMealSelect"
        cancel-text="取消"
      />

      <view
        class="fab-button"
        :class="{ active: showMealOptions }"
        @tap="showMealOptions = !showMealOptions"
      >
        <text class="fab-icon">+</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useMealStore } from '@/stores/meal';
import { useUserStore } from '@/stores/user';
import { useThemeStore } from '@/stores/theme';
import FoodSuggestion from '@/components/FoodSuggestion/FoodSuggestion.vue';

const mealStore = useMealStore();
const userStore = useUserStore();
const themeStore = useThemeStore();

const showMealOptions = ref(false);
const expandedMeals = ref<string[]>([]);

// 每日目标
const dailyGoal = computed(() => userStore.goalSettings);

// 今日营养汇总
const totalIntake = computed(() => ({
  calories: mealStore.todayNutrition.totalCalories,
  protein: mealStore.todayNutrition.totalProtein,
  fat: mealStore.todayNutrition.totalFat,
  carbs: mealStore.todayNutrition.totalCarbs
}));

// 消耗卡路里（模拟）
const burnedCalories = ref(350);

// 今日餐食
const todayMeals = computed(() => mealStore.todayMeals);

// 卡路里百分比
const caloriePercentage = computed(() => {
  const percentage = (totalIntake.value.calories / dailyGoal.value.calories) * 100;
  return Math.min(percentage, 100);
});

// 剩余卡路里
const remainingCalories = computed(() => {
  const remaining = dailyGoal.value.calories - totalIntake.value.calories;
  return remaining > 0 ? remaining : 0;
});

// 卡路里进度条颜色
const calorieColor = computed(() => {
  if (totalIntake.value.calories > dailyGoal.value.calories) {
    return '#ef4444'; // 红色 - 超标
  }
  return '#10b981'; // 绿色 - 正常
});

const calorieTrackColor = computed(() => {
  return themeStore.effectiveTheme === 'dark' ? '#374151' : '#e5e7eb';
});

// 营养素百分比
const nutrientPercentage = computed(() => ({
  protein: Math.min((totalIntake.value.protein / dailyGoal.value.protein) * 100, 100),
  fat: Math.min((totalIntake.value.fat / dailyGoal.value.fat) * 100, 100),
  carbs: Math.min((totalIntake.value.carbs / dailyGoal.value.carbs) * 100, 100)
}));

// 餐次选择菜单
const mealActions = [
  { name: '早餐', color: '#f97316' },
  { name: '午餐', color: '#eab308' },
  { name: '晚餐', color: '#6366f1' },
  { name: '加餐', color: '#d97706' }
];

// 获取餐次图标
const getMealIcon = (mealType: string) => {
  const icons = {
    '早餐': '🌅',
    '午餐': '☀️',
    '晚餐': '🌙',
    '加餐': '☕'
  };
  return icons[mealType as keyof typeof icons] || '🍽️';
};

// 获取餐次颜色
const getMealColor = (mealType: string) => {
  const colors = {
    '早餐': '#f97316',
    '午餐': '#eab308',
    '晚餐': '#6366f1',
    '加餐': '#d97706'
  };
  return colors[mealType as keyof typeof colors] || '#6b7280';
};

// 切换餐食展开
const toggleMeal = (mealId: string) => {
  const index = expandedMeals.value.indexOf(mealId);
  if (index > -1) {
    expandedMeals.value.splice(index, 1);
  } else {
    expandedMeals.value.push(mealId);
  }
};

// 选择餐次
const handleMealSelect = (action: any) => {
  showMealOptions.value = false;

  // 跳转到添加餐食页面
  uni.navigateTo({
    url: `/pages/add-meal/index?mealType=${encodeURIComponent(action.name)}`
  });
};

onMounted(() => {
  mealStore.updateTodayNutrition();
});

onShow(() => {
  // 每次显示页面时刷新数据
  mealStore.updateTodayNutrition();
});
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding-bottom: 120rpx; // 为悬浮按钮留出空间
}

.dark .page-container {
  background-color: #111827;
}

/* 顶部摘要卡片 */
.summary-card {
  background: #ffffff;
  padding: 32rpx;
  margin: 16rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.dark .summary-card {
  background: #1f2937;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #6b7280;
  margin-bottom: 8rpx;
}

.dark .label {
  color: #9ca3af;
}

.value {
  font-size: 48rpx;
  font-weight: bold;
  color: #111827;
}

.dark .value {
  color: #f9fafb;
}

.unit {
  font-size: 20rpx;
  color: #9ca3af;
  margin-top: 4rpx;
}

.progress-circle {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.progress-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #111827;
}

.dark .progress-text {
  color: #f9fafb;
}

.progress-subtext {
  font-size: 18rpx;
  color: #6b7280;
}

.dark .progress-subtext {
  color: #9ca3af;
}

.goal-text {
  text-align: center;
  font-size: 24rpx;
  color: #6b7280;
  margin-top: 16rpx;
}

.dark .goal-text {
  color: #9ca3af;
}

/* 通用章节样式 */
.section {
  background: #ffffff;
  margin: 16rpx;
  padding: 24rpx;
  border-radius: 16rpx;
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

/* 营养素网格 */
.nutrient-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.nutrient-card {
  background: #f9fafb;
  padding: 16rpx;
  border-radius: 12rpx;
}

.dark .nutrient-card {
  background: #374151;
}

.nutrient-name {
  font-size: 24rpx;
  color: #6b7280;
  margin-bottom: 8rpx;
}

.dark .nutrient-name {
  color: #9ca3af;
}

.nutrient-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #111827;
  margin-bottom: 8rpx;
}

.dark .nutrient-value {
  color: #f9fafb;
}

.nutrient-target {
  font-size: 20rpx;
  color: #9ca3af;
  font-weight: normal;
}

/* 餐食卡片 */
.meal-card {
  background: #f9fafb;
  margin-bottom: 16rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.dark .meal-card {
  background: #374151;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #ffffff;
}

.dark .meal-header {
  background: #1f2937;
}

.meal-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.meal-icon {
  font-size: 36rpx;
}

.meal-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #111827;
}

.dark .meal-name {
  color: #f9fafb;
}

.meal-time {
  font-size: 22rpx;
  color: #9ca3af;
}

.meal-calories {
  font-size: 28rpx;
  font-weight: bold;
  color: #10b981;
}

.meal-items {
  padding: 16rpx 20rpx;
  background: #ffffff;
}

.dark .meal-items {
  background: #1f2937;
}

.food-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #e5e7eb;
}

.dark .food-item {
  border-bottom-color: #374151;
}

.food-item:last-child {
  border-bottom: none;
}

.food-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.food-name {
  font-size: 26rpx;
  color: #111827;
}

.dark .food-name {
  color: #f9fafb;
}

.food-amount {
  font-size: 20rpx;
  color: #6b7280;
}

.dark .food-amount {
  color: #9ca3af;
}

.food-calories {
  font-size: 24rpx;
  color: #6b7280;
  font-weight: 500;
}

.dark .food-calories {
  color: #9ca3af;
}

/* 空状态 */
.empty-state {
  padding: 40rpx;
  text-align: center;
  color: #9ca3af;
  font-size: 28rpx;
}

/* 悬浮按钮 */
.fab-container {
  position: fixed;
  bottom: 120rpx;
  right: 32rpx;
  z-index: 999;
}

.fab-button {
  width: 112rpx;
  height: 112rpx;
  border-radius: 56rpx;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8rpx 24rpx rgba(16, 185, 129, 0.4);
  transition: all 0.3s ease;
}

.fab-button.active {
  transform: rotate(135deg);
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 8rpx 24rpx rgba(239, 68, 68, 0.4);
}

.fab-icon {
  font-size: 48rpx;
  color: #ffffff;
  font-weight: bold;
  line-height: 1;
}
</style>
