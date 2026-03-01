import { computed, ref } from 'vue'

export function usePlatform() {
  const isMp = ref(false)
  const isWechat = ref(false)

  // #ifdef MP-WEIXIN
  isMp.value = true
  // #endif

  // #ifdef H5
  if (typeof window !== 'undefined') {
    const ua = window.navigator.userAgent.toLowerCase()
    isWechat.value = ua.includes('micromessenger')
  }
  // #endif

  // 是否腾讯系环境 (微信小程序或微信浏览器)
  const isTencentEnv = computed(() => isMp.value || isWechat.value)

  return {
    isMp,
    isWechat,
    isTencentEnv,
  }
}
