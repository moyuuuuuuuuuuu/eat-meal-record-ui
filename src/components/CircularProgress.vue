<template>
  <view class="circular-container">
    <wd-circle
      v-model="progress"
      :size="size"
      :stroke-width="strokeWidth"
      :color="isOverLimit ? '#ef4444' : '#10b981'"
      :layer-color="layerColor"
    >
      <view class="center-content">
        <text :class="['value', { 'text-red': isOverLimit }]">{{ Math.abs(remaining) }}</text>
        <text class="label">{{ isOverLimit ? '超出' : '剩余' }} kcal</text>
      </view>
    </wd-circle>
  </view>
</template>

<script setup lang="ts">
const { isDark } = useManualTheme()

const props = withDefaults(defineProps<{
  current: number
  total: number
  size?: number
  strokeWidth?: number
}>(), {
  size: 160,
  strokeWidth: 10,
})

const remaining = computed(() => props.total - props.current)
const progress = computed(() => Math.min((props.current / props.total) * 100, 100))
const isOverLimit = computed(() => remaining.value <= 0)

const layerColor = computed(() => {
  return isDark.value ? '#374151' : '#e5e7eb'
})
</script>

<style scoped>
.circular-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.value {
  font-size: 32px;
  font-weight: bold;
  color: var(--text-main);
  line-height: 1;
}
.text-red {
  color: #ef4444;
}
.label {
  font-size: 12px;
  color: var(--text-sub);
  margin-top: 4px;
}
</style>
