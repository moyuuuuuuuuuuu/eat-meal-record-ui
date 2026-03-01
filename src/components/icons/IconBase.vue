<script setup lang="ts">
import { computed } from 'vue'
import { useManualTheme } from '@/composables/useManualTheme'

const props = withDefaults(defineProps<{
  size?: number | string
  color?: string
  svgContent?: string
}>(), {
  size: 24,
})

const { isDark } = useManualTheme()

const finalColor = computed(() => {
  if (props.color)
    return props.color
  return isDark.value ? '#ffffff' : '#000000'
})

const sizeStyle = computed(() => {
  const s = /^\d+$/.test(String(props.size)) ? `${props.size}px` : props.size
  return {
    width: s,
    height: s,
    minWidth: s,
    minHeight: s,
  }
})

const svgDataUri = computed(() => {
  if (!props.svgContent)
    return ''

  const svg = props.svgContent
    .replace(/stroke=(['"])(?:white|black|currentColor|#000000|#ffffff)\1/g, `stroke='${finalColor.value}'`)
    .replace(/fill=(['"])(?:white|black|currentColor|#000000|#ffffff)\1/g, `fill='${finalColor.value}'`)
    .replace(/\n/g, ' ')

  // 小程序不支持 charset=utf-8 的 data URI，需要 base64
  // #ifdef MP-WEIXIN
  return `data:image/svg+xml;base64,${uni.arrayBufferToBase64(new TextEncoder().encode(svg))}`
  // #endif

  // #ifndef MP-WEIXIN
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  // #endif
})
</script>

<script lang="ts">
export default {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
}
</script>

<template>
  <image
    class="icon-base"
    :src="svgDataUri"
    :style="sizeStyle"
    mode="aspectFit"
  />
</template>

<style scoped>
.icon-base {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  line-height: 0;
}
</style>
