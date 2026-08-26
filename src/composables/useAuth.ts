import { createGlobalState } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

export interface UserGoal {
  daily_calories: number
  protein: number
  fat: number
  carbohydrate: number
  weight: number
}

export interface UserProfile {
  id?: number
  nickname: string
  avatar: string
  sex: number
  gender: string
  birthday: string
  age: number
  tall: number
  height: number
  weight: number
  currentWeight: number
  targetWeight: number
  goal?: UserGoal
  [key: string]: unknown
}

function parseObject<T>(value: unknown): T | undefined {
  if (typeof value !== 'string')
    return value as T | undefined
  try {
    return JSON.parse(value) as T
  }
  catch {
    return undefined
  }
}

function normalizeUserProfile(raw: unknown): UserProfile | null {
  if (!raw || typeof raw !== 'object')
    return null
  const data = raw as Record<string, any>
  const sex = Number(data.sex ?? (data.gender === '男' ? 1 : data.gender === '女' ? 2 : 3))
  const tall = Number(data.tall ?? data.height ?? 0)
  const weight = Number(data.weight ?? data.currentWeight ?? 0)
  const goal = parseObject<UserGoal>(data.goal)
  return {
    ...data,
    nickname: String(data.nickname ?? data.name ?? '用户'),
    avatar: String(data.avatar ?? ''),
    sex,
    gender: String(data.gender ?? (sex === 1 ? '男' : sex === 2 ? '女' : '未知')),
    birthday: String(data.birthday ?? ''),
    age: Number(data.age ?? 0),
    tall,
    height: tall,
    weight,
    currentWeight: weight,
    targetWeight: Number(data.targetWeight ?? goal?.weight ?? 0),
    goal,
  }
}

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
  const userInfo = ref<UserProfile | null>(normalizeUserProfile(getStorage('userInfo')))

  watch(token, (val) => {
    uni.setStorageSync('token', val)
  })

  watch(userInfo, (val) => {
    uni.setStorageSync('userInfo', val)
  }, { deep: true })

  const isLogin = computed(() => !!token.value)

  const setUserInfo = (profile: unknown) => {
    userInfo.value = normalizeUserProfile(profile)
  }

  const patchUserInfo = (profile: Partial<UserProfile>) => {
    setUserInfo({ ...(userInfo.value || {}), ...profile })
  }

  const login = (_token: string, _userInfo?: unknown) => {
    token.value = _token
    if (_userInfo)
      setUserInfo(_userInfo)
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
  }

  return {
    token,
    userInfo,
    isLogin,
    login,
    setUserInfo,
    patchUserInfo,
    logout,
  }
})
