<template>
  <view class="food-suggestion">
    <view class="suggestion-card" @tap="refreshSuggestion">
      <view class="card-header">
        <view class="title">
          <text>🍽️</text>
          <text>{{ currentSuggestion.name }}</text>
        </view>
        <view class="refresh-btn" :class="{ spinning: isSpinning }">
          <text>↻</text>
        </view>
      </view>

      <view class="card-body">
        <view class="calories">{{ currentSuggestion.calories }} kcal</view>
        <view class="tags">
          <view
            v-for="tag in currentSuggestion.tags"
            :key="tag"
            class="tag"
            :style="{ backgroundColor: getTagColor(tag) }"
          >
            {{ tag }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Suggestion {
  name: string;
  calories: number;
  tags: string[];
}

const suggestions: Suggestion[] = [
  { name: '水煮鸡胸肉配西兰花', calories: 280, tags: ['高蛋白', '低脂'] },
  { name: '糙米饭配鲑鱼', calories: 420, tags: ['健康脂肪', '优质碳水'] },
  { name: '希腊酸奶配蓝莓', calories: 180, tags: ['低卡', '益生菌'] },
  { name: '燕麦粥配香蕉', calories: 320, tags: ['碳水能量', '饱腹感'] },
  { name: '蔬菜沙拉配鸡蛋', calories: 220, tags: ['低脂', '维生素'] },
  { name: '全麦三明治', calories: 350, tags: ['均衡', '方便'] },
  { name: '红薯配鸡胸肉', calories: 380, tags: ['低GI', '高蛋白'] },
  { name: '豆腐蔬菜汤', calories: 150, tags: ['低卡', '清淡'] }
];

const currentIndex = ref(0);
const isSpinning = ref(false);

const currentSuggestion = computed(() => suggestions[currentIndex.value]);

const getTagColor = (tag: string) => {
  const colors: Record<string, string> = {
    '高蛋白': '#fb923c',
    '低脂': '#10b981',
    '健康脂肪': '#3b82f6',
    '优质碳水': '#8b5cf6',
    '低卡': '#22c55e',
    '益生菌': '#06b6d4',
    '碳水能量': '#f59e0b',
    '饱腹感': '#6366f1',
    '均衡': '#a855f7',
    '方便': '#64748b',
    '低GI': '#0ea5e9',
    '维生素': '#ec4899',
    '清淡': '#14b8a6'
  };
  return colors[tag] || '#6b7280';
};

const refreshSuggestion = () => {
  isSpinning.value = true;

  // 旋转动画
  setTimeout(() => {
    // 随机选择一个建议（不重复当前）
    let newIndex = currentIndex.value;
    while (newIndex === currentIndex.value && suggestions.length > 1) {
      newIndex = Math.floor(Math.random() * suggestions.length);
    }
    currentIndex.value = newIndex;
  }, 150);

  // 重置旋转状态
  setTimeout(() => {
    isSpinning.value = false;
  }, 600);
};
</script>

<style lang="scss" scoped>
.food-suggestion {
  width: 100%;
}

.suggestion-card {
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 16rpx;
  padding: 28rpx;
  color: #ffffff;
  box-shadow: 0 4rpx 16rpx rgba(16, 185, 129, 0.3);
  transition: transform 0.2s ease;
}

.suggestion-card:active {
  transform: scale(0.98);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
  flex: 1;
}

.refresh-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  transition: all 0.3s ease;
}

.refresh-btn.spinning {
  animation: spin 0.6s ease;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calories {
  font-size: 36rpx;
  font-weight: bold;
}

.tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
  max-width: 60%;
}

.tag {
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  color: #ffffff;
  white-space: nowrap;
}
</style>
