/**
 * 获取当前页面路径
 * @returns 当前页面路径
 */
export function getCurrentPath() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage.route || ''
}

/**
 * 判断两个 URL 是否属于同一个主域名
 * 示例：test.xxx.com 和 api.xxx.com 属于同一个主域名 xxx.com
 * @param url1 第一个 URL
 * @param url2 第二个 URL
 * @returns 是否属于同一个主域名
 */
export function isSameMainDomain(url1: string, url2: string): boolean {
  try {
    const getHost = (url: string) => {
      if (!url.startsWith('http')) {
        return ''
      }
      const match = url.match(/^https?:\/\/([^/?#]+)/i)
      return match ? match[1] : ''
    }

    const host1 = getHost(url1)
    const host2 = getHost(url2)

    if (!host1 || !host2)
      return false

    if (host1 === host2)
      return true

    const getMainDomain = (host: string) => {
      const parts = host.split('.')
      if (parts.length <= 2)
        return host
      // 简单处理：取最后两段，例如 xxx.com
      // 如果需要更复杂的 TLD 处理（如 .com.cn），可以引入专门的库，但这里按需求简单处理
      return parts.slice(-2).join('.')
    }

    return getMainDomain(host1) === getMainDomain(host2)
  }
  catch (e) {
    return false
  }
}
