<template>
  <view class="page-container" :class="themeStore.effectiveTheme">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="header-content">
        <wd-button type="text" @tap="goBack">←</wd-button>
        <view class="title">目标设置</view>
        <wd-button type="primary" size="small" @tap="saveSettings">保存</wd-button>
      </view>
    </view>

    <!-- 目标类型 -->
    <view class="section">
      <view class="section-title">目标类型</view>
      <wd-radio-group v-model="goalSettings.goal" direction="horizontal">
        <wd-radio value="lose">减脂</wd-radio>
        <wd-radio value="maintain">保持</wd-radio>
        <wd-radio value="gain">增肌</wd-radio>
      </wd-radio-group>
    </view>

    <!-- 智能推荐 -->
    <view class="section">
      <view class="section-title">智能推荐</view>
      <view class="recommend-info">
        <text>根据您的个人信息自动计算推荐值</text>
        <view class="calc-details">
          <text>BMR: {{ userStore.bmr }} kcal</text>
          <text>TDEE: {{ userStore.tdee }} kcal</text>
        </view>
      </view>
      <wd-button type="primary" plain @tap="useRecommended" style="width: 100%;">
        使用推荐值 ({{ userStore.recommendedCalories }} kcal)
      </wd-button>
    </view>

    <!-- 数值设置 -->
    <view class="section">
      <view class="section-title">每日目标</view>
      <wd-cell-group>
        <wd-cell title="卡路里">
          <wd-input-number
            v-model="goalSettings.dailyCalories"
            :min="1000"
            :max="5000"
            :step="50"
            unit="kcal"
          />
        </wd-cell>
        <wd-cell title="蛋白质">
          <wd-input-number
            v-model="goalSettings.protein"
            :min="20"
            :max="300"
            :step="5"
            unit="g"
          />
        </wd-cell>
        <wd-cell title="碳水化合物">
          <wd-input-number
            v-model="goalSettings.carbs"
            :min="20"
            :max="500"
            :step="5"
            unit="g"
          />
        </wd-cell>
        <wd-cell title="脂肪">
          <wd-input-number
            v-model="goalSettings.fat"
            :min="5"
            :max="150"
            :step="1"
            unit="g"
          />
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 目标体重 -->
    <view class="section">
      <view class="section-title">体重目标</view>
      <wd-cell-group>
        <wd-cell title="目标体重">
          <wd-input-number
            v-model="goalSettings.targetWeight"
            :min="30"
            :max="200"
            :step="0.5"
            unit="kg"
          />
        </wd-cell>
      </wd-cell-group>
      <view class="weight-diff">
        当前体重: {{ userStore.userInfo.weight }}kg · 差值: {{ userStore.weightDiff > 0 ? '+' : '' }}{{ userStore.weightDiff }}kg
      </view>
    </view>

    <!-- 推荐营养素分配 -->
    <view class="section">
      <view class="section-title">营养素分配参考</view>
      <view class="nutrient-ratio">
        <view class="ratio-item">
          <view class="ratio-label">蛋白质</view>
          <view class="ratio-value">25-30%</view>
          <view class="ratio-desc">增肌期可提高到30-35%</view>
        </view>
        <view class="ratio-item">
          <view class="ratio-label">碳水化合物</view>
          <view class="ratio-value">40-50%</view>
          <view class="ratio-desc">减脂期可降低到30-40%</view>
        </view>
        <view class="ratio-item">
          <view class="ratio-label">脂肪</view>
          <view class="ratio-value">20-30%</view>
          <view class="ratio-desc">保持激素平衡</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import { useThemeStore } from '@/stores/theme';

const userStore = useUserStore();
const themeStore = useThemeStore();

// 使用 reactive 确保数据响应式
const goalSettings = reactive({
  ...userStore.goalSettings
});

const useRecommended = () => {
  userStore.useRecommendedGoals();
  // 同步到本地状态
  Object.assign(goalSettings, userStore.goalSettings);
};

const saveSettings = () => {
  userStore.updateGoalSettings(goalSettings);
  uni.showToast({
    title: '保存成功',
    icon: 'success',
    success: () => {
      uni.navigateBack();
    }
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

.recommend-info {
  background: #f0fdf4;
  padding: 16rpx;
  border-radius: 8rpx;
  margin-bottom: 16rpx;
  color: #14532d;
  font-size: 24rpx;
}

.dark .recommend-info {
  background: #14532d;
  color: #86efac;
}

.calc-details {
  display: flex;
  gap: 24rpx;
  margin-top: 8rpx;
  font-weight: bold;
}

.weight-diff {
  margin-top: 16rpx;
  padding: 12rpx;
  background: #f9fafb;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #6b7280;
  text-align: center;
}

.dark .weight-diff {
  background: #374151;
  color: #9ca3af;
}

.nutrient-ratio {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.ratio-item {
  background: #f9fafb;
  padding: 16rpx;
  border-radius: 8rpx;
}

.dark .ratio-item {
  background: #374151;
}

.ratio-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #111827;
  margin-bottom: 4rpx;
}

.dark .ratio-label {
  color: #f9fafb;
}

.ratio-value {
  font-size: 24rpx;
  color: #10b981;
  font-weight: bold;
  margin-bottom: 4rpx;
}

.ratio-desc {
  font-size: 20rpx;
  color: #6b7280;
}

.dark .ratio-desc {
  color: #9ca3af;
}
</style>
