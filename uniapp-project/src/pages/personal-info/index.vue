<template>
  <view class="page-container" :class="themeStore.effectiveTheme">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="header-content">
        <wd-button type="text" @tap="goBack">←</wd-button>
        <view class="title">个人信息</view>
        <wd-button type="primary" size="small" @tap="saveInfo">保存</wd-button>
      </view>
    </view>

    <!-- 基本信息 -->
    <view class="section">
      <view class="section-title">基本信息</view>
      <wd-cell-group>
        <wd-cell title="用户名">
          <wd-input v-model="userInfo.name" placeholder="请输入用户名" :clearable="true" />
        </wd-cell>
        <wd-cell title="性别" is-link @click="showGenderPicker = true">
          {{ userInfo.gender }}
        </wd-cell>
        <wd-cell title="年龄">
          <wd-input-number v-model="userInfo.age" :min="1" :max="120" />
        </wd-cell>
        <wd-cell title="身高(cm)">
          <wd-input-number v-model="userInfo.height" :min="100" :max="250" />
        </wd-cell>
        <wd-cell title="体重(kg)">
          <wd-input-number v-model="userInfo.weight" :min="30" :max="200" :step="0.1" />
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 健康指标 -->
    <view class="section">
      <view class="section-title">健康指标</view>
      <view class="health-metrics">
        <view class="metric-card">
          <view class="metric-label">BMI</view>
          <view class="metric-value">{{ userStore.bmi }}</view>
          <view class="metric-status" :class="bmiStatusClass">{{ userStore.bmiStatus }}</view>
        </view>
        <view class="metric-card">
          <view class="metric-label">BMR</view>
          <view class="metric-value">{{ userStore.bmr }}</view>
          <view class="metric-unit">kcal/天</view>
        </view>
        <view class="metric-card">
          <view class="metric-label">TDEE</view>
          <view class="metric-value">{{ userStore.tdee }}</view>
          <view class="metric-unit">kcal/天</view>
        </view>
      </view>
      <view class="metric-info">
        <text>💡 BMR: 基础代谢率 | TDEE: 每日总能量消耗</text>
      </view>
    </view>

    <!-- 性别选择器 -->
    <wd-popup v-model="showGenderPicker" position="bottom">
      <view class="picker-content">
        <view class="picker-header">
          <wd-button type="text" @tap="showGenderPicker = false">取消</wd-button>
          <view class="picker-title">选择性别</view>
          <wd-button type="primary" size="small" @tap="confirmGender">确定</wd-button>
        </view>
        <wd-picker
          v-model="tempGender"
          :columns="genderColumns"
          @change="onGenderChange"
        />
      </view>
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useThemeStore } from '@/stores/theme';

const userStore = useUserStore();
const themeStore = useThemeStore();

const userInfo = reactive({ ...userStore.userInfo });
const showGenderPicker = ref(false);
const tempGender = ref(userInfo.gender);
const genderColumns = [{ values: ['男', '女'] }];

const bmiStatusClass = computed(() => {
  const status = userStore.bmiStatus;
  if (status === '正常') return 'status-normal';
  if (status === '偏瘦') return 'status-underweight';
  if (status === '偏胖' || status === '肥胖') return 'status-overweight';
  return '';
});

const onGenderChange = (value: any) => {
  tempGender.value = value.value;
};

const confirmGender = () => {
  userInfo.gender = tempGender.value;
  showGenderPicker.value = false;
};

const saveInfo = () => {
  if (!userInfo.name.trim()) {
    uni.showToast({ title: '请输入用户名', icon: 'none' });
    return;
  }
  if (userInfo.age <= 0) {
    uni.showToast({ title: '请输入有效年龄', icon: 'none' });
    return;
  }

  userStore.updateUserInfo(userInfo);
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

.health-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.metric-card {
  background: #f9fafb;
  padding: 20rpx;
  border-radius: 12rpx;
  text-align: center;
}

.dark .metric-card {
  background: #374151;
}

.metric-label {
  font-size: 22rpx;
  color: #6b7280;
  margin-bottom: 8rpx;
}

.dark .metric-label {
  color: #9ca3af;
}

.metric-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #111827;
  margin-bottom: 4rpx;
}

.dark .metric-value {
  color: #f9fafb;
}

.metric-unit,
.metric-status {
  font-size: 18rpx;
  color: #9ca3af;
}

.metric-status.status-normal {
  color: #10b981;
  font-weight: bold;
}

.metric-status.status-underweight {
  color: #3b82f6;
  font-weight: bold;
}

.metric-status.status-overweight {
  color: #ef4444;
  font-weight: bold;
}

.metric-info {
  background: #f0fdf4;
  padding: 12rpx 16rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  color: #14532d;
}

.dark .metric-info {
  background: #14532d;
  color: #86efac;
}

/* 选择器样式 */
.picker-content {
  background: #ffffff;
  min-height: 400rpx;
}

.dark .picker-content {
  background: #1f2937;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 32rpx;
  border-bottom: 1rpx solid #e5e7eb;
}

.dark .picker-header {
  border-bottom-color: #374151;
}

.picker-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #111827;
}

.dark .picker-title {
  color: #f9fafb;
}
</style>
