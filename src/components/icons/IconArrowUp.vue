<script setup lang="ts">
import { ref } from 'vue'
import IconBase from './IconBase.vue'

defineProps<{
  size?: number | string
  color?: string
}>()

// 向上箭头的 SVG 路径
const svgContent = ref(`
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="m18 15-6-6-6 6"/>
</svg>`)
</script>

<template>
  <IconBase :size="size" :color="color" :svg-content="svgContent" />
</template>
