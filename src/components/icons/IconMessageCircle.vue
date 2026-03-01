<script setup lang="ts">
import IconBase from './IconBase.vue'

defineProps<{
  size?: number | string
  color?: string
}>()

const svgContent = ref(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z" /></svg>`)
</script>

<template>
  <IconBase :size="size" :color="color" :svg-content="svgContent" />
</template>
