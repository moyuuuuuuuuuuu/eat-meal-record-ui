<template>
  <view class="page-container" :class="themeStore.effectiveTheme">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="header-content">
        <wd-button type="text" @tap="cancelPost">取消</wd-button>
        <view class="title">发布动态</view>
        <wd-button type="primary" size="small" :disabled="!canPost" @tap="publishPost">
          发布
        </wd-button>
      </view>
    </view>

    <!-- 内容输入 -->
    <view class="section">
      <wd-textarea
        v-model="content"
        placeholder="分享你的饮食心得..."
        :rows="6"
        maxlength="500"
        show-word-limit
      />
    </view>

    <!-- 图片上传 -->
    <view class="section">
      <view class="section-title">图片（可选）</view>
      <wd-upload v-model="images" :max-count="9" multiple />
    </view>

    <!-- 话题标签 -->
    <view class="section">
      <view class="section-title">话题标签</view>
      <view class="topics-container">
        <view v-for="topic in selectedTopics" :key="topic" class="topic-tag" @tap="removeTopic(topic)">
          {{ topic }} ×
        </view>
        <wd-button type="text" size="small" @tap="showTopicSelector = true">
          + 添加话题
        </wd-button>
      </view>
    </view>

    <!-- 关联餐食 -->
    <view class="section">
      <view class="section-title">关联餐食</view>
      <view v-if="selectedMeals.length > 0" class="selected-meals">
        <view v-for="meal in selectedMeals" :key="meal.id" class="meal-tag">
          {{ meal.mealType }}: {{ meal.totalCalories }}kcal
        </view>
        <wd-button type="text" size="small" @tap="clearMeals">清空</wd-button>
      </view>
      <wd-button type="primary" plain @tap="showMealSelector = true" style="width: 100%;">
        选择餐食记录
      </wd-button>
    </view>

    <!-- 位置信息 -->
    <view class="section">
      <view class="location-row">
        <view class="location-label">📍 添加位置</view>
        <wd-switch v-model="enableLocation" @change="handleLocationChange" />
      </view>
      <view v-if="location && enableLocation" class="location-info">
        <text>纬度: {{ location.latitude }}</text>
        <text>经度: {{ location.longitude }}</text>
      </view>
    </view>

    <!-- 话题选择弹窗 -->
    <wd-popup v-model="showTopicSelector" position="bottom" :style="{ height: '60vh' }">
      <view class="popup-content">
        <view class="popup-header">选择话题</view>
        <view class="topic-grid">
          <view
            v-for="topic in popularTopics"
            :key="topic"
            class="topic-option"
            @tap="addTopic(topic)"
          >
            {{ topic }}
          </view>
        </view>
      </view>
    </wd-popup>

    <!-- 餐食选择弹窗 -->
    <wd-popup v-model="showMealSelector" position="bottom" :style="{ height: '70vh' }">
      <view class="popup-content">
        <view class="popup-header">选择餐食（多选）</view>
        <view class="meal-select-list">
          <view v-for="meal in recentMeals" :key="meal.id" class="meal-select-item" @tap="toggleMealSelection(meal)">
            <view class="meal-select-info">
              <text class="meal-type">{{ meal.mealType }}</text>
              <text class="meal-date">{{ meal.date }} {{ meal.time }}</text>
              <text class="meal-calories">{{ meal.totalCalories }}kcal</text>
            </view>
            <view class="checkbox" :class="{ checked: isMealSelected(meal.id) }">
              {{ isMealSelected(meal.id) ? '✓' : '' }}
            </view>
          </view>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { useMealStore } from '@/stores/meal';

const themeStore = useThemeStore();
const mealStore = useMealStore();

const content = ref('');
const images = ref<string[]>([]);
const selectedTopics = ref<string[]>([]);
const selectedMeals = ref<any[]>([]);
const enableLocation = ref(false);
const location = ref<{ latitude: number; longitude: number } | null>(null);

const showTopicSelector = ref(false);
const showMealSelector = ref(false);

const popularTopics = [
  '#健康饮食', '#减脂餐', '#增肌', '#低卡',
  '#高蛋白', '#营养搭配', '#早餐', '#午餐',
  '#晚餐', '#轻食', '#健身餐', '#打卡'
];

const canPost = computed(() => content.value.trim().length > 0);

const recentMeals = computed(() => {
  // 获取最近7天的餐食
  return mealStore.meals.slice(-10).reverse();
});

const addTopic = (topic: string) => {
  if (!selectedTopics.value.includes(topic)) {
    selectedTopics.value.push(topic);
  }
  showTopicSelector.value = false;
};

const removeTopic = (topic: string) => {
  selectedTopics.value = selectedTopics.value.filter(t => t !== topic);
};

const toggleMealSelection = (meal: any) => {
  const index = selectedMeals.value.findIndex(m => m.id === meal.id);
  if (index > -1) {
    selectedMeals.value.splice(index, 1);
  } else {
    selectedMeals.value.push(meal);
  }
};

const isMealSelected = (mealId: string) => {
  return selectedMeals.value.some(m => m.id === mealId);
};

const clearMeals = () => {
  selectedMeals.value = [];
};

const handleLocationChange = (value: boolean) => {
  if (value) {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        location.value = {
          latitude: res.latitude,
          longitude: res.longitude
        };
        uni.showToast({ title: '位置获取成功', icon: 'success' });
      },
      fail: () => {
        enableLocation.value = false;
        uni.showToast({ title: '位置获取失败', icon: 'none' });
      }
    });
  } else {
    location.value = null;
  }
};

const publishPost = () => {
  // 模拟发布
  uni.showLoading({ title: '发布中...' });

  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: '发布成功',
      icon: 'success',
      success: () => {
        uni.navigateBack();
      }
    });
  }, 1000);
};

const cancelPost = () => {
  if (content.value || images.value.length > 0 || selectedTopics.value.length > 0) {
    uni.showModal({
      title: '确认取消',
      content: '是否放弃编辑的内容？',
      success: (res) => {
        if (res.confirm) {
          uni.navigateBack();
        }
      }
    });
  } else {
    uni.navigateBack();
  }
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
  font-size: 28rpx;
  font-weight: bold;
  color: #111827;
  margin-bottom: 16rpx;
}

.dark .section-title {
  color: #f9fafb;
}

.topics-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  align-items: center;
}

.topic-tag {
  padding: 8rpx 16rpx;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.selected-meals {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.meal-tag {
  padding: 6rpx 12rpx;
  background: #f0fdf4;
  color: #14532d;
  border-radius: 8rpx;
  font-size: 22rpx;
  border: 1rpx solid #bbf7d0;
}

.dark .meal-tag {
  background: #14532d;
  color: #86efac;
  border-color: #166534;
}

.location-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location-label {
  font-size: 28rpx;
  color: #111827;
}

.dark .location-label {
  color: #f9fafb;
}

.location-info {
  margin-top: 16rpx;
  padding: 16rpx;
  background: #f9fafb;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.dark .location-info {
  background: #374151;
  color: #9ca3af;
}

/* 弹窗样式 */
.popup-content {
  padding: 32rpx;
  background: #ffffff;
  min-height: 100%;
}

.dark .popup-content {
  background: #1f2937;
}

.popup-header {
  font-size: 32rpx;
  font-weight: bold;
  color: #111827;
  margin-bottom: 24rpx;
}

.dark .popup-header {
  color: #f9fafb;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.topic-option {
  padding: 16rpx;
  background: #f9fafb;
  border-radius: 8rpx;
  text-align: center;
  font-size: 24rpx;
  color: #111827;
}

.dark .topic-option {
  background: #374151;
  color: #f9fafb;
}

.topic-option:active {
  background: #e5e7eb;
}

.dark .topic-option:active {
  background: #4b5563;
}

.meal-select-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.meal-select-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #f9fafb;
  border-radius: 12rpx;
  border: 1rpx solid #e5e7eb;
}

.dark .meal-select-item {
  background: #374151;
  border-color: #4b5563;
}

.meal-select-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.meal-type {
  font-size: 28rpx;
  font-weight: bold;
  color: #111827;
}

.dark .meal-type {
  color: #f9fafb;
}

.meal-date {
  font-size: 22rpx;
  color: #6b7280;
}

.dark .meal-date {
  color: #9ca3af;
}

.meal-calories {
  font-size: 24rpx;
  color: #10b981;
  font-weight: bold;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
  border: 2rpx solid #d1d5db;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 24rpx;
}

.checkbox.checked {
  background: #10b981;
  border-color: #10b981;
}
</style>
