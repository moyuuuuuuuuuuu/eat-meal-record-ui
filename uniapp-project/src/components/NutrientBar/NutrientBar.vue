<template>
  <view class="nutrient-bar" :class="themeStore.effectiveTheme">
    <view class="bar-header">
      <text class="nutrient-name">{{ label }}</text>
      <text class="nutrient-value">{{ current }}/{{ target }}{{ unit }}</text>
    </view>
    <view class="progress-container">
      <view
        class="progress-fill"
        :style="{ width: percentage + '%', background: fillColor }"
        :class="{ 'warning': percentage > 90 && percentage <= 100, 'danger': percentage > 100 }"
      ></view>
    </view>
    <view class="percentage-text" :class="{ 'warning': percentage > 90, 'danger': percentage > 100 }">
      {{ percentage }}%
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme';

const props = defineProps<{
  label: string;
  current: number;
  target: number;
  unit: string;
}>();

const themeStore = useThemeStore();

const percentage = computed(() => {
  if (props.target === 0) return 0;
  return Math.round((props.current / props.target) * 100);
});

const fillColor = computed(() => {
  if (percentage.value > 100) return '#ef4444'; // 红色 - 超标
  if (percentage.value > 90) return '#f59e0b'; // 橙色 - 接近目标
  if (percentage.value > 70) return '#10b981'; // 绿色 - 良好
  return '#3b82f6'; // 蓝色 - 正常
});
</script>

<style lang="scss" scoped>
.nutrient-bar {
  background: #f9fafb;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
  border: 1rpx solid #e5e7eb;
}

.dark .nutrient-bar {
  background: #374151;
  border-color: #4b5563;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.nutrient-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #6b7280;
}

.dark .nutrient-name {
  color: #9ca3af;
}

.nutrient-value {
  font-size: 24rpx;
  font-weight: 600;
  color: #111827;
}

.dark .nutrient-value {
  color: #f9fafb;
}

.progress-container {
  height: 12rpx;
  background: #e5e7eb;
  border-radius: 6rpx;
  overflow: hidden;
  position: relative;
}

.dark .progress-container {
  background: #4b5563;
}

.progress-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.progress-fill.warning {
  background: #f59e0b !important;
}

.progress-fill.danger {
  background: #ef4444 !important;
}

.percentage-text {
  font-size: 20rpx;
  color: #6b7280;
  margin-top: 8rpx;
  text-align: right;
  font-weight: 500;
}

.percentage-text.warning {
  color: #f59e0b;
}

.percentage-text.danger {
  color: #ef4444;
}
</style>