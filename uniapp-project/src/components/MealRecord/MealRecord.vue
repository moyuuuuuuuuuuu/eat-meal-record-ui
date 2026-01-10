<template>
  <view class="meal-record" :class="themeStore.effectiveTheme">
    <view class="meal-header" @tap="toggleExpand">
      <view class="meal-info">
        <text class="meal-type">{{ meal.mealType }}</text>
        <text class="meal-time">{{ meal.time }}</text>
      </view>
      <view class="meal-totals">
        <text class="total-calories">{{ meal.totalCalories }}kcal</text>
        <wd-icon :name="expanded ? 'arrow-up' : 'arrow-down'" size="16" color="#6b7280" />
      </view>
    </view>

    <view v-if="expanded" class="meal-items">
      <view
        v-for="item in meal.items"
        :key="item.id"
        class="food-item"
        @longpress="showDeleteOptions(item)"
      >
        <view class="food-info">
          <text class="food-name">{{ item.name }}</text>
          <text class="food-amount">{{ item.amount }}{{ item.unit }}</text>
        </view>
        <view class="food-nutrients">
          <text>{{ item.calories }}kcal</text>
          <text class="nutrient-detail">P:{{ item.protein }}g</text>
          <text class="nutrient-detail">C:{{ item.carbs }}g</text>
          <text class="nutrient-detail">F:{{ item.fat }}g</text>
        </view>
      </view>
    </view>

    <!-- 删除确认弹窗 -->
    <wd-popup v-model="showDeleteDialog" position="bottom" :style="{ height: '30vh' }">
      <view class="delete-dialog">
        <view class="dialog-title">删除食物</view>
        <view class="dialog-content">
          <text>确定要删除 "{{ deleteTarget?.name }}" 吗？</text>
        </view>
        <view class="dialog-actions">
          <wd-button type="text" @tap="showDeleteDialog = false">取消</wd-button>
          <wd-button type="danger" @tap="confirmDelete">删除</wd-button>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useThemeStore } from '@/stores/theme';
import type { MealRecord, FoodItem } from '@/types';

const props = defineProps<{
  meal: MealRecord;
}>();

const emit = defineEmits<{
  (e: 'delete-food', mealId: string, foodId: string): void;
}>();

const themeStore = useThemeStore();
const expanded = ref(false);
const showDeleteDialog = ref(false);
const deleteTarget = ref<FoodItem | null>(null);

const toggleExpand = () => {
  expanded.value = !expanded.value;
};

const showDeleteOptions = (item: FoodItem) => {
  #ifdef APP-PLUS || MP-WEIXIN
  uni.showActionSheet({
    itemList: ['删除食物'],
    success: (res) => {
      if (res.tapIndex === 0) {
        deleteTarget.value = item;
        showDeleteDialog.value = true;
      }
    }
  });
  #else
  // H5和其他平台使用弹窗确认
  deleteTarget.value = item;
  showDeleteDialog.value = true;
  #endif
};

const confirmDelete = () => {
  if (deleteTarget.value) {
    emit('delete-food', props.meal.id, deleteTarget.value.id);
    showDeleteDialog.value = false;
    deleteTarget.value = null;
  }
};
</script>

<style lang="scss" scoped>
.meal-record {
  background: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
  border: 1rpx solid #e5e7eb;
  overflow: hidden;
}

.dark .meal-record {
  background: #1f2937;
  border-color: #374151;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  cursor: pointer;
  user-select: none;
}

.meal-info {
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

.meal-time {
  font-size: 22rpx;
  color: #6b7280;
}

.dark .meal-time {
  color: #9ca3af;
}

.meal-totals {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.total-calories {
  font-size: 26rpx;
  font-weight: 600;
  color: #10b981;
}

.meal-items {
  border-top: 1rpx solid #e5e7eb;
  padding: 12rpx 24rpx 20rpx;
}

.dark .meal-items {
  border-color: #374151;
}

.food-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx dashed #e5e7eb;
}

.food-item:last-child {
  border-bottom: none;
}

.dark .food-item {
  border-color: #374151;
}

.food-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.food-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #111827;
}

.dark .food-name {
  color: #f9fafb;
}

.food-amount {
  font-size: 22rpx;
  color: #6b7280;
}

.dark .food-amount {
  color: #9ca3af;
}

.food-nutrients {
  display: flex;
  gap: 8rpx;
  font-size: 20rpx;
  color: #6b7280;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.dark .food-nutrients {
  color: #9ca3af;
}

.nutrient-detail {
  opacity: 0.7;
}

/* 删除弹窗样式 */
.delete-dialog {
  padding: 32rpx;
  background: #ffffff;
  min-height: 100%;
}

.dark .delete-dialog {
  background: #1f2937;
}

.dialog-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #111827;
  margin-bottom: 16rpx;
}

.dark .dialog-title {
  color: #f9fafb;
}

.dialog-content {
  font-size: 28rpx;
  color: #6b7280;
  margin-bottom: 32rpx;
  line-height: 1.6;
}

.dark .dialog-content {
  color: #9ca3af;
}

.dialog-actions {
  display: flex;
  gap: 16rpx;
  justify-content: flex-end;
}
</style>