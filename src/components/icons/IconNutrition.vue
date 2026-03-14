<script setup lang="ts">
import { ref } from 'vue'
import IconBase from './IconBase.vue'

defineProps<{
  size?: number | string
  // 默认使用 Amber 600 的颜色 #D97706
  color?: string
}>()

const svgContent = ref(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 21h18" />
  <path d="M7 16V6" />
  <path d="M12 16V10" />
  <path d="M17 16V13" />
  <circle cx="12" cy="12" r="9" style="opacity: 0.15" />
</svg>`)
</script>

<template>
  <IconBase :size="size" :color="color" :svg-content="svgContent" />
</template>
