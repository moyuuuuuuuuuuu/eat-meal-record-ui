<script setup lang="ts">
import { useRequest } from 'alova/client'
import { useAuth } from '@/composables/useAuth'
import { usePageShare } from '@/composables/usePageShare'

const props = defineProps<{
  redirect?: string
}>()

definePage({
  name: 'login',
  style: {
    navigationBarTitleText: '登录',
  },
})

const { login: setAuth } = useAuth()
const { error: showError, success: showSuccess } = useGlobalToast()

const { loading, send: smsLoginRequest } = useRequest(data => Apis.auth.sms.login({ data }), { immediate: false })
const { loading: smsSending, send: sendSmsRequest } = useRequest(data => Apis.auth.sms.send({ data }), { immediate: false })
const { loading: wxLoading, send: wxLoginRequest } = useRequest(data => Apis.auth.login({ data }), { immediate: false })

const phone = ref('')
const code = ref('')
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null
const isAgree = ref(false)

// 平台检测
const isMp = ref(false)
const isWechat = ref(false)

// #ifdef MP-WEIXIN
isMp.value = true
// #endif

// #ifdef H5
const ua = window.navigator.userAgent.toLowerCase()
isWechat.value = ua.includes('micromessenger')
// #endif

// 是否腾讯系环境 (一键登录可见)
const isTencentEnv = computed(() => isMp.value || isWechat.value)
// 是否显示手机登录切换按钮 (仅公众号环境)
const showPhoneToggle = computed(() => isWechat.value)
// 手机登录表单显示状态
const showPhoneForm = ref(!isTencentEnv.value)

function togglePhoneForm() {
  showPhoneForm.value = true
}

function getSafeRedirect(): string {
  if (!props.redirect)
    return '/pages/index/index'
  try {
    const target = decodeURIComponent(props.redirect)
    return target.startsWith('/pages/') && !target.includes('://') ? target : '/pages/index/index'
  }
  catch {
    return '/pages/index/index'
  }
}

async function handleGetCode() {
  if (!phone.value || !/^1[3-9]\d{9}$/.test(phone.value)) {
    showError('请输入正确的手机号')
    return
  }
  if (countdown.value > 0 || smsSending.value)
    return

  try {
    await sendSmsRequest({ mobile: phone.value })
    showSuccess('验证码已发送')
    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0 && countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  }
  catch (err) {
    console.error('发送验证码失败', err)
  }
}

onUnload(() => {
  if (countdownTimer)
    clearInterval(countdownTimer)
})

usePageShare({ title: '饮食记录，轻松管理每一餐', path: '/pages/login/index' })

function handleLogin() {
  if (!isAgree.value) {
    showError('请先同意用户协议')
    return
  }
  if (!phone.value || !code.value) {
    showError('请输入手机号和验证码')
    return
  }

  smsLoginRequest({
    mobile: phone.value,
    code: code.value,
  }).then((res) => {
    if (res && res.token) {
      setAuth(res.token, res.userInfo)
      // 标记为刚刚登录成功，用于首页触发授权
      uni.setStorageSync('JUST_LOGGED_IN', true)
      showSuccess('登录成功')
      const targetUrl = getSafeRedirect()
      setTimeout(() => {
        const targetPath = targetUrl.split('?')[0]
        if (['/pages/index/index', '/pages/feed/index', '/pages/profile/index'].includes(targetPath)) {
          uni.switchTab({ url: targetPath })
        }
        else {
          uni.reLaunch({ url: targetUrl })
        }
      }, 1500)
    }
  }).catch((err) => {
    console.error('登录失败', err)
  })
}

function handleWxLogin() {
  if (!isAgree.value) {
    showError('请先同意用户协议')
    return
  }

  // #ifdef MP-WEIXIN
  uni.login({
    provider: 'weixin',
    success: (loginRes) => {
      if (loginRes.code) {
        wxLoginRequest({
          code: loginRes.code,
        }).then((res) => {
          if (res && res.token) {
            setAuth(res.token, res.userInfo)
            // 标记为刚刚登录成功，用于首页触发授权
            uni.setStorageSync('JUST_LOGGED_IN', true)
            showSuccess('登录成功')
            const targetUrl = getSafeRedirect()
            setTimeout(() => {
              const targetPath = targetUrl.split('?')[0]
              if (['/pages/index/index', '/pages/feed/index', '/pages/profile/index'].includes(targetPath)) {
                uni.switchTab({ url: targetPath })
              }
              else {
                uni.reLaunch({ url: targetUrl })
              }
            }, 1500)
          }
        }).catch((err) => {
          console.error('微信登录失败', err)
        })
      }
      else {
        showError('获取微信 code 失败')
      }
    },
    fail: (err) => {
      console.error('uni.login fail', err)
      showError('微信登录失败')
    },
  })
  // #endif

  // #ifdef H5
  if (isWechat.value) {
    // 微信公众号授权逻辑
    showSuccess('微信公众号登录中...')
    // 这里应该是跳转到微信授权 URL，通常后端会提供一个获取授权链接的接口或者直接跳转
    // window.location.href = '...'
  }
  // #endif
}
function openPrivacy(): void {
  // #ifdef MP-WEIXIN
  if (wx.openPrivacyContract) {
    wx.openPrivacyContract({
      fail: () => uni.showToast({ title: '隐私协议加载失败', icon: 'none' }),
    })
  }
  // #endif
}
function goUserAgreement() {
  uni.navigateTo({
    url: '/pages/article/index?type=1',
  })
}
</script>

<template>
  <view class="login-container bg-[var(--page-bg)] px-6 pt-20">
    <view class="mb-12">
      <view class="mb-2 text-2xl text-[var(--text-main)] font-bold">
        欢迎回来
      </view>
      <view class="text-sm text-[var(--text-sub)]">
        记录您的每一餐，开启健康生活
      </view>
    </view>

    <!-- 微信登录 (小程序/公众号) -->
    <template v-if="isTencentEnv">
      <button
        v-if="!showPhoneForm || isWechat"
        class="h-12 flex items-center justify-center rounded-lg bg-[#07c160] text-white"
        :class="{ 'mb-6': !showPhoneForm, 'mb-10': showPhoneForm }"
        :loading="wxLoading"
        @click="handleWxLogin"
      >
        <wd-icon name="wechat" size="20px" class="mr-2" color="white" />
        <text>微信一键登录</text>
      </button>

      <view v-if="showPhoneToggle && !showPhoneForm" class="mb-10 flex items-center justify-center" @click="togglePhoneForm">
        <view class="h-[1px] flex-1 bg-[var(--border-color)]" />
        <view class="mx-4 text-xs text-[var(--text-sub)]">
          或者使用手机号登录
        </view>
        <view class="h-[1px] flex-1 bg-[var(--border-color)]" />
      </view>
    </template>

    <!-- 手机验证码登录 -->
    <view v-if="showPhoneForm" class="space-y-6">
      <view class="border-b border-[var(--border-color)] pb-2">
        <input
          v-model="phone"
          type="number"
          placeholder="请输入手机号"
          maxlength="11"
          class="h-10 text-[var(--text-main)]"
        >
      </view>

      <view class="flex items-center border-b border-[var(--border-color)] pb-2">
        <input
          v-model="code"
          type="number"
          placeholder="请输入验证码"
          maxlength="6"
          class="h-10 flex-1 text-[var(--text-main)]"
        >
        <text
          class="ml-4 text-sm text-[var(--brand)] font-medium"
          :class="{ 'text-[var(--text-sub)] opacity-50': countdown > 0 || smsSending }"
          @click="handleGetCode"
        >
          {{ smsSending ? '发送中...' : (countdown > 0 ? `${countdown}s后重发` : '获取验证码') }}
        </text>
      </view>

      <button
        class="mt-8 h-12 w-full rounded-xl bg-[var(--brand)] text-white font-semibold"
        :loading="loading"
        @click="handleLogin"
      >
        立即登录
      </button>
    </view>

    <!-- 用户协议 -->
    <view class="mt-8 flex items-start gap-2">
      <wd-checkbox v-model="isAgree" shape="square" size="14px" />
      <view class="text-xs text-[var(--text-sub)] leading-tight">
        我已阅读并同意
        <text class="text-[var(--brand)]" @click="goUserAgreement">
          《用户协议》
        </text>
        与
        <text class="text-[var(--brand)]" @click="openPrivacy">
          《隐私政策》
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
}
</style>
