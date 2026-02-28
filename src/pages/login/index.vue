<script setup lang="ts">
import { useRequest } from 'alova/client'
import { useAuth } from '@/composables/useAuth'

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
const { loading: wxLoading, send: wxLoginRequest } = useRequest(data => Apis.auth.login({ data }), { immediate: false })

const phone = ref('')
const code = ref('')
const countdown = ref(0)
const isAgree = ref(false)

const isMp = ref(false)
const isWechat = ref(false)

// #ifdef MP-WEIXIN
isMp.value = true
// #endif

// #ifdef H5
const ua = window.navigator.userAgent.toLowerCase()
isWechat.value = ua.includes('micromessenger')

// #endif

function handleGetCode() {
  if (!phone.value || !/^1[3-9]\d{9}$/.test(phone.value)) {
    showError('请输入正确的手机号')
    return
  }
  if (countdown.value > 0)
    return

  // 模拟获取验证码
  showSuccess('验证码已发送')
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

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
      showSuccess('登录成功')
      const targetUrl = props.redirect ? decodeURIComponent(props.redirect) : '/pages/index/index'
      setTimeout(() => {
        if (targetUrl.startsWith('/pages/index/index') || targetUrl.startsWith('/pages/feed/index') || targetUrl.startsWith('/pages/profile/index')) {
          uni.switchTab({ url: targetUrl })
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
            showSuccess('登录成功')
            const targetUrl = props.redirect ? decodeURIComponent(props.redirect) : '/pages/index/index'
            setTimeout(() => {
              if (targetUrl.startsWith('/pages/index/index') || targetUrl.startsWith('/pages/feed/index') || targetUrl.startsWith('/pages/profile/index')) {
                uni.switchTab({ url: targetUrl })
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
</script>

<template>
  <view class="login-container px-6 pt-20">
    <view class="mb-12">
      <view class="mb-2 text-2xl font-bold">
        欢迎回来
      </view>
      <view class="text-sm text-gray-500">
        记录您的每一餐，开启健康生活
      </view>
    </view>

    <!-- 微信登录 (小程序/公众号) -->
    <template v-if="isMp || isWechat">
      <button
        class="mb-6 h-12 flex items-center justify-center rounded-lg bg-[#07c160] text-white"
        :loading="wxLoading"
        @click="handleWxLogin"
      >
        <wd-icon name="wechat" size="20px" class="mr-2" color="white" />
        <text>微信一键登录</text>
      </button>

      <view class="mb-10 flex items-center justify-center">
        <view class="h-[1px] flex-1 bg-gray-200" />
        <view class="mx-4 text-xs text-gray-400">
          或者使用手机号登录
        </view>
        <view class="h-[1px] flex-1 bg-gray-200" />
      </view>
    </template>

    <!-- 手机验证码登录 -->
    <view class="space-y-6">
      <view class="border-b border-gray-100 pb-2">
        <input
          v-model="phone"
          type="number"
          placeholder="请输入手机号"
          maxlength="11"
          class="h-10"
        >
      </view>

      <view class="flex items-center border-b border-gray-100 pb-2">
        <input
          v-model="code"
          type="number"
          placeholder="请输入验证码"
          maxlength="6"
          class="h-10 flex-1"
        >
        <text
          class="ml-4 text-sm text-blue-500"
          :class="{ 'text-gray-400': countdown > 0 }"
          @click="handleGetCode"
        >
          {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
        </text>
      </view>

      <button
        class="mt-8 h-12 w-full rounded-lg bg-blue-600 text-white"
        :loading="loading"
        @click="handleLogin"
      >
        立即登录
      </button>
    </view>

    <!-- 用户协议 -->
    <view class="mt-8 flex items-start gap-2">
      <wd-checkbox v-model="isAgree" shape="square" size="14px" />
      <view class="text-xs text-gray-400 leading-tight">
        我已阅读并同意
        <text class="text-blue-500">
          《用户协议》
        </text>
        与
        <text class="text-blue-500">
          《隐私政策》
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: #fff;
}
</style>
