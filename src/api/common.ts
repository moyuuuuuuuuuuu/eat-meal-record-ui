import { useAuth } from '@/composables/useAuth'

export interface UploadResponse {
  code: number
  data: {
    path: string
    url: string
  }
  msg: string
}

export function uploadByUni(filePath: string): Promise<UploadResponse['data']> {
  const { token } = useAuth()
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://petstore3.swagger.io/api/v3'
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${baseURL}/upload`,
      filePath,
      name: 'file',
      header: {
        Accept: 'application/json',
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      },
      success: (res: UniApp.UploadFileSuccessCallbackResult) => {
        try {
          const result = JSON.parse(res.data) as UploadResponse
          if (result.code === 0 || result.code === 200) {
            resolve(result.data)
          } else {
            reject(new Error(result.msg || '上传失败'))
          }
        } catch (e) {
          reject(new Error('解析响应失败'))
        }
      },
      fail: (err: UniApp.GeneralCallbackResult) => {
        reject(new Error(err.errMsg))
      },
    })
  })
}
