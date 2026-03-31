<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { isSameMainDomain } from '@/utils'

definePage({
  name: 'webview',
  style: {
    navigationBarTitleText: '加载中...',
  },
})

const url = ref<string>('')
const title = ref<string>('')

const { token } = useAuth()
const { theme } = useTheme()
onLoad((options) => {
  if (options?.url) {
    let finalUrl = decodeURIComponent(options.url)
    const baseUrl = import.meta.env.VITE_API_BASE_URL as string
    // 判断是否属于同一主域名
    if (baseUrl && isSameMainDomain(finalUrl, baseUrl)) {
      if (token.value) {
        const separator = finalUrl.includes('?') ? '&' : '?'
        finalUrl = `${finalUrl}${separator}token=${token.value}`
      }
      if (theme.value) {
        const separator = finalUrl.includes('?') ? '&' : '?'
        finalUrl = `${finalUrl}${separator}theme=${theme.value}`
      }
    }
    url.value = finalUrl
  }
  if (options?.title) {
    title.value = decodeURIComponent(options.title)
    uni.setNavigationBarTitle({
      title: title.value,
    })
  }
})
</script>

<template>
  <view class="webview-container">
    <web-view v-if="url" :src="url" />
    <view v-else class="flex flex-col items-center justify-center pt-40">
      <wd-status-tip image="content" desc="无效的链接地址" />
    </view>
  </view>
</template>

<style scoped>
.webview-container {
  width: 100%;
  height: 100vh;
}
</style>
