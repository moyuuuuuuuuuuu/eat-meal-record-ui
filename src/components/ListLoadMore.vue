<script setup lang="ts">
const props = defineProps<{
  reachedBottom: boolean
  loading: boolean
  finished: boolean
}>()

const visible = computed(() => props.reachedBottom && (props.loading || props.finished))
const state = computed<'loading' | 'finished'>(() => props.finished ? 'finished' : 'loading')
const loadingProps = { color: '#10b981', size: '18px' }
</script>

<template>
  <view v-if="visible" class="list-load-more">
    <wd-loadmore
      :state="state"
      loading-text="正在加载更多"
      finished-text="已经到底啦"
      :loading-props="loadingProps"
    />
  </view>
</template>

<style scoped>
.list-load-more {
  padding: 18px 0 calc(18px + env(safe-area-inset-bottom));
  opacity: 0.82;
}
</style>
