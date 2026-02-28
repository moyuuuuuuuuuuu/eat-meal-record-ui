<script setup lang="ts">
import { useRequest } from 'alova/client'
import { useAuth } from '@/composables/useAuth'

definePage({
  style: {
    navigationBarTitleText: '个人信息',
    navigationStyle: 'custom',
  },
})

const { userInfo } = useAuth()

const name = ref(userInfo.value?.nickname || '用户')
const avatarUrl = ref(userInfo.value?.avatar || '')
const gender = ref(userInfo.value?.gender || '女')
const birthday = ref(userInfo.value?.birthday || '1998-01-15')
const minDate = ref(new Date('1970/01/01').getTime())
const birthdayTimestamp = ref(new Date(birthday.value).getTime())
const height = ref(userInfo.value?.height || 170)
const weight = ref(userInfo.value?.weight || 65)

const bmi = computed(() => {
  const h = height.value / 100
  return (weight.value / (h * h)).toFixed(1)
})

const bmiStatus = computed(() => {
  const v = Number.parseFloat(bmi.value)
  if (v < 18.5)
    return '偏瘦'
  if (v < 24)
    return '正常'
  if (v < 28)
    return '超重'
  return '肥胖'
})

function goBack() {
  uni.navigateBack()
}

function handleChooseAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]
      uni.showLoading({ title: '上传中...' })
      try {
        const result = await uploadByUni(tempFilePath)
        avatarUrl.value = result.url
        uni.showToast({ title: '上传成功', icon: 'success' })
      }
      catch (error) {
        console.error('上传头像失败', error)
      }
      finally {
        uni.hideLoading()
      }
    },
  })
}

function handleDateConfirm({ value }: { value: number }) {
  const date = new Date(value)
  birthday.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const { loading: saving, send: updateInfoApi } = useRequest(data => Apis.user.update({ data }), {
  immediate: false,
})

async function handleSave() {
  if (saving.value)
    return

  uni.showLoading({ title: '保存中...' })
  try {
    const postData = {
      nickname: name.value,
      avatar: avatarUrl.value,
      sex: gender.value === '男' ? 1 : 2,
      birthday: birthday.value,
      tall: height.value,
      weight: weight.value,
      // signature: '', // 如果有签名档可以在这里补充
      // age: 0, // 如果有年龄字段可以在这里计算或补充
    }

    await updateInfoApi(postData)

    // 更新全局用户信息状态
    if (userInfo.value) {
      userInfo.value = {
        ...userInfo.value,
        nickname: name.value,
        avatar: avatarUrl.value,
        gender: gender.value,
        birthday: birthday.value,
        height: height.value,
        weight: weight.value,
      }
    }

    uni.hideLoading()
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1500)
  }
  catch (err) {
    uni.hideLoading()
    console.error('保存用户信息失败', err)
  }
}
</script>

<template>
  <view class="page-container h-screen flex flex-col overflow-hidden bg-[var(--page-bg)]">
    <wd-navbar title="个人信息" placeholder left-arrow fixed @click-left="goBack">
      <template #right>
        <view class="save-btn" @click="handleSave">
          <text>保存</text>
        </view>
      </template>
    </wd-navbar>

    <scroll-view scroll-y class="w-full flex-1">
      <view class="w-full px-4 py-4 pb-10 space-y-4">
        <!-- 头像 -->
        <view class="flex flex-col items-center rounded-xl bg-[var(--card-bg)] p-6" @click="handleChooseAvatar">
          <view class="mb-3 h-20 w-20 flex items-center justify-center overflow-hidden rounded-full bg-emerald-100">
            <wd-img v-if="avatarUrl" :src="avatarUrl" mode="aspectFill" class="h-full w-full" />
            <IconUser v-else size="40" color="#10b981" />
          </view>
          <text class="text-xs text-emerald-600 font-bold">
            更换头像
          </text>
        </view>

        <!-- 基础信息 -->
        <view class="overflow-hidden rounded-xl bg-[var(--card-bg)] shadow-sm">
          <wd-cell-group border>
            <wd-input v-model="name" label="昵称" placeholder="请输入昵称" text-align="right" />
            <view class="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--card-bg)] px-[15px] py-3">
              <text class="text-sm text-[var(--text-main)]">
                性别
              </text>
              <wd-radio-group v-model="gender" inline shape="button" active-color="#10b981">
                <wd-radio value="男">
                  男
                </wd-radio>
                <wd-radio value="女">
                  女
                </wd-radio>
              </wd-radio-group>
            </view>
            <wd-datetime-picker
              v-model="birthdayTimestamp"
              type="date"
              :min-date="minDate"
              @confirm="handleDateConfirm"
            >
              <view class="flex items-center justify-between bg-[var(--card-bg)] px-[15px] py-3">
                <text class="text-sm text-[var(--text-main)]">
                  生日
                </text>
                <view class="flex items-center gap-2">
                  <text class="text-sm text-[var(--text-sub)]">
                    {{ birthday }}
                  </text>
                  <IconChevronRight size="16" color="#9ca3af" />
                </view>
              </view>
            </wd-datetime-picker>
          </wd-cell-group>
        </view>

        <!-- 身体数据 -->
        <view class="rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
          <text class="mb-6 block text-sm text-[var(--text-main)] font-bold">
            身体数据
          </text>
          <view class="space-y-8">
            <view>
              <view class="mb-2 flex justify-between">
                <text class="text-xs text-[var(--text-sub)]">
                  身高 (cm)
                </text>
                <text class="text-sm text-emerald-600 font-bold">
                  {{ height }}
                </text>
              </view>
              <wd-slider v-model="height" :min="140" :max="220" :step="1" active-color="#10b981" />
            </view>
            <view>
              <view class="mb-2 flex justify-between">
                <text class="text-xs text-[var(--text-sub)]">
                  体重 (kg)
                </text>
                <text class="text-sm text-emerald-600 font-bold">
                  {{ weight }}
                </text>
              </view>
              <wd-slider v-model="weight" :min="30" :max="200" :step="0.1" active-color="#10b981" />
            </view>
          </view>
        </view>

        <!-- BMI 指数 -->
        <view class="rounded-xl from-emerald-500 to-teal-600 bg-gradient-to-br p-4 text-white shadow-lg">
          <view class="mb-1 flex items-center justify-between">
            <text class="text-xs opacity-80">
              BMI 指数
            </text>
            <text class="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
              {{ bmiStatus }}
            </text>
          </view>
          <view class="text-3xl font-bold">
            {{ bmi }}
          </view>
          <view class="mt-4 h-1 w-full flex overflow-hidden rounded-full bg-white/20">
            <view class="h-full bg-blue-300" style="width: 25%" />
            <view class="h-full bg-emerald-300" style="width: 35%" />
            <view class="h-full bg-orange-300" style="width: 20%" />
            <view class="h-full bg-red-300" style="width: 20%" />
          </view>
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
:deep(.wd-input) {
  padding: 10px 15px;
}
</style>
