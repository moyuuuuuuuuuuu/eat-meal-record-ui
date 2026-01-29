<route lang="json">
{
  "style": {
    "navigationBarTitleText": "个人信息",
    "navigationStyle": "custom"
  }
}
</route>

<template>
  <view class="page-container bg-[var(--page-bg)] h-screen flex flex-col overflow-hidden">
    <wd-navbar title="个人信息" fixed placeholder left-arrow @click-left="goBack">
      <template #right>
        <view class="save-btn" @click="handleSave">
          <text>保存</text>
        </view>
      </template>
    </wd-navbar>

    <scroll-view scroll-y class="flex-1 w-full">
      <view class="px-4 py-4 space-y-4 pb-10 w-full">
        <!-- 头像 -->
        <view class="bg-[var(--card-bg)] rounded-xl p-6 flex flex-col items-center">
          <view class="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
            <IconUser size="40" color="#10b981" />
          </view>
          <text class="text-xs text-emerald-600 font-bold">更换头像</text>
        </view>

      <!-- 基础信息 -->
      <view class="bg-[var(--card-bg)] rounded-xl overflow-hidden shadow-sm">
        <wd-cell-group border>
          <wd-input v-model="name" label="昵称" placeholder="请输入昵称" text-align="right" />
          <view class="flex items-center justify-between px-[15px] py-3 bg-[var(--card-bg)] border-b border-[var(--border-color)]">
            <text class="text-sm text-[var(--text-main)]">性别</text>
            <wd-radio-group v-model="gender" inline shape="button" active-color="#10b981">
              <wd-radio value="男">男</wd-radio>
              <wd-radio value="女">女</wd-radio>
            </wd-radio-group>
          </view>
          <wd-datetime-picker
            v-model="birthdayTimestamp"
            type="date"
            @confirm="handleDateConfirm"
          >
            <view class="flex items-center justify-between px-[15px] py-3 bg-[var(--card-bg)]">
              <text class="text-sm text-[var(--text-main)]">生日</text>
              <view class="flex items-center gap-2">
                <text class="text-sm text-[var(--text-sub)]">{{ birthday }}</text>
                <IconChevronRight size="16" color="#9ca3af" />
              </view>
            </view>
          </wd-datetime-picker>
        </wd-cell-group>
      </view>

      <!-- 身体数据 -->
      <view class="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm">
        <text class="text-sm font-bold text-[var(--text-main)] mb-6 block">身体数据</text>
        <view class="space-y-8">
          <view>
            <view class="flex justify-between mb-2">
              <text class="text-xs text-[var(--text-sub)]">身高 (cm)</text>
              <text class="text-sm font-bold text-emerald-600">{{ height }}</text>
            </view>
            <wd-slider v-model="height" :min="140" :max="220" :step="1" active-color="#10b981" />
          </view>
          <view>
            <view class="flex justify-between mb-2">
              <text class="text-xs text-[var(--text-sub)]">体重 (kg)</text>
              <text class="text-sm font-bold text-emerald-600">{{ weight }}</text>
            </view>
            <wd-slider v-model="weight" :min="30" :max="200" :step="0.1" active-color="#10b981" />
          </view>
        </view>
      </view>

      <!-- BMI 指数 -->
      <view class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 shadow-lg text-white">
        <view class="flex justify-between items-center mb-1">
          <text class="text-xs opacity-80">BMI 指数</text>
          <text class="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{{ bmiStatus }}</text>
        </view>
        <view class="text-3xl font-bold">{{ bmi }}</view>
        <view class="mt-4 h-1 w-full bg-white/20 rounded-full overflow-hidden flex">
          <view class="h-full bg-blue-300" style="width: 25%"></view>
          <view class="h-full bg-emerald-300" style="width: 35%"></view>
          <view class="h-full bg-orange-300" style="width: 20%"></view>
          <view class="h-full bg-red-300" style="width: 20%"></view>
        </view>
      </view>
      </view>
    </scroll-view>

  </view>
</template>

<script setup lang="ts">
const name = ref('用户')
const gender = ref('女')
const birthday = ref('1998-01-15')
const birthdayTimestamp = ref(new Date('1998-01-15').getTime())
const height = ref(170)
const weight = ref(65)

const bmi = computed(() => {
  const h = height.value / 100
  return (weight.value / (h * h)).toFixed(1)
})

const bmiStatus = computed(() => {
  const v = parseFloat(bmi.value)
  if (v < 18.5) return '偏瘦'
  if (v < 24) return '正常'
  if (v < 28) return '超重'
  return '肥胖'
})

function goBack() {
  uni.navigateBack()
}

function handleDateConfirm({ value }: { value: number }) {
  const date = new Date(value)
  birthday.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
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
:deep(.wd-input) {
  padding: 10px 15px;
}
</style>
