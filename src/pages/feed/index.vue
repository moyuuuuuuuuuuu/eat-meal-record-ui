<route lang="json">
{
  "name": "feed",
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "动态广场"
  }
}
</route>

<template>
  <view class="page-container bg-[var(--page-bg)] min-h-screen pb-20">
    <wd-navbar title="动态广场" fixed placeholder />
    
    <!-- 发布按钮区域 -->
    <view class="bg-[var(--card-bg)] px-4 py-3 border-b border-[var(--border-color)] mb-2">
      <view class="flex items-center gap-3 bg-[var(--page-bg)] rounded-lg px-4 py-2" @click="handleCreatePost">
        <view class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
          <IconUser size="16" color="white" />
        </view>
        <text class="text-[var(--text-sub)] text-sm">分享你的饮食心得...</text>
        <view class="ml-auto flex items-center gap-2">
          <IconImage size="20" color="#9ca3af" />
          <IconVideo size="20" color="#9ca3af" />
        </view>
      </view>
    </view>

    <!-- 动态列表 -->
    <view class="posts-list space-y-2">
      <view v-for="post in posts" :key="post.id" class="bg-[var(--card-bg)] px-4 py-4">
        <!-- 作者信息 -->
        <view class="flex items-center gap-3 mb-3">
          <view class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <IconUser size="20" color="white" />
          </view>
          <view class="flex-1">
            <view class="text-[var(--text-main)] font-medium">{{ post.author.name }}</view>
            <view class="text-xs text-[var(--text-sub)]">{{ post.timestamp }}</view>
          </view>
        </view>

        <!-- 文字内容 -->
        <view class="text-[var(--text-main)] mb-3 leading-relaxed text-sm">{{ post.content }}</view>

        <!-- 话题标签 -->
        <view v-if="post.topics && post.topics.length" class="flex flex-wrap gap-2 mb-3">
          <text v-for="topic in post.topics" :key="topic" class="text-emerald-600 text-xs font-medium">
            {{ topic }}
          </text>
        </view>

        <!-- 餐食引用 (简化版) -->
        <view v-if="post.mealReference" class="bg-emerald-50/10 rounded-lg p-3 border border-emerald-100/20 mb-3">
          <view class="flex items-center justify-between mb-1">
            <view class="flex items-center gap-1">
              <view class="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center">
                <text class="text-white text-[8px]">餐</text>
              </view>
              <text class="text-xs text-[var(--text-main)] font-medium">{{ post.mealReference.mealType }}</text>
            </view>
            <text class="text-xs text-emerald-600">{{ post.mealReference.totalCalories }} kcal</text>
          </view>
        </view>

        <!-- 互动按钮 -->
        <view class="flex items-center gap-6 pt-3 border-t border-[var(--border-color)]">
          <view class="flex items-center gap-1" @click="handleLike(post.id)">
            <IconHeart :color="post.isLiked ? '#ef4444' : '#6b7280'" size="18" />
            <text class="text-xs text-[var(--text-sub)]">{{ post.likes }}</text>
          </view>
          <view class="flex items-center gap-1">
            <IconMessageCircle color="#6b7280" size="18" />
            <text class="text-xs text-[var(--text-sub)]">{{ post.comments }}</text>
          </view>
          <view class="ml-auto">
            <IconShare2 color="#6b7280" size="18" />
          </view>
        </view>
      </view>
    </view>

    <!-- 悬浮发布按钮 -->
    <view class="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg flex items-center justify-center" @click="handleCreatePost">
      <IconPlus size="24" color="white" />
    </view>
  </view>
</template>

<script setup lang="ts">
const posts = ref([
  {
    id: '1',
    author: { name: '健康小达人' },
    content: '今天的午餐太满足了！鸡胸肉配糙米饭，营养又美味 💪',
    topics: ['#健康饮食', '#减脂餐'],
    mealReference: {
      mealType: '午餐',
      totalCalories: 379,
    },
    likes: 24,
    comments: 5,
    timestamp: '2小时前',
    isLiked: false,
  },
  {
    id: '2',
    author: { name: '营养达人' },
    content: '今天的饮食记录分享！从早餐到晚餐都很营养均衡，总摄入1850大卡，完美控制在目标范围内！💯',
    topics: ['#全天打卡', '#健康饮食'],
    mealReference: {
      mealType: '全天',
      totalCalories: 1850,
    },
    likes: 142,
    comments: 28,
    timestamp: '3小时前',
    isLiked: true,
  }
])

function handleLike(id: string) {
  const post = posts.value.find(p => p.id === id)
  if (post) {
    post.isLiked = !post.isLiked
    post.likes += post.isLiked ? 1 : -1
  }
}

function handleCreatePost() {
  uni.navigateTo({ url: '/pages/create-post/index' })
}
</script>

<style scoped>
.page-container {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
