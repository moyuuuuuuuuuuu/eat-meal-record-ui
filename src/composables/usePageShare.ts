import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

interface PageShareOptions {
  title: string
  path: string
  imageUrl?: string
  timelineTitle?: string
  timelineQuery?: string
}

/** 为微信小程序页面注册统一的好友与朋友圈分享卡片。 */
export function usePageShare(options: PageShareOptions) {
  // #ifdef MP-WEIXIN
  onShareAppMessage(() => ({
    title: options.title,
    path: options.path,
    ...(options.imageUrl ? { imageUrl: options.imageUrl } : {}),
  }))

  onShareTimeline(() => ({
    title: options.timelineTitle || options.title,
    query: options.timelineQuery || '',
    ...(options.imageUrl ? { imageUrl: options.imageUrl } : {}),
  }))
  // #endif
}
