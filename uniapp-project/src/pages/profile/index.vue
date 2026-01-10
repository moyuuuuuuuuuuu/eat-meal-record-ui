<template>
  <view class="page-container" :class="themeStore.effectiveTheme">
    <!-- 头部信息卡 -->
    <view class="profile-header">
      <view class="header-content">
        <view class="user-avatar">
          <text class="avatar-text">{{ userStore.userInfo.name.charAt(0) }}</text>
        </view>
        <view class="user-info">
          <view class="user-name">{{ userStore.userInfo.name }}</view>
          <view class="user-stats">
            已坚持 {{ userStore.userInfo.joinDays || 45 }} 天
          </view>
          <view class="user-bio">
            {{ userStore.userInfo.gender }} · {{ userStore.userInfo.age }}岁 · {{ userStore.userInfo.height }}cm · {{ userStore.userInfo.weight }}kg
          </view>
        </view>
        <view class="header-actions">
          <wd-button type="text" @tap="navigateToThemeSettings" class="action-btn">
            🎨
          </wd-button>
          <wd-button type="text" @tap="navigateToPersonalInfo" class="action-btn">
            ⚙️
          </wd-button>
        </view>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-card">
      <view class="stats-grid">
        <view class="stat-item">
          <view class="stat-value">{{ userStore.userInfo.totalRecords || 128 }}</view>
          <view class="stat-label">记录天数</view>
        </view>
        <view class="stat-item border-left">
          <view class="stat-value">{{ userStore.userInfo.avgCalories || 1890 }}</view>
          <view class="stat-label">平均摄入</view>
        </view>
        <view class="stat-item border-left">
          <view class="stat-value" :class="{ 'positive': userStore.weightDiff > 0, 'negative': userStore.weightDiff < 0 }">
            {{ userStore.weightDiff }}kg
          </view>
          <view class="stat-label">距离目标</view>
        </view>
      </view>
    </view>

    <!-- 快捷菜单 -->
    <view class="menu-section">
      <view class="menu-group">
        <wd-cell-group>
          <wd-cell title="📋 餐食记录" is-link @click="navigateToMealHistory">
            <template #right>
              <text class="menu-hint">查看历史</text>
            </template>
          </wd-cell>
          <wd-cell title="🎯 目标设置" is-link @click="navigateToGoalSettings">
            <template #right>
              <text class="menu-hint">{{ userStore.goalSettings.dailyCalories }}kcal</text>
            </template>
          </wd-cell>
          <wd-cell title="📊 营养统计" is-link @click="showComingSoon">
            <template #right>
              <text class="menu-hint">图表分析</text>
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>

      <view class="menu-group">
        <wd-cell-group>
          <wd-cell title="ℹ️ 关于应用" is-link @click="showAbout">
            <template #right>
              <text class="menu-hint">v1.0.0</text>
            </template>
          </wd-cell>
          <wd-cell title="📞 联系我们" is-link @click="showContact">
            <template #right>
              <text class="menu-hint">反馈建议</text>
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>
    </view>

    <!-- 底部信息 -->
    <view class="footer-info">
      <text>食刻轻卡 · 健康生活每一天</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useThemeStore } from '@/stores/theme';

const userStore = useUserStore();
const themeStore = useThemeStore();

const navigateToMealHistory = () => {
  uni.navigateTo({
    url: '/pages/meal-history/index'
  });
};

const navigateToGoalSettings = () => {
  uni.navigateTo({
    url: '/pages/goal-settings/index'
  });
};

const navigateToPersonalInfo = () => {
  uni.navigateTo({
    url: '/pages/personal-info/index'
  });
};

const navigateToThemeSettings = () => {
  uni.navigateTo({
    url: '/pages/theme-settings/index'
  });
};

const showComingSoon = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  });
};

const showAbout = () => {
  uni.showModal({
    title: '关于食刻轻卡',
    content: '一款专注于卡路里与营养素追踪的健康管理应用\n\n版本: 1.0.0\n构建: 20260110',
    showCancel: false,
    confirmText: '知道了'
  });
};

const showContact = () => {
  uni.showModal({
    title: '联系我们',
    content: '如有问题或建议，欢迎反馈！\n\n邮箱: support@eat-meal.com\n\n感谢您的使用 🙏',
    showCancel: false,
    confirmText: '好的'
  });
};
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.dark .page-container {
  background-color: #111827;
}

/* 头部信息卡 */
.profile-header {
  background: linear-gradient(135deg, #10b981, #059669);
  padding: 48rpx 32rpx 80rpx;
  color: #ffffff;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.avatar-text {
  font-size: 48rpx;
  font-weight: bold;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.user-stats {
  font-size: 24rpx;
  opacity: 0.9;
  margin-bottom: 8rpx;
}

.user-bio {
  font-size: 22rpx;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 8rpx;
}

.action-btn {
  padding: 12rpx;
  min-width: 60rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12rpx;
}

/* 统计卡片 */
.stats-card {
  background: #ffffff;
  margin: -60rpx 32rpx 0;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.dark .stats-card {
  background: #1f2937;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
}

.stats-grid {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.border-left {
  border-left: 1rpx solid #e5e7eb;
}

.dark .border-left {
  border-left-color: #374151;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #111827;
}

.dark .stat-value {
  color: #f9fafb;
}

.stat-value.positive {
  color: #ef4444;
}

.stat-value.negative {
  color: #10b981;
}

.stat-label {
  font-size: 22rpx;
  color: #6b7280;
}

.dark .stat-label {
  color: #9ca3af;
}

/* 菜单区域 */
.menu-section {
  margin-top: 32rpx;
  padding: 0 32rpx;
}

.menu-group {
  margin-bottom: 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.menu-hint {
  font-size: 22rpx;
  color: #9ca3af;
}

/* 底部信息 */
.footer-info {
  margin-top: 48rpx;
  padding: 24rpx;
  text-align: center;
  font-size: 22rpx;
  color: #9ca3af;
}
</style>
