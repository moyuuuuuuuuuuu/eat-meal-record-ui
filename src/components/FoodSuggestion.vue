<template>
  <view class="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 shadow-md text-white">
    <view class="flex items-center justify-between mb-3">
      <view class="flex items-center gap-2">
        <IconSparkles size="18" color="white" />
        <text class="text-sm font-bold">今日吃什么</text>
      </view>
      <view class="p-1" @click="handleRefresh" :class="{ 'rotating': isAnimating }">
        <IconRefreshCw size="18" color="white" />
      </view>
    </view>

    <view v-if="currentSuggestion" class="suggestion-content">
      <view class="text-lg font-medium mb-1">{{ currentSuggestion.name }}</view>
      <view class="flex items-center gap-2">
        <text class="text-xs opacity-80">约 {{ currentSuggestion.calories }} kcal</text>
        <text class="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{{ currentSuggestion.tag }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const suggestions = [
  { name: '香煎鸡胸肉配糙米', calories: 450, tag: '高蛋白' },
  { name: '三文鱼沙拉', calories: 380, tag: '健康脂肪' },
  { name: '全麦三明治', calories: 320, tag: '均衡营养' },
  { name: '牛油果吐司', calories: 350, tag: '优质碳水' },
  { name: '藜麦鸡肉碗', calories: 420, tag: '超级食物' },
  { name: '蔬菜蛋饼', calories: 280, tag: '低卡' },
  { name: '虾仁炒西兰花', calories: 240, tag: '低脂' },
  { name: '番茄意面', calories: 390, tag: '经典' },
]

const currentSuggestion = ref(suggestions[Math.floor(Math.random() * suggestions.length)])
const isAnimating = ref(false)

function handleRefresh() {
  if (isAnimating.value) return
  isAnimating.value = true
  setTimeout(() => {
    currentSuggestion.value = suggestions[Math.floor(Math.random() * suggestions.length)]
    isAnimating.value = false
  }, 500)
}
</script>

<style scoped>
.rotating {
  animation: rotate 0.5s linear;
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
