<script setup lang="ts">
import IconBase from './IconBase.vue'

defineProps<{
  size?: number | string
  color?: string
}>()

// 提取出纯 SVG 路径部分，注意要把 stroke="currentColor" 准备好
const svgContent = ref(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>`)
</script>

<template>
  <IconBase :size="size" :color="color" :svg-content="svgContent" />
</template>
