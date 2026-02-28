/*
 * @Author: weisheng
 * @Date: 2023-05-20 10:00:00
 * @LastEditTime: 2025-06-26 21:59:35
 * @LastEditors: weisheng
 * @Description: 通用mock处理
 * @FilePath: /wot-starter/src/api/mock/modules/common.ts
 */
import { defineMock } from '@alova/mock'
import { generateMockData } from '../utils/generators'

export default defineMock({
  // 通用GET请求处理
  '[GET]/*': (_params: any, matchedUrl: string) => {
    console.log(`[Mock] GET ${matchedUrl}`, _params)
    if (matchedUrl.includes('/topic/hot')) {
      return generateMockData.baseResponse([
        { id: 1, title: '减肥打卡', thumb: null, description: '每日饮食打卡', join: 1200, post: 5000 },
        { id: 2, title: '健身餐', thumb: null, description: '科学健身，营养饮食', join: 800, post: 3000 },
        { id: 3, title: '减脂食谱', thumb: null, description: '好吃不胖的秘密', join: 2000, post: 8000 },
        { id: 4, title: '高蛋白饮食', thumb: null, description: '增肌必备', join: 500, post: 1500 },
      ], 200)
    }
    return generateMockData.baseResponse({
      message: `Mock response for GET ${matchedUrl}`,
      params: _params,
    })
  },

  // 通用POST请求处理
  '[POST]/*': (_params: any, matchedUrl: string) => {
    console.log(`[Mock] POST ${matchedUrl}`, _params)
    if (matchedUrl.includes('/topic/create')) {
      const { name } = _params.data || {}
      return generateMockData.baseResponse({
        id: Date.now(),
        title: name || '新话题',
        thumb: null,
        description: '用户自建话题',
        join: 0,
        post: 0,
      }, 200)
    }
    return generateMockData.baseResponse({
      message: `Mock response for POST ${matchedUrl}`,
      params: _params,
    })
  },
})
