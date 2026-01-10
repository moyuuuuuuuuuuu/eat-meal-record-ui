<template>
  <view class="page-container" :class="themeStore.effectiveTheme">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="header-content">
        <wd-button type="text" @tap="goBack">←</wd-button>
        <view class="title">主题设置</view>
        <view style="width: 80rpx;"></view>
      </view>
    </view>

    <!-- 主题选项 -->
    <view class="section">
      <view class="section-title">外观模式</view>
      <wd-cell-group>
        <wd-cell title="跟随系统" is-link @click="selectTheme('system')">
          <template #right>
            <view v-if="themeStore.theme === 'system'" class="check-icon">✓</view>
          </template>
        </wd-cell>
        <wd-cell title="浅色模式" is-link @click="selectTheme('light')">
          <template #right>
            <view v-if="themeStore.theme === 'light'" class="check-icon">✓</view>
          </template>
        </wd-cell>
        <wd-cell title="深色模式" is-link @click="selectTheme('dark')">
          <template #right>
            <view v-if="themeStore.theme === 'dark'" class="check-icon">✓</view>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 预览区域 -->
    <view class="section">
      <view class="section-title">预览</view>
      <view class="preview-card" :class="themeStore.effectiveTheme">
        <view class="preview-header">示例卡片</view>
        <view class="preview-content">
          <view class="preview-text">当前主题：{{ themeStore.effectiveTheme === 'dark' ? '深色' : '浅色' }}</view>
          <view class="preview-text">系统主题：{{ systemTheme }}</view>
          <wd-button type="primary" size="small">示例按钮</wd-button>
        </view>
      </view>
    </view>

    <!-- 说明信息 -->
    <view class="info-section">
      <text>💡 提示：选择"跟随系统"时，应用会根据您的设备设置自动切换深浅色模式</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const systemTheme = ref('light');

const goBack = () => {
  uni.navigateBack();
};

const selectTheme = (theme: 'system' | 'light' | 'dark') => {
  themeStore.setTheme(theme);
};

onMounted(() => {
  // 获取系统主题
  const systemInfo = uni.getSystemInfoSync();
  systemTheme.value = systemInfo.theme === 'dark' ? '深色' : '浅色';
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
  position: sticky;
  top: 0;
  z-index: 100;
}

.dark .header {
  background: #1f2937;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #111827;
}

.dark .title {
  color: #f9fafb;
}

.section {
  background: #ffffff;
  margin: 16rpx;
  padding: 24rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.dark .section {
  background: #1f2937;
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

.check-icon {
  color: #10b981;
  font-weight: bold;
  font-size: 32rpx;
}

/* 预览卡片 */
.preview-card {
  background: #ffffff;
  border-radius: 12rpx;
  overflow: hidden;
  border: 1rpx solid #e5e7eb;
}

.preview-card.dark {
  background: #1f2937;
  border-color: #374151;
}

.preview-header {
  background: #10b981;
  color: #ffffff;
  padding: 16rpx 20rpx;
  font-weight: bold;
  font-size: 28rpx;
}

.preview-content {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: flex-start;
}

.preview-text {
  font-size: 26rpx;
  color: #6b7280;
}

.dark .preview-text {
  color: #9ca3af;
}

/* 信息区域 */
.info-section {
  background: #f0fdf4;
  padding: 20rpx 24rpx;
  margin: 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #14532d;
}

.dark .info-section {
  background: #14532d;
  color: #86efac;
}
</style>