<template>
  <view class="page-container" :class="themeStore.effectiveTheme">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="header-content">
        <wd-button type="text" @tap="goBack" class="back-btn">←</wd-button>
        <view class="title">餐食记录</view>
        <view style="width: 80rpx;"></view>
      </view>
    </view>

    <!-- 日期选择 -->
    <view class="date-selector">
      <view class="date-nav">
        <wd-button type="text" @tap="changeDate(-1)">◀</wd-button>
        <view class="current-date" @tap="showDatePicker = true">
          {{ formattedDate }}
          <text class="calendar-icon">📅</text>
        </view>
        <wd-button type="text" @tap="changeDate(1)">▶</wd-button>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-card" v-if="hasData">
      <view class="stats-title">当日总计</view>
      <view class="stats-grid">
        <view class="stat-item">
          <view class="stat-value">{{ dayStats.calories }}</view>
          <view class="stat-label">卡路里</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ dayStats.protein }}g</view>
          <view class="stat-label">蛋白质</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ dayStats.carbs }}g</view>
          <view class="stat-label">碳水</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ dayStats.fat }}g</view>
          <view class="stat-label">脂肪</view>
        </view>
      </view>
    </view>

    <!-- 餐食列表 -->
    <view class="meal-list">
      <view v-for="meal in dayMeals" :key="meal.id" class="meal-card">
        <view class="meal-header">
          <view class="meal-type" :style="{ color: getMealColor(meal.mealType) }">
            {{ getMealIcon(meal.mealType) }} {{ meal.mealType }}
          </view>
          <view class="meal-time">{{ meal.time }}</view>
          <view class="meal-calories">{{ meal.totalCalories }}kcal</view>
        </view>
        <view class="meal-items">
          <view v-for="item in meal.items" :key="item.id" class="food-item">
            <text>{{ item.name }}</text>
            <text>{{ item.amount }}{{ item.unit }} · {{ item.calories }}kcal</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="!hasData" class="empty-state">
      <text>暂无记录</text>
    </view>

    <!-- 日期选择器 -->
    <wd-popup v-model="showDatePicker" position="bottom">
      <wd-datetime-picker
        v-model="selectedDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="handleDateConfirm"
        @cancel="showDatePicker = false"
      />
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMealStore } from '@/stores/meal';
import { useThemeStore } from '@/stores/theme';

const mealStore = useMealStore();
const themeStore = useThemeStore();

const selectedDate = ref(new Date());
const showDatePicker = ref(false);
const minDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30天前
const maxDate = new Date();

const formattedDate = computed(() => {
  const date = selectedDate.value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

const dayMeals = computed(() => {
  const dateStr = formattedDate.value;
  return mealStore.getMealsByDate(dateStr);
});

const hasData = computed(() => dayMeals.value.length > 0);

const dayStats = computed(() => {
  const meals = dayMeals.value;
  return {
    calories: meals.reduce((sum, m) => sum + m.totalCalories, 0),
    protein: meals.reduce((sum, m) => sum + m.totalProtein, 0),
    carbs: meals.reduce((sum, m) => sum + m.totalCarbs, 0),
    fat: meals.reduce((sum, m) => sum + m.totalFat, 0)
  };
});

const getMealIcon = (mealType: string) => {
  const icons = { '早餐': '🌅', '午餐': '☀️', '晚餐': '🌙', '加餐': '☕' };
  return icons[mealType as keyof typeof icons] || '🍽️';
};

const getMealColor = (mealType: string) => {
  const colors = { '早餐': '#f97316', '午餐': '#eab308', '晚餐': '#6366f1', '加餐': '#d97706' };
  return colors[mealType as keyof typeof colors] || '#6b7280';
};

const changeDate = (days: number) => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() + days);
  selectedDate.value = newDate;
};

const handleDateConfirm = () => {
  showDatePicker.value = false;
};

const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  mealStore.updateTodayNutrition();
});
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

.header {
  background: #ffffff;
  padding: 20rpx 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.dark .header {
  background: #1f2937;
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

.date-selector {
  background: #ffffff;
  margin: 16rpx;
  padding: 16rpx;
  border-radius: 12rpx;
}

.dark .date-selector {
  background: #1f2937;
}

.date-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-date {
  font-size: 32rpx;
  font-weight: bold;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.dark .current-date {
  color: #f9fafb;
}

.calendar-icon {
  font-size: 36rpx;
}

.stats-card {
  background: #ffffff;
  margin: 16rpx;
  padding: 24rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.dark .stats-card {
  background: #1f2937;
}

.stats-title {
  font-size: 28rpx;
  color: #6b7280;
  margin-bottom: 16rpx;
}

.dark .stats-title {
  color: #9ca3af;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #10b981;
}

.stat-label {
  font-size: 20rpx;
  color: #6b7280;
  margin-top: 4rpx;
}

.dark .stat-label {
  color: #9ca3af;
}

.meal-list {
  padding: 0 16rpx;
}

.meal-card {
  background: #ffffff;
  margin-bottom: 16rpx;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.dark .meal-card {
  background: #1f2937;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #f9fafb;
}

.dark .meal-header {
  background: #374151;
}

.meal-type {
  font-size: 28rpx;
  font-weight: bold;
}

.meal-time {
  font-size: 22rpx;
  color: #6b7280;
}

.dark .meal-time {
  color: #9ca3af;
}

.meal-calories {
  font-size: 24rpx;
  font-weight: bold;
  color: #10b981;
}

.meal-items {
  padding: 16rpx 20rpx;
}

.food-item {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 0;
  font-size: 24rpx;
  color: #6b7280;
}

.dark .food-item {
  color: #9ca3af;
}

.empty-state {
  padding: 80rpx 32rpx;
  text-align: center;
  color: #9ca3af;
  font-size: 28rpx;
}
</style>
