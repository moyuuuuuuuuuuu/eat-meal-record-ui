<template>
  <view class="post-card" :class="themeStore.effectiveTheme">
    <!-- 用户信息 -->
    <view class="post-header">
      <view class="user-info">
        <view class="avatar">{{ post.author.charAt(0).toUpperCase() }}</view>
        <view class="user-details">
          <text class="username">{{ post.author }}</text>
          <text class="post-time">{{ formatTime(post.timestamp) }}</text>
        </view>
      </view>
      <wd-button v-if="post.isOwner" type="text" size="small" @tap="showDeleteConfirm">
        删除
      </wd-button>
    </view>

    <!-- 内容 -->
    <view class="post-content" @tap="toggleExpand">
      <text class="content-text" :class="{ collapsed: !expanded && post.content.length > 100 }">
        {{ expanded ? post.content : truncatedContent }}
      </text>
      <text v-if="post.content.length > 100" class="expand-text">
        {{ expanded ? '收起' : '展开更多' }}
      </text>
    </view>

    <!-- 图片（如果有） -->
    <view v-if="post.image" class="post-image" @tap="previewImage">
      <image :src="post.image" mode="aspectFill" class="image" />
    </view>

    <!-- 营养信息 -->
    <view v-if="post.nutrition" class="nutrition-info">
      <view class="nutrition-tag">
        <text class="tag-label">热量</text>
        <text class="tag-value">{{ post.nutrition.calories }}kcal</text>
      </view>
      <view class="nutrition-tag">
        <text class="tag-label">蛋白质</text>
        <text class="tag-value">{{ post.nutrition.protein }}g</text>
      </view>
      <view class="nutrition-tag">
        <text class="tag-label">碳水</text>
        <text class="tag-value">{{ post.nutrition.carbs }}g</text>
      </view>
      <view class="nutrition-tag">
        <text class="tag-label">脂肪</text>
        <text class="tag-value">{{ post.nutrition.fat }}g</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="post-actions">
      <view class="action-item" @tap="handleLike">
        <wd-icon :name="post.liked ? 'heart-fill' : 'heart'" :color="post.liked ? '#ef4444' : '#6b7280'" size="18" />
        <text :class="{ liked: post.liked }">{{ post.likeCount }}</text>
      </view>
      <view class="action-item" @tap="handleComment">
        <wd-icon name="chat" color="#6b7280" size="18" />
        <text>{{ post.commentCount }}</text>
      </view>
      <view class="action-item" @tap="handleShare">
        <wd-icon name="share" color="#6b7280" size="18" />
        <text>分享</text>
      </view>
    </view>

    <!-- 删除确认弹窗 -->
    <wd-popup v-model="showDeleteDialog" position="bottom" :style="{ height: '30vh' }">
      <view class="delete-dialog">
        <view class="dialog-title">删除动态</view>
        <view class="dialog-content">
          <text>确定要删除这条动态吗？</text>
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
import { ref, computed } from 'vue';
import { useThemeStore } from '@/stores/theme';
import type { Post } from '@/types';

const props = defineProps<{
  post: Post;
}>();

const emit = defineEmits<{
  (e: 'delete', id: string): void;
  (e: 'like', id: string): void;
  (e: 'comment', id: string): void;
  (e: 'share', id: string): void;
}>();

const themeStore = useThemeStore();
const expanded = ref(false);
const showDeleteDialog = ref(false);

const truncatedContent = computed(() => {
  if (props.post.content.length <= 100) return props.post.content;
  return props.post.content.substring(0, 100) + '...';
});

const toggleExpand = () => {
  if (props.post.content.length > 100) {
    expanded.value = !expanded.value;
  }
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return date.toLocaleDateString('zh-CN');
};

const showDeleteConfirm = () => {
  showDeleteDialog.value = true;
};

const confirmDelete = () => {
  emit('delete', props.post.id);
  showDeleteDialog.value = false;
};

const handleLike = () => {
  emit('like', props.post.id);
};

const handleComment = () => {
  emit('comment', props.post.id);
};

const handleShare = () => {
  #ifdef MP-WEIXIN
  wx.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  });
  #endif
  emit('share', props.post.id);
};

const previewImage = () => {
  if (props.post.image) {
    uni.previewImage({
      urls: [props.post.image]
    });
  }
};
</script>

<style lang="scss" scoped>
.post-card {
  background: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
  padding: 24rpx;
  border: 1rpx solid #e5e7eb;
}

.dark .post-card {
  background: #1f2937;
  border-color: #374151;
}

/* 头部 */
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
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-weight: 600;
  color: #111827;
}

.dark .username {
  color: #f9fafb;
}

.post-time {
  font-size: 22rpx;
  color: #6b7280;
}

.dark .post-time {
  color: #9ca3af;
}

/* 内容 */
.post-content {
  margin-bottom: 16rpx;
  cursor: pointer;
}

.content-text {
  font-size: 28rpx;
  line-height: 1.6;
  color: #111827;
}

.dark .content-text {
  color: #f9fafb;
}

.content-text.collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.expand-text {
  font-size: 24rpx;
  color: #10b981;
  margin-top: 8rpx;
  display: inline-block;
}

/* 图片 */
.post-image {
  margin-bottom: 16rpx;
  border-radius: 8rpx;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 300rpx;
  border-radius: 8rpx;
}

/* 营养信息 */
.nutrition-info {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
  margin-bottom: 16rpx;
}

.nutrition-tag {
  background: #f0fdf4;
  padding: 8rpx 12rpx;
  border-radius: 8rpx;
  display: flex;
  gap: 8rpx;
  align-items: center;
}

.dark .nutrition-tag {
  background: #14532d;
}

.tag-label {
  font-size: 20rpx;
  color: #14532d;
  font-weight: 500;
}

.dark .tag-label {
  color: #86efac;
}

.tag-value {
  font-size: 20rpx;
  color: #166534;
  font-weight: 600;
}

.dark .tag-value {
  color: #4ade80;
}

/* 操作栏 */
.post-actions {
  display: flex;
  gap: 32rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #e5e7eb;
}

.dark .post-actions {
  border-color: #374151;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  cursor: pointer;
  color: #6b7280;
  font-size: 24rpx;
}

.dark .action-item {
  color: #9ca3af;
}

.action-item:active {
  opacity: 0.7;
}

.liked {
  color: #ef4444;
  font-weight: 600;
}

/* 删除弹窗 */
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