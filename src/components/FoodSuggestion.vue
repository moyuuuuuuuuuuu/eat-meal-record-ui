<script setup lang="ts">
import { useRequest } from 'alova/client'
import { ref } from 'vue'

const isAnimating = ref(false)

const {
  data: currentSuggestion,
  send: getRecommendation,
  loading,
} = useRequest(Apis.food.recommendation(), {
  immediate: true,
})

async function handleRefresh() {
  if (loading.value || isAnimating.value)
    return
  isAnimating.value = true
  try {
    await getRecommendation()
  }
  finally {
    setTimeout(() => {
      isAnimating.value = false
    }, 500)
  }
}
</script>

<template>
  <view class="rounded-xl from-emerald-500 to-teal-500 bg-gradient-to-r p-4 text-white shadow-md">
    <view class="mb-3 flex items-center justify-between">
      <view class="flex items-center gap-2">
        <IconSparkles size="18" color="white" />
        <text class="text-sm font-bold">
          今日吃什么
        </text>
      </view>
      <view class="p-1" :class="{ rotating: isAnimating }" @click="handleRefresh">
        <IconRefreshCw size="18" color="white" />
      </view>
    </view>

    <view v-if="currentSuggestion" class="suggestion-content">
      <view class="line-clamp-1 mb-1 text-lg font-medium">
        {{ currentSuggestion.name }}
      </view>
      <view class="flex flex-wrap items-center gap-2">
        <text class="text-xs font-medium opacity-90">
          约 {{ Math.round(Number(currentSuggestion.calories)) }} kcal
        </text>
        <view class="flex flex-wrap gap-1.5">
          <text
            v-for="(t, i) in (Array.isArray(currentSuggestion.tag) ? currentSuggestion.tag : [currentSuggestion.tag])"
            :key="i"
            class="border border-white/10 rounded-full bg-white/20 px-2 py-0.5 text-[10px]"
          >
            {{ t }}
          </text>
        </view>
      </view>
      <view v-if="currentSuggestion.recommend_reason" class="line-clamp-1 mt-2 text-[11px] italic opacity-80">
        "{{ currentSuggestion.recommend_reason }}"
      </view>
    </view>
    <view v-else-if="loading" class="h-10 flex items-center justify-center opacity-50">
      <text class="text-xs">
        智能推荐中...
      </text>
    </view>
  </view>
</template>

<style scoped>
.rotating {
  animation: rotate 0.5s linear;
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
