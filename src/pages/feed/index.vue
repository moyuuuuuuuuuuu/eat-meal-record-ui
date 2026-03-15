<script setup lang="ts">
import { onPageScroll, onPullDownRefresh, onReachBottom, onShareAppMessage, onShareTimeline, onShow } from '@dcloudio/uni-app'
import { usePagination, useRequest } from 'alova/client'
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import FeedMediaAttach from '@/components/FeedMediaAttach.vue'
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
    enablePullDownRefresh: true,
  },
})

const loadingProps = inject('globalLoadingProps')
const {
  loading,
  data: posts,
  isLastPage,
  page,
  reload,
} = usePagination(
  (page, pageSize) => Apis.feed.list({ params: { page, pageSize } }),
  {
    initialData: { total: 0, data: [] },
    data: res => res.data,
    total: res => res.total,
    initialPageSize: 6,
    append: true,
  },
)

const hasReachedBottom = ref(false)
const scrollTop = ref(0)
const showBackTop = computed(() => scrollTop.value > 400)

const showSkeleton = computed(() => {
  return loading.value && page.value === 1 && posts.value.length === 0
})

// 封装刷新：reset 状态后必须调用 reload() 才能触发 alova 重新请求
// 单纯改 page.value = 1 不会发起请求
function refreshList() {
  hasReachedBottom.value = false
  page.value = 1
  reload()
}

onPullDownRefresh(async () => {
  refreshList()
  // 等待本次请求完成后再停止下拉动画
  await new Promise<void>((resolve) => {
    const stop = watch(loading, (val) => {
      if (!val) {
        stop()
        resolve()
      }
    })
  })
  uni.stopPullDownRefresh()
})

// needRefresh 标记：create-post emit 时写入，onShow 时消费
// $on/$off 配对写在生命周期里，避免重复注册
const needRefresh = ref(false)
onMounted(() => {
  // eslint-disable-next-line style/max-statements-per-line
  uni.$on('refresh-feed', () => { needRefresh.value = true })
})
onUnmounted(() => {
  uni.$off('refresh-feed')
})

onShow(() => {
  if (needRefresh.value) {
    needRefresh.value = false
    refreshList()
  }
})

onReachBottom(() => {
  hasReachedBottom.value = true
  if (!isLastPage.value && !loading.value) {
    page.value++
  }
})

onPageScroll(({ scrollTop: top }) => {
  scrollTop.value = top
})

function scrollToTop() {
  uni.pageScrollTo({ scrollTop: 0, duration: 300 })
}

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
  uni.previewImage({ urls, current })
}

function handleShare(_post: any) {
  if (isMp.value)
    return
  if (isWechat.value) {
    uni.showModal({
      title: '分享提示',
      content: '请点击右上角菜单进行分享',
      showCancel: false,
    })
  }
}

function goToDetail(id: number | string) {
  uni.navigateTo({ url: `/pages/feed-detail/index?id=${id}` })
}

// #ifdef MP-WEIXIN
onShareAppMessage((res) => {
  if (res.from === 'button') {
    const post = res.target?.dataset?.post
    if (post) {
      let imageUrl = 'https://bos.eatclear.moyuu.cn/wot-design-uni-assets/share.jpg'
      const firstAttach = post.attach?.find((item: any) => item.type === 0 || item.poster)
      if (firstAttach) {
        const sourceUrl = firstAttach.type === 0 ? firstAttach.attach : firstAttach.poster
        imageUrl = `${sourceUrl}?x-bce-process=image/style/share`
      }
      return {
        title: post.content.substring(0, 30) || '分享一条精彩动态',
        path: `/pages/feed-detail/index?id=${post.id}`,
        imageUrl,
      }
    }
  }
  return { title: '动态广场', path: '/pages/feed/index', imageUrl: 'https://bos.eatclear.moyuu.cn/wot-design-uni-assets/share.jpg' }
})

onShareTimeline(() => {
  return { title: '动态广场', path: '/pages/feed/index', imageUrl: 'https://bos.eatclear.moyuu.cn/wot-design-uni-assets/share.jpg' }
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

    <view :style="{ height: `${statusBarHeight + navBarHeight + 52.5}px` }" />

    <view class="posts-list mt-6 pb-20 space-y-2">
      <template v-if="showSkeleton">
        <view v-for="i in 3" :key="i" class="bg-[var(--card-bg)] px-4 py-4">
          <wd-skeleton title avatar :row="3" loading />
        </view>
      </template>
      <template v-else-if="posts.length <= 0">
        <view class="flex flex-col items-center justify-center py-20">
          <wd-status-tip
            image="content"
            tip="广场空空如也，快去分享第一条动态吧"
          />
          <view class="mt-4">
            <wd-button
              size="small"
              plain
              type="success"
              custom-class="!rounded-full"
              @click="handleCreatePost"
            >
              去发布
            </wd-button>
          </view>
        </view>
      </template>
      <template v-else>
        <view
          v-for="post in posts" :key="post.id" class="post-card bg-[var(--card-bg)] px-4 py-4"
          @click="goToDetail(post.id)"
        >
          <!-- 作者信息 -->
          <view class="mb-3 flex items-center gap-3">
            <view
              class="h-10 w-10 flex items-center justify-center rounded-full from-emerald-400 to-teal-500 bg-gradient-to-br"
            >
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
          <FeedMediaAttach
            :attach="post.attach"
            variant="list"
            @preview-image="(src) => previewImage(post, src)"
          />

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
              {{
                post.location.name || post.location.address || '未知位置'
              }}
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
                v-if="isMp" open-type="share" :data-post="post"
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

      <wd-loadmore
        v-if="!showSkeleton && hasReachedBottom"
        :state="(isLastPage ? 'finished' : (loading ? 'loading' : 'ready')) as any"
        finished-text="我是有底线的"
        loading-text="加载中"
        :loading-props="loadingProps as any"
      />
    </view>

    <view
      v-if="showBackTop"
      class="fixed bottom-24 right-6 h-14 w-14 flex items-center justify-center rounded-full from-emerald-500 to-teal-500 bg-gradient-to-r shadow-lg transition-opacity duration-300"
      @click="scrollToTop"
    >
      <IconArrowUp size="24" color="white" />
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
