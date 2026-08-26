<script setup lang="ts">
import { useRequest } from 'alova/client'
import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useSystemInfo } from '@/composables/useSystemInfo'

const { totalHeight, navBarHeight } = useSystemInfo()

definePage({
  style: {
    navigationBarTitleText: '个人信息',
    navigationStyle: 'custom',
  },
})

const { userInfo, setUserInfo } = useAuth()

const name = ref('')
const avatarUrl = ref('')
const gender = ref('3')
const birthday = ref('')
const minDate = new Date('1900/01/01').getTime()
const maxDate = Date.now()
const birthdayTimestamp = ref(maxDate)
const height = ref(170)
const weight = ref(65)

function fillForm() {
  const profile = userInfo.value
  if (!profile)
    return
  name.value = profile.nickname
  avatarUrl.value = profile.avatar
  gender.value = String(profile.sex || 3)
  birthday.value = profile.birthday
  birthdayTimestamp.value = profile.birthday ? new Date(profile.birthday.replace(/-/g, '/')).getTime() : maxDate
  height.value = profile.height || 170
  weight.value = profile.currentWeight || 65
}

const { send: getInformation } = useRequest(Apis.user.information(), { immediate: false })

onShow(async () => {
  try {
    const profile = await getInformation()
    if (profile)
      setUserInfo(profile)
  }
  finally {
    fillForm()
  }
})

const bmi = computed(() => {
  const h = height.value / 100
  return h > 0 ? (weight.value / (h * h)).toFixed(1) : '--'
})

const bmiStatus = computed(() => {
  if (bmi.value === '--')
    return '未设置'
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
      sex: Number(gender.value),
      ...(birthday.value ? { birthday: birthday.value } : {}),
      tall: height.value,
      weight: weight.value,
      // signature: '', // 如果有签名档可以在这里补充
      // age: 0, // 如果有年龄字段可以在这里计算或补充
    }

    const res = await updateInfoApi(postData)
    // 更新全局用户信息状态
    if (res)
      setUserInfo(res)

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
    <wd-navbar title="个人信息" safe-area-inset-top fixed :custom-style="`--wd-navbar-height: ${navBarHeight}px`">
      <template #left>
        <view class="flex items-center pl-2">
          <view class="flex items-center justify-center p-1" @click="goBack">
            <wd-icon name="arrow-left" size="20" />
          </view>
        </view>
      </template>
    </wd-navbar>
    <view class="shrink-0" :style="{ height: `${totalHeight}px` }" />

    <scroll-view scroll-y class="w-full flex-1">
      <view class="w-full px-4 py-4 pb-28 space-y-4">
        <!-- 头像 -->
        <view class="flex flex-col items-center rounded-xl bg-[var(--card-bg)] p-6" @click="handleChooseAvatar">
          <view class="mb-3 h-20 w-20 flex items-center justify-center overflow-hidden rounded-full bg-emerald-100">
            <wd-img v-if="avatarUrl" :width="100" :height="100" :src="avatarUrl" mode="aspectFill" class="h-full w-full" />
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
              <view class="gender-selector">
                <view
                  v-for="item in [{ label: '男', value: '1' }, { label: '女', value: '2' }, { label: '未设置', value: '3' }]"
                  :key="item.value"
                  class="gender-option"
                  :class="{ 'gender-option--active': gender === item.value }"
                  @click="gender = item.value"
                >
                  {{ item.label }}
                </view>
              </view>
            </view>
            <wd-datetime-picker
              v-model="birthdayTimestamp"
              type="date"
              :min-date="minDate"
              :max-date="maxDate"
              @confirm="handleDateConfirm"
            >
              <view class="flex items-center justify-between bg-[var(--card-bg)] px-[15px] py-3">
                <text class="text-sm text-[var(--text-main)]">
                  生日
                </text>
                <view class="flex items-center gap-2">
                  <text class="text-sm text-[var(--text-sub)]">
                    {{ birthday || '未设置' }}
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
              <wd-slider v-model="height" :min="140" :max="220" :step="1" hide-label active-color="#10b981" />
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
              <wd-slider v-model="weight" :min="30" :max="200" :step="0.1" hide-label active-color="#10b981" />
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

    <view class="save-bar">
      <wd-button type="success" block :loading="saving" @click="handleSave">
        保存个人信息
      </wd-button>
    </view>
  </view>
</template>

<style scoped>
.gender-selector {
  display: flex;
  width: 220px;
  padding: 3px;
  gap: 3px;
  border-radius: 10px;
  background: var(--page-bg);
}
.gender-option {
  flex: 1;
  min-width: 0;
  padding: 7px 4px;
  border-radius: 8px;
  color: var(--text-sub);
  font-size: 13px;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}
.gender-option--active {
  background: #ecfdf5;
  color: #059669;
  font-weight: 600;
  box-shadow: inset 0 0 0 1px #6ee7b7;
}
.save-bar {
  position: fixed;
  z-index: 20;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--border-color);
  background: var(--card-bg);
  box-shadow: 0 -6px 20px rgb(15 23 42 / 6%);
}
:deep(.wd-input) {
  padding: 10px 15px;
}
</style>
