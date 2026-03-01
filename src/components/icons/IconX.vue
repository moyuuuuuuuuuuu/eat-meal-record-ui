<script setup lang="ts">
import IconBase from './IconBase.vue'

defineProps<{
  size?: number | string
  color?: string
}>()

const svgContent = ref(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>`)
</script>

<template>
  <IconBase :size="size" :color="color" :svg-content="svgContent" />
</template>
