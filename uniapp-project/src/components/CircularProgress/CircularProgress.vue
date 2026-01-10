<template>
  <view class="circular-progress" :class="themeStore.effectiveTheme">
    <view class="progress-circle">
      <svg :width="size" :height="size" viewBox="0 0 100 100">
        <!-- 背景圆 -->
        <circle
          cx="50"
          cy="50"
          :r="radius"
          fill="none"
          :stroke="bgColor"
          :stroke-width="strokeWidth"
        />
        <!-- 进度圆 -->
        <circle
          cx="50"
          cy="50"
          :r="radius"
          fill="none"
          :stroke="progressColor"
          :stroke-width="strokeWidth"
          :stroke-dasharray="dashArray"
          :stroke-dashoffset="dashOffset"
          stroke-linecap="round"
          transform="rotate(-90 50 50)"
          class="progress-ring"
        />
      </svg>
      <view class="progress-content">
        <view class="progress-value">{{ displayValue }}</view>
        <view class="progress-label">{{ label }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme';

const props = defineProps<{
  value: number;
  max: number;
  label: string;
  size?: number;
  color?: string;
}>();

const themeStore = useThemeStore();

const size = computed(() => props.size || 120);
const radius = computed(() => 40);
const strokeWidth = computed(() => 8);

const bgColor = computed(() => {
  return themeStore.effectiveTheme === 'dark' ? '#374151' : '#e5e7eb';
});

const progressColor = computed(() => {
  if (props.color) return props.color;

  const percentage = (props.value / props.max) * 100;
  if (percentage > 100) return '#ef4444';
  if (percentage > 90) return '#f59e0b';
  if (percentage > 70) return '#10b981';
  return '#3b82f6';
});

const displayValue = computed(() => {
  return Math.round(props.value);
});

const circumference = computed(() => 2 * Math.PI * radius.value);
const dashArray = computed(() => circumference.value);
const dashOffset = computed(() => {
  const percentage = Math.min(props.value / props.max, 1);
  return circumference.value * (1 - percentage);
});
</script>

<style lang="scss" scoped>
.circular-progress {
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-circle {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-ring {
  transition: stroke-dashoffset 0.5s ease;
}

.progress-content {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.progress-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #111827;
  line-height: 1;
}

.dark .progress-value {
  color: #f9fafb;
}

.progress-label {
  font-size: 18rpx;
  color: #6b7280;
  margin-top: 4rpx;
}

.dark .progress-label {
  color: #9ca3af;
}
</style>