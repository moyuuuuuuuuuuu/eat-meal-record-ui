import { createGlobalState } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

export const useAuth = createGlobalState(() => {
  const getStorage = (key: string) => {
    const val = uni.getStorageSync(key)
    // 兼容部分环境下 uni.getStorageSync 返回 {"type": "object", "data": {...}} 的情况
    if (val && typeof val === 'object' && 'type' in val && 'data' in val && val.type === 'object') {
      return val.data
    }
    return val
  }

  const token = ref(getStorage('token') || '')
  const userInfo = ref(getStorage('userInfo') || null)
  const isAudit = ref(getStorage('isAudit') || false)

  watch(token, (val) => {
    uni.setStorageSync('token', val)
  })

  watch(userInfo, (val) => {
    uni.setStorageSync('userInfo', val)
  }, { deep: true })

  watch(isAudit, (val) => {
    uni.setStorageSync('isAudit', val)
  })

  const isLogin = computed(() => !!token.value)

  const login = (_token: string, _userInfo?: any) => {
    token.value = _token
    if (_userInfo) {
      // 检查 _userInfo 是否已经包含了 data 层，如果是则解包
      userInfo.value = _userInfo
    }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    isAudit.value = false
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
    uni.removeStorageSync('isAudit')
  }

  return {
    token,
    userInfo,
    isAudit,
    isLogin,
    login,
    logout,
  }
})
