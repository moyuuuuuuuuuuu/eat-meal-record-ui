<template>
  <view class="icon-base" :style="iconStyle">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: number | string
  color?: string
}>(), {
  size: 24,
  color: 'currentColor'
})

const iconStyle = computed(() => ({
  width: typeof props.size === 'number' ? `${props.size}px` : props.size,
  height: typeof props.size === 'number' ? `${props.size}px` : props.size,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: props.color
}))
</script>

<style scoped>
.icon-base {
  line-height: 1;
  vertical-align: middle;
}
:deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
