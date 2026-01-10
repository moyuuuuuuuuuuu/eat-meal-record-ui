<template>
  <view class="app-container">
    <router-view />
  </view>
</template>

<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useThemeStore } from './stores/theme';
import { useMealStore } from './stores/meal';
import { useUserStore } from './stores/user';

const themeStore = useThemeStore();
const mealStore = useMealStore();
const userStore = useUserStore();

onLaunch(() => {
  console.log('App Launch');
  // 初始化数据
  themeStore.loadFromStorage();
  mealStore.loadFromStorage();
  userStore.loadFromStorage();
});

onShow(() => {
  console.log('App Show');
});

onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
/* 全局样式重置 */
page {
  background-color: #f9fafb;
}

/* 深色模式支持 */
.dark {
  background-color: #111827 !important;
}

/* 底部安全区 */
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* 通用卡片样式 */
.card {
  background: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.05);
}

.dark .card {
  background: #1f2937;
  box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
}

/* 通用容器 */
.container {
  padding: 32rpx;
  min-height: 100vh;
}
</style>
