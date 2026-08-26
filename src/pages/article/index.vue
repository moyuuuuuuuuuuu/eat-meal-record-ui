<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { useSystemInfo } from '@/composables/useSystemInfo'

const { fixedNavbarHeight } = useSystemInfo()

definePage({
  name: 'article',
  style: {
    navigationBarTitleText: '文章详情',
    navigationStyle: 'custom',
  },
})
// 定义接口返回的数据结构
interface DetailData {
  title: string
  content: string // 后端返回的富文本字符串
  created_at: string
}

const articleId = ref<string>('')
const articleType = ref<string>()
const detail = ref<DetailData | null>(null)

// 1. 定义接口请求 (假设已在 Apis 中定义了 getArticleDetail)
const { send: fetchDetail, loading } = useRequest(
  (id, type) => Apis.article.info({ params: { id, type } }),
  { immediate: false },
)

onLoad(async (options) => {
  if (options?.id || options?.type) {
    articleId.value = options.id
    articleType.value = options.type
    const res = await fetchDetail(options.id, options.type)
    if (res) {
      // 处理富文本中的图片样式，防止撑破屏幕
      res.content = formatRichText(res.content)
      detail.value = res
      uni.setNavigationBarTitle({
        title: res.title || (options.type === 'notice' ? '公告详情' : '协议详情'),
      })
    }
  }
})
function handleBack() {
  uni.navigateBack()
}
/**
 * 格式化富文本：为 img 标签添加 max-width 防止图片溢出
 */
function formatRichText(html: string) {
  if (!html)
    return ''
  return html
    .replace(/<img[^>]*>/gi, (match) => {
      return match.replace(/style\s*=\s*["'][^"']*["']/gi, '').replace(/>/g, ' style="max-width:100%;height:auto;display:block;">')
    })
    .replace(/<section/g, '<div')
    .replace(/\/section>/g, '/div>')
}
</script>

<template>
  <view class="page-container min-h-screen bg-[var(--page-bg)] pb-10">
    <wd-navbar :title="detail.title" left-arrow safe-area-inset-top fixed @click-left="handleBack" />

    <!-- 顶部占位 -->
    <view :style="{ height: `${fixedNavbarHeight}px` }" />

    <view v-if="loading" class="flex justify-center">
      <wd-loading />
    </view>

    <view v-else-if="detail" class="content-container p-4">
      <view class="meta mb-6 text-xs text-gray-400">
        发布时间：{{ detail.created_at }}
      </view>

      <view class="rich-text-wrapper text-[var(--text-main)]">
        <rich-text :nodes="detail.content" />
      </view>

      <view class="h-10" />
    </view>

    <view v-else class="pt-40">
      <wd-status-tip image="content" desc="暂无内容" />
    </view>
  </view>
</template>

<style scoped>
.rich-text-wrapper {
  line-height: 1.6;
  color: #333;
  font-size: 28rpx;
  word-break: break-all;
}

/* 微信富文本内全局样式修正 */
:deep(.rich-text-wrapper img) {
  max-width: 100% !important;
  height: auto !important;
}
@media (prefers-color-scheme: dark) {
  .page-container {
    --text-rich: #d1d5db; /* 深色模式下的高亮色 */
  }
}

.rich-text-wrapper {
  color: var(--text-rich);
}

/* 核心：强制覆盖富文本内的行内颜色 */
:deep(.rich-text-wrapper) ._span,
:deep(.rich-text-wrapper) ._p,
:deep(.rich-text-wrapper) ._div,
:deep(.rich-text-wrapper) ._font {
  /* 使用 initial 或 inherit 视情况而定，这里建议强制继承父级变量 */
  color: inherit !important;
}
</style>
