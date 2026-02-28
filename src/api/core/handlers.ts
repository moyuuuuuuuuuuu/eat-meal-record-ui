import type { Method } from 'alova'
import { useAuth } from '@/composables/useAuth'
import router from '@/router'

// Custom error class for API errors
export class ApiError extends Error {
  code: number
  data?: any

  constructor(message: string, code: number, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.data = data
  }
}

// Define a type for the expected API response structure
interface ApiResponse {
  code: number
  msg?: string
  message?: string
  data?: any
  success?: boolean
  total?: number
  more?: boolean
}

// Handle successful responses
export async function handleAlovaResponse(
  response: UniApp.RequestSuccessCallbackResult | UniApp.UploadFileSuccessCallbackResult | UniApp.DownloadSuccessData,
) {
  const globalToast = useGlobalToast()
  const { logout } = useAuth()
  // Extract status code and data from UniApp response
  const { statusCode, data } = response as UniNamespace.RequestSuccessCallbackResult

  // 处理500错误
  if (statusCode === 500) {
    globalToast.error('服务器内部错误 (500)')
    throw new ApiError('服务器内部错误 (500)', statusCode, data)
  }

  // Handle other HTTP error status codes
  if (statusCode >= 400) {
    globalToast.error(`请求失败，状态码: ${statusCode}`)
    throw new ApiError(`Request failed with status: ${statusCode}`, statusCode, data)
  }

  // The data is already parsed by UniApp adapter
  const json = data as ApiResponse
  // Log response in development
  if (import.meta.env.MODE === 'development') {
    console.log('[Alova Response]', json)
  }

  if ([401, 403, 400].includes(json.code)) {
    // 如果是未授权错误，清除用户信息并跳转到登录页
    logout()
    globalToast.error({ msg: '登录已过期，请重新登录！', duration: 500 })
    const timer = setTimeout(() => {
      clearTimeout(timer)
      // 获取当前页面栈
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const redirect = currentPage ? encodeURIComponent(`/${currentPage.route}${currentPage.$page.fullPath.includes('?') ? `?${currentPage.$page.fullPath.split('?')[1]}` : ''}`) : ''

      // 小程序和公众号引导到微信授权页面、普通h5引导到手机验证码登录页面
      // 这里统一跳转到 login 页面，由 login 页面内部根据环境展示不同内容
      router.replaceAll({ name: 'login', query: { redirect } })
    }, 500)

    throw new ApiError('登录已过期，请重新登录！', statusCode, data)
  }

  // Handle both 0 and 200 as success codes
  if (json.code !== 0 && json.code !== 200) {
    globalToast.error(json.msg || json.message || '请求失败')
    throw new ApiError(json.msg || json.message || 'Request failed', json.code || statusCode, data)
  }

  // Return data for successful responses
  return json.data
}

// Handle request errors
export function handleAlovaError(error: any, method: Method) {
  const globalToast = useGlobalToast()
  const { logout } = useAuth()
  // Log error in development
  if (import.meta.env.MODE === 'development') {
    console.error('[Alova Error]', error, method)
  }

  // 处理401/403错误
  if (error instanceof ApiError && (error.code === 401 || error.code === 403)) {
    // 如果是未授权错误，清除用户信息并跳转到登录页
    logout()
    globalToast.error({ msg: '登录已过期，请重新登录！', duration: 500 })
    const timer = setTimeout(() => {
      clearTimeout(timer)
      // 获取当前页面栈
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const redirect = currentPage ? encodeURIComponent(`/${currentPage.route}${currentPage.$page.fullPath.includes('?') ? `?${currentPage.$page.fullPath.split('?')[1]}` : ''}`) : ''

      // 小程序和公众号引导到微信授权页面、普通h5引导到手机验证码登录页面
      // 这里统一跳转到 login 页面，由 login 页面内部根据环境展示不同内容
      router.replaceAll({ name: 'login', query: { redirect } })
    }, 800)
    throw new ApiError('登录已过期，请重新登录！', error.code, error.data)
  }

  // Handle different types of errors
  if (error.name === 'NetworkError') {
    globalToast.error('网络错误，请检查您的网络连接')
  }
  else if (error.name === 'TimeoutError') {
    globalToast.error('请求超时，请重试')
  }
  else if (error instanceof ApiError) {
    globalToast.error(error.message || '请求失败')
  }
  else {
    globalToast.error('发生意外错误')
  }

  throw error
}
