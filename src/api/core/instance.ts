import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'
import vueHook from 'alova/vue'
import { useAuth } from '@/composables/useAuth'
import mockAdapter from '../mock/mockAdapter'
import { handleAlovaError, handleAlovaResponse } from './handlers'

export const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://petstore3.swagger.io/api/v3',
  ...AdapterUniapp({
    mockRequest: mockAdapter,
  }),
  statesHook: vueHook,
  beforeRequest: (method) => {
    // Add Accept header
    method.config.headers.Accept = 'application/json'

    // Add JWT Token
    const { token } = useAuth()
    if (token.value) {
      method.config.headers.Authorization = `Bearer ${token.value}`
    }

    // Add content type for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(method.type)) {
      // If the data is FormData, alova will set the correct Content-Type with boundary
      // Don't overwrite Content-Type if it's already set (e.g. for uploads)
      if (!method.config.headers['Content-Type'] && !(typeof FormData !== 'undefined' && method.data instanceof FormData)) {
        method.config.headers['Content-Type'] = 'application/json'
      }
    }

    // Add timestamp to prevent caching for GET requests
    if (method.type === 'GET' && CommonUtil.isObj(method.config.params)) {
      method.config.params._t = Date.now()
    }

    // Log request in development
    if (import.meta.env.MODE === 'development') {
      console.log(`[Alova Request] ${method.type} ${method.url}`, method.data || method.config.params)
      console.log(`[API Base URL] ${import.meta.env.VITE_API_BASE_URL}`)
      console.log(`[Environment] ${import.meta.env.VITE_ENV_NAME}`)
    }
  },

  // Response handlers
  responded: {
    // Success handler
    onSuccess: handleAlovaResponse,

    // Error handler
    onError: handleAlovaError,

    // Complete handler - runs after success or error
    onComplete: async () => {
      // Any cleanup or logging can be done here
    },
  },

  // We'll use the middleware in the hooks
  // middleware is not directly supported in createAlova options

  // Default request timeout (10 seconds)
  timeout: 60000,
  // 设置为null即可全局关闭全部请求缓存
  cacheFor: null,
})

export default alovaInstance
