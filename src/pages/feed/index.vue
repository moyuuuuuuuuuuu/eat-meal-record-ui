<script setup lang="ts">
import { onPullDownRefresh, onReachBottom, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { usePagination, useRequest } from 'alova/client'
import { computed, inject, onUnmounted, ref } from 'vue'
import { usePlatform } from '@/composables/usePlatform'
import { useSystemInfo } from '@/composables/useSystemInfo'

const { statusBarHeight, navBarHeight } = useSystemInfo()
const { isMp, isWechat, isTencentEnv } = usePlatform()

definePage({
  name: 'feed',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '动态广场',
    navigationStyle: 'custom',
  },
})

const loadingProps = inject('globalLoadingProps')
// 使用 usePagination 处理分页请求
const {
  loading,
  data: posts,
  isLastPage,
  page,
} = usePagination(
  (page, pageSize) => Apis.feed.list({ params: { page, pageSize } }),
  {
    initialData: {
      total: 0,
      data: [],
    },
    // 将 API 返回的 PaginatedResponse 映射到 usePagination 要求的结构
    data: res => res.data,
    total: res => res.total,
    initialPageSize: 6,
    append: true,
  },
)

const hasReachedBottom = ref(false)

const showSkeleton = computed(() => {
  return loading.value && page.value === 1 && posts.value.length === 0
})

// 下拉刷新
onPullDownRefresh(async () => {
  page.value = 1
  hasReachedBottom.value = false
  uni.stopPullDownRefresh()
})

// 监听发布动态成功的事件，自动刷新列表
uni.$on('refresh-feed', () => {
  page.value = 1
  hasReachedBottom.value = false
})

// 组件卸载时移除监听
onUnmounted(() => {
  uni.$off('refresh-feed')
})

// 上拉加载更多
onReachBottom(() => {
  hasReachedBottom.value = true
  if (!isLastPage.value && !loading.value) {
    page.value++
  }
})

function handleLike(post: any) {
  if (post) {
    const id = post.id
    useRequest(Apis.feed.like({ data: { id } })).send().then((res) => {
      post.is_like = res.isLike
      post.likes = res.likes
    })
  }
}

function handleCreatePost() {
  uni.navigateTo({ url: '/pages/create-post/index' })
}

function previewImage(post: any, current: string) {
  const urls = post.attach
    .filter((a: any) => a.type === 0)
    .map((a: any) => a.attach)
  uni.previewImage({
    urls,
    current,
  })
}

function handleShare(_post: any) {
  if (isMp.value) {
    // 小程序端由于是点击按钮触发，不需要手动逻辑，由 onShareAppMessage 承接
    return
  }
  if (isWechat.value) {
    uni.showModal({
      title: '分享提示',
      content: '请点击右上角菜单进行分享',
      showCancel: false,
    })
  }
}

function goToDetail(id: number | string) {
  uni.navigateTo({
    url: `/pages/feed-detail/index?id=${id}`,
  })
}

// 微信小程序分享逻辑
// #ifdef MP-WEIXIN
onShareAppMessage((res) => {
  if (res.from === 'button') {
    const post = res.target?.dataset?.post
    if (post) {
      return {
        title: post.content.substring(0, 30) || '分享一条精彩动态',
        path: `/pages/feed-detail/index?id=${post.id}`,
      }
    }
  }
  return {
    title: '动态广场',
    path: '/pages/feed/index',
  }
})

onShareTimeline(() => {
  return {
    title: '动态广场',
    path: '/pages/feed/index',
  }
})
// #endif
</script>

<template>
  <view class="page-container min-h-screen bg-[var(--page-bg)] pb-20">
    <view class="header-container fixed left-0 top-0 z-10 w-full bg-[var(--page-bg)]">
      <wd-navbar title="动态广场" safe-area-inset-top />
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

    <!-- 顶部占位 (navbar + search area) -->
    <view :style="{ height: `${statusBarHeight + navBarHeight + 52.5}px` }" />

    <!-- 动态列表 -->
    <view class="posts-list mt-4 pb-20 space-y-2">
      <!-- 第一页加载且为空时显示骨架屏 -->
      <template v-if="showSkeleton">
        <view v-for="i in 3" :key="i" class="bg-[var(--card-bg)] px-4 py-4">
          <wd-skeleton title avatar :row="3" loading />
        </view>
      </template>

      <template v-else>
        <view v-for="post in posts" :key="post.id" class="post-card bg-[var(--card-bg)] px-4 py-4" @click="goToDetail(post.id)">
          <!-- 作者信息 -->
          <view class="mb-3 flex items-center gap-3">
            <view class="h-10 w-10 flex items-center justify-center rounded-full from-emerald-400 to-teal-500 bg-gradient-to-br">
              <IconUser size="20" color="white" />
            </view>
            <view class="flex-1">
              <view class="text-[var(--text-main)] font-medium">
                {{ post.author?.nickname || '匿名用户' }}
              </view>
              <view class="text-xs text-[var(--text-sub)]">
                {{ post.created_at }}
              </view>
            </view>
          </view>

          <!-- 文字内容 -->
          <view class="mb-3 text-sm text-[var(--text-main)] leading-relaxed">
            {{ post.content }}
          </view>

          <!-- 媒体内容 -->
          <view v-if="post.attach && post.attach.length" class="mb-3 flex flex-wrap gap-2">
            <template v-for="(item, index) in post.attach" :key="index">
              <!-- 图片 (type 0) -->
              <view v-if="item.type === 0" class="h-24 w-24 overflow-hidden rounded-lg">
                <wd-img
                  :src="item.attach"
                  mode="aspectFill"
                  class="h-full w-full"
                  @click.stop="previewImage(post, item.attach)"
                >
                  <template #error>
                    <view class="h-full w-full flex items-center justify-center bg-gray-100 text-[10px] text-gray-400">
                      加载失败
                    </view>
                  </template>
                  <template #loading>
                    <view class="h-full w-full flex items-center justify-center bg-gray-50">
                      <wd-loading size="16px" />
                    </view>
                  </template>
                </wd-img>
              </view>
              <!-- 视频 (type 1) -->
              <view v-else-if="item.type === 1" class="h-24 w-40 overflow-hidden rounded-lg">
                <video
                  :src="item.attach"
                  :poster="item.poster"
                  class="h-full w-full"
                  :controls="true"
                  @click.stop
                />
              </view>
              <!-- 餐食记录 (type 4) -->
              <view v-else-if="item.type === 4" class="w-full border border-emerald-500/10 rounded-xl bg-emerald-500/5 p-3.5 shadow-sm">
                <view class="mb-1 flex items-center justify-between">
                  <view class="flex items-center gap-1">
                    <view class="h-4 w-4 flex items-center justify-center rounded bg-emerald-500">
                      <text class="text-[8px] text-white">
                        餐
                      </text>
                    </view>
                    <text class="text-xs text-[var(--text-main)] font-medium">
                      {{ item.attach.type }}
                    </text>
                  </view>
                  <text class="text-xs text-emerald-600">
                    {{ item.attach.calories }} kcal
                  </text>
                </view>
                <view class="flex flex-wrap gap-1">
                  <text
                    v-for="(food, idx) in item.attach.foods"
                    :key="idx"
                    class="text-[10px] text-[var(--text-sub)]"
                  >
                    {{ food }}{{ Number(idx) < item.attach.foods.length - 1 ? '、' : '' }}
                  </text>
                </view>
              </view>
            </template>
          </view>

          <!-- 话题标签 -->
          <view v-if="post.topics && post.topics.length" class="mb-3 flex flex-wrap gap-2">
            <text v-for="topic in post.topics" :key="topic.id" class="text-xs text-emerald-600 font-medium">
              #{{ topic.title }}
            </text>
          </view>

          <!-- 位置信息 -->
          <view v-if="post.location" class="mb-3 flex items-center gap-1">
            <IconMapPin size="10" color="#9ca3af" />
            <text class="text-[10px] text-[var(--text-sub)]">
              {{ post.location.name || post.location.address || '未知位置' }}
            </text>
          </view>

          <!-- 互动按钮 -->
          <view class="flex items-center gap-6 border-t border-[var(--border-color)] pt-3">
            <view class="flex items-center gap-1" @click.stop="handleLike(post)">
              <IconHeart :color="post.is_like ? '#ef4444' : '#6b7280'" size="18" />
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
            <view v-if="isTencentEnv" class="ml-auto" @click.stop="handleShare(post)">
              <button
                v-if="isMp"
                open-type="share"
                :data-post="post"
                class="share-btn flex items-center justify-center bg-transparent p-0 leading-none"
              >
                <IconShare2 color="#6b7280" size="18" />
              </button>
              <view v-else class="flex items-center justify-center">
                <IconShare2 color="#6b7280" size="18" />
              </view>
            </view>
          </view>
        </view>
      </template>

      <!-- 加载更多 -->
      <wd-loadmore
        v-if="!showSkeleton && hasReachedBottom"
        :state="(isLastPage ? 'finished' : (loading ? 'loading' : 'ready')) as any"
        finished-text="我是有底线的"
        loading-text="加载中"
        :loading-props="loadingProps as any"
      />
    </view>

    <!-- 悬浮发布按钮 -->
    <view
      class="fixed bottom-24 right-6 h-14 w-14 flex items-center justify-center rounded-full from-emerald-500 to-teal-500 bg-gradient-to-r shadow-lg"
      @click="handleCreatePost"
    >
      <IconPlus size="24" color="white" />
    </view>
  </view>
</template>

<style scoped>
.page-container {
  padding-bottom: env(safe-area-inset-bottom);
}
.share-btn::after {
  border: none;
}
</style>
