<script setup lang="ts">
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import FeedMediaAttach from '@/components/FeedMediaAttach.vue'
import { useSystemInfo } from '@/composables/useSystemInfo'

const { fixedNavbarHeight } = useSystemInfo()

definePage({
  name: 'feed-detail',
  style: {
    navigationBarTitleText: '动态详情',
    navigationStyle: 'custom',
  },
})

const {
  data: detail,
  send: getDetail,
  loading,
  error,
} = useRequest(id => Apis.feed.detail({ params: { id } }), {
  immediate: false,
  initialData: null,
})

onLoad((options) => {
  if (options && options.id) {
    getDetail(options.id)
  }
})

function handleBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  }
  else {
    uni.reLaunch({ url: '/pages/index/index' })
  }
}

function previewImage(current: string) {
  if (!detail.value?.attach)
    return
  const urls = detail.value.attach
    .filter((a: any) => a.type === 0)
    .map((a: any) => a.attach)
  uni.previewImage({
    urls,
    current,
  })
}

function handleLike() {
  if (!detail.value)
    return
  useRequest(Apis.feed.like({ data: { id: detail.value.id } })).send().then((res) => {
    detail.value.is_like = res.isLike
    detail.value.likes = res.likes
  })
}

// #ifdef MP-WEIXIN
onShareAppMessage(() => {
  const post = detail.value
  if (!post) {
    return {
      title: '动态广场',
      path: '/pages/feed/index',
      imageUrl: 'https://bos.eatclear.moyuu.cn/wot-design-uni-assets/share.jpg',
    }
  }
  let imageUrl = 'https://bos.eatclear.moyuu.cn/wot-design-uni-assets/share.jpg'
  const firstAttach = post.attach?.find((item: any) => item.type === 0 || item.poster)
  if (firstAttach) {
    const sourceUrl = firstAttach.type === 0 ? firstAttach.attach : firstAttach.poster
    imageUrl = `${sourceUrl}?x-bce-process=style/share`
  }
  return {
    title: post.content.substring(0, 30) || '分享一条精彩动态',
    path: `/pages/feed-detail/index?id=${post.id}`,
    imageUrl,
  }
})

onShareTimeline(() => {
  const post = detail.value
  if (!post) {
    return {
      title: '动态广场',
      query: '',
      imageUrl: 'https://bos.eatclear.moyuu.cn/wot-design-uni-assets/share.jpg',
    }
  }
  let imageUrl = 'https://bos.eatclear.moyuu.cn/wot-design-uni-assets/share.jpg'
  const firstAttach = post.attach?.find((item: any) => item.type === 0 || item.poster)
  if (firstAttach) {
    const sourceUrl = firstAttach.type === 0 ? firstAttach.attach : firstAttach.poster
    imageUrl = `${sourceUrl}?x-bce-process=style/share`
  }
  return {
    title: post.content.substring(0, 30) || '分享一条精彩动态',
    query: `id=${post.id}`,
    imageUrl,
  }
})
// #endif
</script>

<template>
  <view class="page-container min-h-screen bg-[var(--page-bg)] pb-10">
    <wd-navbar title="动态详情" left-arrow safe-area-inset-top fixed @click-left="handleBack">
      <!-- #ifdef MP-WEIXIN -->
      <template #right>
        <button class="share-button" open-type="share" aria-label="分享动态">
          <IconShare2 size="20" color="var(--text-main)" />
        </button>
      </template>
      <!-- #endif -->
    </wd-navbar>

    <!-- 顶部占位 -->
    <view :style="{ height: `${fixedNavbarHeight}px` }" />

    <view v-if="loading" class="mt-20 flex flex-col items-center justify-center opacity-50">
      <wd-loading size="24px" />
      <text class="mt-2 text-xs">
        加载中...
      </text>
    </view>

    <view v-else-if="detail" class="detail-content animate-fade-in px-4 py-4">
      <!-- 作者信息 -->
      <view class="mb-4 flex items-center gap-3">
        <view class="h-12 w-12 overflow-hidden rounded-full ring-2 ring-emerald-500/20">
          <wd-img :width="50" :height="50" :src="detail.author?.avatar" mode="aspectFill" class="h-full w-full">
            <template #error>
              <view class="h-full w-full flex items-center justify-center bg-[var(--surface-subtle)]">
                加载失败
              </view>
            </template>
          </wd-img>
        </view>
        <view class="flex-1">
          <view class="text-base text-[var(--text-main)] font-semibold">
            {{ detail.author?.nickname || '匿名用户' }}
          </view>
          <view class="text-xs text-[var(--text-sub)]">
            发布于 {{ detail.created_at }}
          </view>
        </view>
      </view>

      <!-- 文字内容 -->
      <view class="mb-6 whitespace-pre-wrap text-[15px] text-[var(--text-main)] leading-relaxed">
        {{ detail.content }}
      </view>

      <!-- 媒体内容 -->
      <FeedMediaAttach
        :attach="detail.attach"
        variant="detail"
        @preview-image="previewImage"
      />

      <!-- 话题标签 -->
      <view v-if="detail.topics && detail.topics.length" class="mb-6 flex flex-wrap gap-2">
        <text v-for="topic in detail.topics" :key="topic.id" class="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-600 font-medium">
          #{{ topic.title }}
        </text>
      </view>

      <!-- 位置信息 -->
      <view v-if="detail.location" class="mb-6 flex items-center gap-2 rounded-lg bg-[var(--card-bg)] p-3">
        <view class="h-8 w-8 flex items-center justify-center rounded-full bg-[var(--surface-subtle)]">
          <IconMapPin size="16" color="#6b7280" />
        </view>
        <view class="flex-1 overflow-hidden">
          <view class="truncate text-sm text-[var(--text-main)] font-medium">
            {{ detail.location.name }}
          </view>
          <view class="truncate text-[11px] text-[var(--text-sub)]">
            {{ detail.location.address }}
          </view>
        </view>
      </view>

      <!-- 互动统计 -->
      <view class="mb-6 flex items-center gap-6 border-y border-[var(--border-color)] py-4">
        <view class="flex items-center gap-1.5" @click="handleLike">
          <IconHeart :color="detail.is_like ? '#ef4444' : '#6b7280'" size="20" />
          <text class="text-sm font-medium" :class="detail.is_like ? 'text-[#ef4444]' : 'text-[var(--text-sub)]'">
            {{ detail.likes }}
          </text>
        </view>
        <view class="flex items-center gap-1.5">
          <IconMessageCircle color="#6b7280" size="20" />
          <text class="text-sm text-[var(--text-sub)] font-medium">
            {{ detail.comments }}
          </text>
        </view>
        <view class="flex items-center gap-1.5">
          <IconEye color="#6b7280" size="20" />
          <text class="text-sm text-[var(--text-sub)] font-medium">
            {{ detail.views }}
          </text>
        </view>
      </view>

      <!-- 评论列表占位 -->
      <!-- <view class="comments-section">
        <view class="mb-4 text-sm text-[var(--text-main)] font-bold">
          评论 ({{ detail.comment_list?.length || 0 }})
        </view>
        <view v-if="!detail.comment_list || detail.comment_list.length === 0" class="py-10 text-center text-xs text-[var(--text-sub)]">
          暂无评论，快来抢沙发吧~
        </view>
      </view> -->
    </view>

    <view v-else-if="error" class="mt-20 flex flex-col items-center justify-center opacity-50">
      <text class="text-sm">
        加载详情失败
      </text>
      <wd-button size="small" type="info" plain class="mt-4" @click="getDetail">
        重新加载
      </wd-button>
    </view>
  </view>
</template>

<style scoped>
.page-container {
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

.share-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  line-height: 1;
}

.share-button::after {
  border: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
