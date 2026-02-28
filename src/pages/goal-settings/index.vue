<script setup lang="ts">
import { useRequest } from 'alova/client'

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

// 获取当前目标设置
const { onSuccess } = useRequest(Apis.user.goal(), {
  immediate: true,
})

onSuccess((event) => {
  const data = event.data
  if (data) {
    dailyCalories.value = data.daily_calories || 2000
    protein.value = data.protein || 150
    fat.value = data.fat || 55
    carbs.value = data.carbohydrate || 225
    targetWeight.value = data.weight || 60
  }
})

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

const { loading: saving, send: saveGoalApi } = useRequest(data => Apis.user.goalSave({ data }), {
  immediate: false,
})

async function handleSave() {
  if (saving.value)
    return

  uni.showLoading({ title: '保存中...' })
  try {
    await saveGoalApi({
      daily_calories: dailyCalories.value,
      protein: protein.value,
      fat: fat.value,
      carbohydrate: carbs.value,
      weight: targetWeight.value,
    })
    uni.hideLoading()
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1500)
  }
  catch (err) {
    uni.hideLoading()
    console.error('保存目标失败', err)
  }
}
</script>

<template>
  <view class="page-container h-screen flex flex-col overflow-hidden bg-[var(--page-bg)]">
    <wd-navbar title="目标设置" placeholder left-arrow fixed @click-left="goBack">
      <template #right>
        <view class="save-btn" @click="handleSave">
          <text>保存</text>
        </view>
      </template>
    </wd-navbar>

    <scroll-view scroll-y class="w-full flex-1">
      <view class="w-full px-4 py-4 pb-10 space-y-4">
        <!-- 热量目标 -->
        <view class="rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
          <view class="mb-6 flex items-center justify-between">
            <text class="text-sm text-[var(--text-main)] font-bold">
              每日热量目标
            </text>
            <text class="text-lg text-emerald-600 font-bold">
              {{ dailyCalories }}
              <text class="ml-1 text-xs text-[var(--text-sub)] font-normal">
                kcal
              </text>
            </text>
          </view>
          <wd-slider v-model="dailyCalories" :min="1200" :max="3500" :step="50" active-color="#10b981" />
          <view class="mt-2 flex justify-between text-[10px] text-[var(--text-sub)]">
            <text>1200</text>
            <text>3500</text>
          </view>
        </view>

        <!-- 营养素目标 -->
        <view class="rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
          <text class="mb-6 block text-sm text-[var(--text-main)] font-bold">
            营养素目标
          </text>

          <view class="space-y-8">
            <!-- 蛋白质 -->
            <view>
              <view class="mb-2 flex justify-between">
                <text class="text-xs text-[var(--text-sub)]">
                  蛋白质 (g)
                </text>
                <text class="text-sm text-emerald-600 font-bold">
                  {{ protein }}
                </text>
              </view>
              <wd-slider v-model="protein" :min="10" :max="300" :step="1" active-color="#10b981" />
            </view>

            <!-- 脂肪 -->
            <view>
              <view class="mb-2 flex justify-between">
                <text class="text-xs text-[var(--text-sub)]">
                  脂肪 (g)
                </text>
                <text class="text-sm text-blue-600 font-bold">
                  {{ fat }}
                </text>
              </view>
              <wd-slider v-model="fat" :min="10" :max="200" :step="1" active-color="#3b82f6" />
            </view>

            <!-- 碳水 -->
            <view>
              <view class="mb-2 flex justify-between">
                <text class="text-xs text-[var(--text-sub)]">
                  碳水化合物 (g)
                </text>
                <text class="text-sm text-orange-600 font-bold">
                  {{ carbs }}
                </text>
              </view>
              <wd-slider v-model="carbs" :min="50" :max="600" :step="1" active-color="#f59e0b" />
            </view>
          </view>
        </view>

        <!-- 体重目标 -->
        <view class="rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
          <view class="mb-6 flex items-center justify-between">
            <text class="text-sm text-[var(--text-main)] font-bold">
              体重目标
            </text>
            <text class="text-lg text-emerald-600 font-bold">
              {{ targetWeight }}
              <text class="ml-1 text-xs text-gray-400 font-normal">
                kg
              </text>
            </text>
          </view>
          <wd-slider v-model="targetWeight" :min="40" :max="120" :step="1" active-color="#10b981" />
        </view>

        <!-- 提示 -->
        <view class="border border-blue-100/20 rounded-xl bg-blue-50/10 p-4">
          <text class="text-xs text-blue-500 leading-relaxed">
            💡 提示：系统已根据您的每日热量目标，按照蛋白质 30%、脂肪 25%、碳水 45% 的国际推荐占比自动计算了营养素目标值。
          </text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

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
