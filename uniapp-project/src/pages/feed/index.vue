<template>
  <view class="page-container" :class="themeStore.effectiveTheme">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="header-content">
        <view class="title">动态广场</view>
        <wd-button type="primary" size="small" @tap="navigateToCreatePost">
          发布
        </wd-button>
      </view>
    </view>

    <!-- 动态列表 -->
    <view class="feed-list">
      <view v-for="post in posts" :key="post.id" class="post-card">
        <!-- 用户信息 -->
        <view class="post-header">
          <view class="user-info">
            <view class="avatar">{{ post.userName.charAt(0) }}</view>
            <view class="user-details">
              <view class="username">{{ post.userName }}</view>
              <view class="timestamp">{{ post.createdAt }}</view>
            </view>
          </view>
        </view>

        <!-- 内容 -->
        <view class="post-content">{{ post.content }}</view>

        <!-- 话题标签 -->
        <view v-if="post.topics && post.topics.length > 0" class="topics">
          <view v-for="topic in post.topics" :key="topic" class="topic-tag">
            {{ topic }}
          </view>
        </view>

        <!-- 关联餐食 -->
        <view v-if="post.mealReference" class="meal-reference">
          <view class="meal-ref-title">🍽️ 关联餐食</view>
          <view class="meal-ref-content">
            <view v-if="Array.isArray(post.mealReference.mealType)">
              <view v-for="(type, idx) in post.mealReference.mealType" :key="idx">
                <text class="meal-type">{{ type }}</text>:
                <text>{{ post.mealReference.items[idx].join(', ') }}</text>
              </view>
            </view>
            <view v-else>
              <text class="meal-type">{{ post.mealReference.mealType }}</text>:
              <text>{{ post.mealReference.items.join(', ') }}</text>
            </view>
            <view class="meal-calories">总计: {{ post.mealReference.totalCalories }}kcal</view>
          </view>
        </view>

        <!-- 图片（占位） -->
        <view v-if="post.images && post.images.length > 0" class="post-images">
          <view v-for="(img, idx) in post.images" :key="idx" class="image-item">
            {{ img }}
          </view>
        </view>

        <!-- 互动按钮 -->
        <view class="post-actions">
          <view class="action-btn" @tap="toggleLike(post)">
            <text :class="{ liked: post.isLiked }">❤️</text>
            <text :class="{ liked: post.isLiked }">{{ post.likes }}</text>
          </view>
          <view class="action-btn">
            <text>💬</text>
            <text>{{ post.comments }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="posts.length === 0" class="empty-state">
        <text>暂无动态</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useThemeStore } from '@/stores/theme';

interface Post {
  id: string;
  userName: string;
  content: string;
  topics?: string[];
  mealReference?: {
    mealType: string | string[];
    items: string[] | string[][];
    totalCalories: number;
  };
  images?: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
}

const themeStore = useThemeStore();

const posts = ref<Post[]>([
  {
    id: '1',
    userName: '健康达人',
    content: '今天的午餐太满足了！鸡胸肉配糙米饭，营养又美味 💪',
    topics: ['#健康饮食', '#减脂餐'],
    mealReference: {
      mealType: '午餐',
      items: ['糙米饭 150g', '鸡胸肉 120g', '西兰花 100g'],
      totalCalories: 379
    },
    likes: 24,
    comments: 5,
    isLiked: false,
    createdAt: '2小时前'
  },
  {
    id: '2',
    userName: '营养达人',
    content: '今天的饮食记录分享！从早餐到晚餐都很营养均衡，总摄入1850大卡，完美控制在目标范围内！💯',
    topics: ['#全天打卡', '#营养均衡', '#健康饮食'],
    mealReference: {
      mealType: ['早餐', '午餐', '晚餐'],
      items: [
        ['燕麦粥 200g', '煮鸡蛋 1个', '蓝莓 50g'],
        ['糙米饭 150g', '鸡胸肉 120g', '西兰花 100g', '番茄 50g'],
        ['蔬菜沙拉 200g', '三文鱼 150g', '紫薯 100g']
      ],
      totalCalories: 1850
    },
    likes: 142,
    comments: 28,
    isLiked: true,
    createdAt: '3小时前'
  },
  {
    id: '3',
    userName: '减脂达人',
    content: '坚持打卡第30天！从65kg到现在62kg，感觉整个人都轻盈了！',
    topics: ['#坚持打卡', '#减脂成功'],
    likes: 89,
    comments: 12,
    isLiked: true,
    createdAt: '5小时前'
  }
]);

const navigateToCreatePost = () => {
  uni.navigateTo({
    url: '/pages/create-post/index'
  });
};

const toggleLike = (post: Post) => {
  if (post.isLiked) {
    post.likes--;
    post.isLiked = false;
  } else {
    post.likes++;
    post.isLiked = true;

    // 点赞动画效果
    uni.vibrateShort();
  }
};

onShow(() => {
  // 可以在这里刷新数据
});
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.dark .page-container {
  background-color: #111827;
}

/* 顶部导航 */
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
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
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

/* 动态列表 */
.feed-list {
  padding: 16rpx;
}

.post-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.dark .post-card {
  background: #1f2937;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

/* 用户信息 */
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 32rpx;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 28rpx;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.username {
  font-size: 28rpx;
  font-weight: bold;
  color: #111827;
}

.dark .username {
  color: #f9fafb;
}

.timestamp {
  font-size: 22rpx;
  color: #9ca3af;
}

/* 内容 */
.post-content {
  font-size: 28rpx;
  color: #111827;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

.dark .post-content {
  color: #f9fafb;
}

/* 话题标签 */
.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.topic-tag {
  padding: 6rpx 12rpx;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-radius: 8rpx;
  font-size: 22rpx;
}

/* 关联餐食 */
.meal-reference {
  background: #f0fdf4;
  padding: 16rpx;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
  border: 1rpx solid #bbf7d0;
}

.dark .meal-reference {
  background: #14532d;
  border-color: #166534;
}

.meal-ref-title {
  font-size: 24rpx;
  font-weight: bold;
  color: #14532d;
  margin-bottom: 8rpx;
}

.dark .meal-ref-title {
  color: #86efac;
}

.meal-ref-content {
  font-size: 22rpx;
  color: #166534;
  line-height: 1.6;
}

.dark .meal-ref-content {
  color: #4ade80;
}

.meal-type {
  font-weight: bold;
  color: #10b981;
}

.meal-calories {
  font-weight: bold;
  margin-top: 8rpx;
  color: #047857;
}

.dark .meal-calories {
  color: #6ee7b7;
}

/* 图片占位 */
.post-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.image-item {
  aspect-ratio: 1;
  background: #f3f4f6;
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20rpx;
  color: #9ca3af;
}

.dark .image-item {
  background: #374151;
}

/* 互动按钮 */
.post-actions {
  display: flex;
  gap: 32rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #e5e7eb;
}

.dark .post-actions {
  border-top-color: #374151;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #6b7280;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  transition: all 0.2s ease;
}

.action-btn:active {
  background: #f3f4f6;
}

.dark .action-btn:active {
  background: #374151;
}

.liked {
  color: #ef4444;
}

/* 空状态 */
.empty-state {
  padding: 80rpx 32rpx;
  text-align: center;
  color: #9ca3af;
  font-size: 28rpx;
}
</style>
