import { computed, ref } from 'vue'

export function useSystemInfo() {
  const statusBarHeight = ref(0)
  const navBarHeight = ref(44) // Default content height
  const windowWidth = ref(375)

  // #ifdef MP-WEIXIN || APP-PLUS || H5
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
  windowWidth.value = systemInfo.windowWidth || 375
  // #endif

  const menuButtonInfo = ref<UniApp.GetMenuButtonBoundingClientRectRes | null>(null)
  const capsuleRightOffset = ref(0)
  const capsuleWidth = ref(0)

  // #ifdef MP-WEIXIN
  const btnInfo = uni.getMenuButtonBoundingClientRect()
  menuButtonInfo.value = btnInfo
  capsuleRightOffset.value = windowWidth.value - btnInfo.left
  capsuleWidth.value = btnInfo.width
  // 内容区域高度 = (胶囊底部高度 - 状态栏高度) + (胶囊顶部高度 - 状态栏高度)
  navBarHeight.value = (btnInfo.top - statusBarHeight.value) * 2 + btnInfo.height
  // #endif

  const totalHeight = computed(() => statusBarHeight.value + navBarHeight.value)

  return {
    statusBarHeight,
    navBarHeight,
    totalHeight,
    windowWidth,
    menuButtonInfo,
    capsuleRightOffset,
    capsuleWidth,
  }
}
