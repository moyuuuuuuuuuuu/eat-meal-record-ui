<template>
  <IconBase :size="size" :color="color">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="13.5" cy="6.5" r=".5"></circle>
      <circle cx="17.5" cy="10.5" r=".5"></circle>
      <circle cx="8.5" cy="7.5" r=".5"></circle>
      <circle cx="6.5" cy="12.5" r=".5"></circle>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.607-.48 2.301-1.307 1.162-1.382 2.77-1.2 4.015-1.168.155.004.312.006.467.006 1.776 0 3.217-1.441 3.217-3.217 0-7.899-3.383-11.308-10-11.308z"></path>
    </svg>
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from './IconBase.vue'

defineProps<{
  size?: number | string
  color?: string
}>()
</script>
