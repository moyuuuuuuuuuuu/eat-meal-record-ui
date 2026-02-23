
<template>
  <view class="page-container bg-[var(--page-bg)] h-screen flex flex-col overflow-hidden">
    <wd-navbar title="目标设置" fixed placeholder left-arrow @click-left="goBack">
      <template #right>
        <view class="save-btn" @click="handleSave">
          <text>保存</text>
        </view>
      </template>
    </wd-navbar>

    <scroll-view scroll-y class="flex-1 w-full">
      <view class="px-4 py-4 space-y-4 pb-10 w-full">
        <!-- 热量目标 -->
        <view class="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm">
        <view class="flex items-center justify-between mb-6">
          <text class="text-sm font-bold text-[var(--text-main)]">每日热量目标</text>
          <text class="text-lg font-bold text-emerald-600">{{ dailyCalories }} <text class="text-xs font-normal text-[var(--text-sub)] ml-1">kcal</text></text>
        </view>
        <wd-slider v-model="dailyCalories" :min="1200" :max="3500" :step="50" active-color="#10b981" />
        <view class="flex justify-between mt-2 text-[10px] text-[var(--text-sub)]">
          <text>1200</text>
          <text>3500</text>
        </view>
      </view>

          <!-- 营养素目标 -->
      <view class="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm">
        <text class="text-sm font-bold text-[var(--text-main)] mb-6 block">营养素目标</text>

        <view class="space-y-8">
          <!-- 蛋白质 -->
          <view>
            <view class="flex justify-between mb-2">
              <text class="text-xs text-[var(--text-sub)]">蛋白质 (g)</text>
              <text class="text-sm font-bold text-emerald-600">{{ protein }}</text>
            </view>
            <wd-slider v-model="protein" :min="10" :max="300" :step="1" active-color="#10b981" />
          </view>

          <!-- 脂肪 -->
          <view>
            <view class="flex justify-between mb-2">
              <text class="text-xs text-[var(--text-sub)]">脂肪 (g)</text>
              <text class="text-sm font-bold text-blue-600">{{ fat }}</text>
            </view>
            <wd-slider v-model="fat" :min="10" :max="200" :step="1" active-color="#3b82f6" />
          </view>

          <!-- 碳水 -->
          <view>
            <view class="flex justify-between mb-2">
              <text class="text-xs text-[var(--text-sub)]">碳水化合物 (g)</text>
              <text class="text-sm font-bold text-orange-600">{{ carbs }}</text>
            </view>
            <wd-slider v-model="carbs" :min="50" :max="600" :step="1" active-color="#f59e0b" />
          </view>
        </view>
      </view>

      <!-- 体重目标 -->
      <view class="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm">
        <view class="flex items-center justify-between mb-6">
          <text class="text-sm font-bold text-[var(--text-main)]">体重目标</text>
          <text class="text-lg font-bold text-emerald-600">{{ targetWeight }} <text class="text-xs font-normal text-gray-400 ml-1">kg</text></text>
        </view>
        <wd-slider v-model="targetWeight" :min="40" :max="120" :step="1" active-color="#10b981" />
      </view>

      <!-- 提示 -->
      <view class="bg-blue-50/10 border border-blue-100/20 rounded-xl p-4">
        <text class="text-xs text-blue-500 leading-relaxed">
          💡 提示：系统已根据您的每日热量目标，按照蛋白质 30%、脂肪 25%、碳水 45% 的国际推荐占比自动计算了营养素目标值。
        </text>
      </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '目标设置',
    navigationStyle: 'custom',
  },
})
const dailyCalories = ref(2000)
const protein = ref(150)
const fat = ref(55)
const carbs = ref(225)
const targetWeight = ref(60)

// 监听热量变动，动态计算营养素 (国际卡路里标准占比)
// 蛋白质: 4kcal/g, 脂肪: 9kcal/g, 碳水: 4kcal/g
watch(dailyCalories, (newVal) => {
  protein.value = Math.round((newVal * 0.30) / 4)
  fat.value = Math.round((newVal * 0.25) / 9)
  carbs.value = Math.round((newVal * 0.45) / 4)
}, { immediate: false })

function goBack() {
  uni.navigateBack()
}

function handleSave() {
  uni.showToast({ title: '保存成功', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1500)
}
</script>

<style scoped>
.save-btn {
  background-color: #10b981;
  color: white;
  height: 28px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 13px;
  display: flex;
  align-items: center;
  font-weight: bold;
}
</style>
