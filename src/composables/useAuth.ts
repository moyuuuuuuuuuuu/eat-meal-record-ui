import { createGlobalState, useStorage } from '@vueuse/core'
import { computed } from 'vue'

export const uniStorage = {
  getItem(key: string) {
    return uni.getStorageSync(key) || null
  },
  setItem(key: string, value: any) {
    return uni.setStorageSync(key, value)
  },
  removeItem(key: string) {
    return uni.removeStorageSync(key)
  },
}

export const useAuth = createGlobalState(() => {
  const token = useStorage('token', '', uniStorage)
  const isLogin = computed(() => !!token.value)
  const login = (_token: string) => {
    token.value = _token
  }
  const logout = () => {
    token.value = ''
  }
  return {
    token,
    isLogin,
    login,
    logout,
  }
})
