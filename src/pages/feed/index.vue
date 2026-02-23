
<script setup lang="ts">
definePage({
  name: 'feed',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '动态广场',
    navigationStyle: 'custom',
  },
})
import { useRequest } from 'alova/client'

const { data: posts } = useRequest(Apis.feed.getPosts(), {
  initialData: [],
})

function handleLike(id: string) {
  if (!posts.value)
    return
  const post = posts.value.find(p => p.id === id)
  if (post) {
    Apis.feed.likePost({ data: { id } }).send().then((res) => {
      post.isLiked = res.isLiked
      post.likes = res.likes
    })
  }
}

function handleCreatePost() {
  uni.navigateTo({ url: '/pages/create-post/index' })
}
</script>

<template>
  <view class="page-container min-h-screen bg-[var(--page-bg)] pb-20">
    <view class="header-container fixed left-0 top-0 z-10 w-full bg-[var(--page-bg)]">
      <wd-navbar title="动态广场" />
      <view class="border-b border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2">
        <view class="flex items-center gap-3 rounded-xl bg-[var(--page-bg)] px-4 py-2" @click="handleCreatePost">
          <view class="h-8 w-8 flex items-center justify-center rounded-full bg-emerald-500">
            <IconUser size="16" color="white" />
          </view>
          <text class="text-sm text-[var(--text-sub)]">
            分享你的饮食心得...
          </text>
          <view class="ml-auto flex items-center gap-2">
            <IconImage size="18" color="#9ca3af" />
            <IconVideo size="18" color="#9ca3af" />
          </view>
        </view>
      </view>
    </view>

    <!-- 顶部占位 (navbar 44px + area ~52px + gap) -->
    <view class="h-[120px]" />

    <!-- 动态列表 -->
    <view class="posts-list mt-4 space-y-2">
      <view v-for="post in posts" :key="post.id" class="bg-[var(--card-bg)] px-4 py-4">
        <!-- 作者信息 -->
        <view class="mb-3 flex items-center gap-3">
          <view class="h-10 w-10 flex items-center justify-center rounded-full from-emerald-400 to-teal-500 bg-gradient-to-br">
            <IconUser size="20" color="white" />
          </view>
          <view class="flex-1">
            <view class="text-[var(--text-main)] font-medium">
              {{ post.author.name }}
            </view>
            <view class="text-xs text-[var(--text-sub)]">
              {{ post.timestamp }}
            </view>
          </view>
        </view>

        <!-- 文字内容 -->
        <view class="mb-3 text-sm text-[var(--text-main)] leading-relaxed">
          {{ post.content }}
        </view>

        <!-- 话题标签 -->
        <view v-if="post.topics && post.topics.length" class="mb-3 flex flex-wrap gap-2">
          <text v-for="topic in post.topics" :key="topic" class="text-xs text-emerald-600 font-medium">
            {{ topic }}
          </text>
        </view>

        <!-- 餐食引用 (简化版) -->
        <view v-if="post.mealReference" class="mb-3 border border-emerald-100/20 rounded-lg bg-emerald-50/10 p-3">
          <view class="mb-1 flex items-center justify-between">
            <view class="flex items-center gap-1">
              <view class="h-4 w-4 flex items-center justify-center rounded bg-emerald-500">
                <text class="text-[8px] text-white">
                  餐
                </text>
              </view>
              <text class="text-xs text-[var(--text-main)] font-medium">
                {{ post.mealReference.mealType }}
              </text>
            </view>
            <text class="text-xs text-emerald-600">
              {{ post.mealReference.totalCalories }} kcal
            </text>
          </view>
        </view>

        <!-- 互动按钮 -->
        <view class="flex items-center gap-6 border-t border-[var(--border-color)] pt-3">
          <view class="flex items-center gap-1" @click="handleLike(post.id)">
            <IconHeart :color="post.isLiked ? '#ef4444' : '#6b7280'" size="18" />
            <text class="text-xs text-[var(--text-sub)]">
              {{ post.likes }}
            </text>
          </view>
          <view class="flex items-center gap-1">
            <IconMessageCircle color="#6b7280" size="18" />
            <text class="text-xs text-[var(--text-sub)]">
              {{ post.comments }}
            </text>
          </view>
          <view class="ml-auto">
            <IconShare2 color="#6b7280" size="18" />
          </view>
        </view>
      </view>
    </view>

    <!-- 悬浮发布按钮 -->
    <view class="fixed bottom-24 right-6 h-14 w-14 flex items-center justify-center rounded-full from-emerald-500 to-teal-500 bg-gradient-to-r shadow-lg" @click="handleCreatePost">
      <IconPlus size="24" color="white" />
    </view>
  </view>
</template>

<style scoped>
.page-container {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
