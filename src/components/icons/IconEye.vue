<script setup lang="ts">
import { ref } from 'vue'
import IconBase from './IconBase.vue'

defineProps<{
  size?: number | string
  color?: string
}>()

const svgContent = ref(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>`)
</script>

<template>
  <IconBase :size="size" :color="color" :svg-content="svgContent" />
</template>
