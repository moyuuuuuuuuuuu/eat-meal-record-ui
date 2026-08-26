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

const suggestionTags = computed(() => {
  const raw = currentSuggestion.value?.tag
  const tags = (Array.isArray(raw) ? raw : [raw]).filter(Boolean).map(String)
  const heatTags = tags.filter(tag => tag.includes('热量'))
  const strongestHeatTag = heatTags.find(tag => tag.includes('高热量')) || heatTags[0]
  return [...new Set(tags.filter(tag => !tag.includes('热量')).concat(strongestHeatTag ? [strongestHeatTag] : []))].slice(0, 4)
})

const suggestionReason = computed(() => String(currentSuggestion.value?.recommend_reason || '').replace(/^[“”"']+|[“”"']+$/g, ''))

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
      <view class="p-2 -m-1" aria-label="换一个推荐" :class="{ rotating: isAnimating }" @click="handleRefresh">
        <IconRefreshCw size="18" color="white" />
      </view>
    </view>

    <view v-if="currentSuggestion" class="suggestion-content">
      <view class="line-clamp-1 mb-1 text-lg font-medium">
        {{ currentSuggestion.name }}
      </view>
      <view class="flex flex-wrap items-center gap-2">
        <text class="text-xs font-medium opacity-90">
          约 {{ Math.round(Number(currentSuggestion.kcal)) }} kcal
        </text>
        <view class="flex flex-wrap gap-1.5">
          <text
            v-for="(t, i) in suggestionTags"
            :key="i"
            class="border border-white/10 rounded-full bg-white/20 px-2 py-0.5 text-[10px]"
          >
            {{ t }}
          </text>
        </view>
      </view>
      <view v-if="suggestionReason" class="line-clamp-2 mt-2 text-[11px] leading-4 opacity-85">
        {{ suggestionReason }}
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
