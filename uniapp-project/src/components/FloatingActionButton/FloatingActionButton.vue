<template>
  <view class="fab-container" :class="themeStore.effectiveTheme">
    <view
      class="fab-button"
      :class="{ active: showActions }"
      @tap="toggleActions"
      @longpress="showActions = true"
    >
      <text class="fab-icon">{{ showActions ? '✕' : '+' }}</text>
    </view>

    <view v-if="showActions" class="action-buttons">
      <view
        v-for="(action, index) in actions"
        :key="action.label"
        class="action-item"
        :style="{ animationDelay: `${index * 0.05}s` }"
        @tap="handleAction(action)"
      >
        <view class="action-label">{{ action.label }}</view>
        <view class="action-button" :style="{ background: action.color }">
          <text class="action-icon">{{ action.icon }}</text>
        </view>
      </view>
    </view>

    <!-- 遮罩层 -->
    <view
      v-if="showActions"
      class="overlay"
      @tap="showActions = false"
      @touchmove.prevent
    ></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useThemeStore } from '@/stores/theme';

const emit = defineEmits<{
  (e: 'add-meal'): void;
  (e: 'scan-food'): void;
  (e: 'create-post'): void;
}>();

const themeStore = useThemeStore();
const showActions = ref(false);

interface Action {
  label: string;
  icon: string;
  color: string;
  emit: string;
}

const actions: Action[] = [
  {
    label: '添加餐食',
    icon: '🍽️',
    color: '#10b981',
    emit: 'add-meal'
  },
  {
    label: '拍照识别',
    icon: '📸',
    color: '#3b82f6',
    emit: 'scan-food'
  },
  {
    label: '发动态',
    icon: '📝',
    color: '#f59e0b',
    emit: 'create-post'
  }
];

const toggleActions = () => {
  showActions.value = !showActions.value;
};

const handleAction = (action: Action) => {
  showActions.value = false;
  emit(action.emit as any);
};
</script>

<style lang="scss" scoped>
.fab-container {
  position: fixed;
  bottom: 120rpx;
  right: 32rpx;
  z-index: 999;
}

.fab-button {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(16, 185, 129, 0.4);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1001;
}

.fab-button.active {
  transform: rotate(135deg);
  background: #ef4444;
  box-shadow: 0 8rpx 24rpx rgba(239, 68, 68, 0.4);
}

.fab-icon {
  font-size: 48rpx;
  color: #ffffff;
  font-weight: bold;
  line-height: 1;
}

/* 动作按钮 */
.action-buttons {
  position: absolute;
  bottom: 120rpx;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  z-index: 1000;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  animation: slideInUp 0.3s ease forwards;
  opacity: 0;
  transform: translateY(20rpx);
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.action-label {
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  white-space: nowrap;
}

.dark .action-label {
  background: rgba(255, 255, 255, 0.9);
  color: #111827;
}

.action-button {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.action-button:active {
  transform: scale(0.9);
}

.action-icon {
  font-size: 36rpx;
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 小程序适配 */
@media screen and (max-height: 700px) {
  .fab-container {
    bottom: 160rpx;
  }
}
</style>