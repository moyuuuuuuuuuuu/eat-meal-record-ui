import { defineMock } from '@alova/mock'
import { generateMockData } from '../utils/generators'

// 餐食类型和对应食物
const mealTypes = ['早餐', '午餐', '晚餐', '加餐'] as const
const mealFoods: Record<string, { foods: string[], caloriesRange: [number, number] }> = {
  早餐: { foods: ['全麦面包+牛奶', '燕麦粥+水果', '鸡蛋三明治', '豆浆+油条'], caloriesRange: [250, 450] },
  午餐: { foods: ['糙米饭+鸡胸肉+西兰花', '牛肉面', '鸡肉沙拉', '三文鱼便当'], caloriesRange: [500, 800] },
  晚餐: { foods: ['清蒸鱼+蔬菜', '番茄牛腩+米饭', '鸡胸肉配藜麦', '虾仁蔬菜汤'], caloriesRange: [400, 700] },
  加餐: { foods: ['希腊酸奶', '坚果拼盘', '蛋白棒', '水果沙拉'], caloriesRange: [100, 250] },
}

// 动态文案模板
const feedContents = [
  '今天的减脂餐打卡！低碳水高蛋白，吃得饱又不胖 💪',
  '坚持健康饮食第30天，体重终于突破瓶颈期了！',
  '分享一下我的备餐心得，周末花2小时准备一周的便当 🍱',
  '这家新开的轻食店太赞了，推荐给大家！📍',
  '今日热量摄入完美控制在目标范围内，开心～ ✨',
  '自制蛋白质奶昔，口感比外面卖的还好喝！配方分享 🥤',
  '早起做了一顿丰盛的早餐，元气满满的一天开始了 ☀️',
  '晚餐吃了清蒸鲈鱼配时蔬，低脂又美味！',
  '第一次尝试生酮饮食，感觉还不错，分享一下今天的食谱',
  '运动完来一份高蛋白餐补充能量，增肌减脂两不误 🏋️',
  '在家做了一桌健康料理，家人都说比外面的好吃 👨‍🍳',
  '今天去了一家有机农场，买了新鲜的蔬菜，晚上大展身手！🥬',
  '连续一周不喝奶茶了，用水果茶代替，意外地好喝 🍵',
  '分享我的蛋白质摄入秘诀：鸡胸肉的10种做法不重样！',
  '减脂期间偶尔放纵一下也没关系，关键是整体的饮食平衡 🍕',
  '今天跑了5公里，午餐多吃了一点碳水补充糖原 🏃',
  '学会了看营养标签，才发现很多\"健康食品\"其实热量很高 🏷️',
  '和朋友一起做了健康版火锅，清汤底+大量蔬菜，太满足了 🍲',
  '打卡100天！感谢这个社区的陪伴，一起加油！🎉',
  '今天的蛋白质摄入超标了一点，但都是优质蛋白，问题不大 💪',
]

// 模拟地点名称及经纬度（中国主要城市）
const locations = [
  { name: '北京·朝阳区', lat: 39.9219, lng: 116.4435 },
  { name: '上海·静安区', lat: 31.2288, lng: 121.4518 },
  { name: '广州·天河区', lat: 23.1249, lng: 113.3613 },
  { name: '深圳·南山区', lat: 22.5333, lng: 113.9300 },
  { name: '杭州·西湖区', lat: 30.2590, lng: 120.1302 },
  { name: '成都·锦江区', lat: 30.6598, lng: 104.0839 },
  { name: '武汉·武昌区', lat: 30.5574, lng: 114.3421 },
  { name: '南京·鼓楼区', lat: 32.0660, lng: 118.7697 },
  { name: '西安·雁塔区', lat: 34.2220, lng: 108.9688 },
  { name: '长沙·岳麓区', lat: 28.1822, lng: 112.9461 },
]

// 生成动态对象
function generateFeed(id?: number) {
  const feedId = id || generateMockData.id()
  const hasMealRef = feedId % 3 !== 0 // 约 2/3 的动态带餐食引用
  const hasLocation = feedId % 2 === 0 // 约 1/2 的动态带位置

  const mealType = mealTypes[feedId % mealTypes.length]
  const mealInfo = mealFoods[mealType]
  const location = locations[feedId % locations.length]

  return {
    id: feedId,
    content: feedContents[(feedId - 1) % feedContents.length],
    imageUrl: `https://picsum.photos/300/200?random=${generateMockData.number(1, 1000)}`,
    createTime: generateMockData.datetime(),
    userId: generateMockData.id(),
    userName: generateMockData.name('用户'),
    userAvatar: `https://i.pravatar.cc/150?u=${generateMockData.number(1, 1000)}`,
    likeCount: generateMockData.number(0, 100),
    commentCount: generateMockData.number(0, 50),
    // 餐食引用
    mealReference: hasMealRef
      ? {
          mealType,
          foods: mealInfo.foods[feedId % mealInfo.foods.length],
          totalCalories: generateMockData.number(mealInfo.caloriesRange[0], mealInfo.caloriesRange[1]),
        }
      : null,
    // 位置信息
    location: hasLocation
      ? {
          name: location.name,
          latitude: location.lat + (Math.random() - 0.5) * 0.02,
          longitude: location.lng + (Math.random() - 0.5) * 0.02,
        }
      : null,
  }
}

const mockFeeds = generateMockData.array(index => generateFeed(index + 1), 20)

export default defineMock({
  // 获取动态列表
  '[GET]/api/v3/feed/list': ({ query }) => {
    console.log('[Mock] GET /feed/list', query)
    const page = Number.parseInt(query.page as string) || 1
    const pageSize = Number.parseInt(query.pageSize as string) || 10

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = mockFeeds.slice(start, end)

    return {
      code: 200,
      message: 'success',
      data: {
        list,
        total: mockFeeds.length,
        page,
        pageSize,
        hasMore: end < mockFeeds.length,
      },
    }
  },

  // 获取动态详情
  '[GET]/api/v3/feed/detail': ({ query }) => {
    console.log('[Mock] GET /feed/detail', query)
    const id = Number.parseInt(query.id as string)
    const feed = mockFeeds.find(item => item.id === id) || generateFeed(id)

    return {
      code: 200,
      message: 'success',
      data: feed,
    }
  },

  // 获取动态列表 (getPosts)
  '[GET]/api/v3/feed/posts': () => {
    const topicSets = [
      ['#健康饮食', '#减脂餐'],
      ['#增肌食谱', '#高蛋白'],
      ['#低碳水', '#生酮饮食'],
      ['#轻食主义', '#卡路里控制'],
      ['#备餐日记', '#健康生活'],
    ]
    return {
      code: 200,
      message: 'success',
      data: mockFeeds.map((f, i) => ({
        id: String(f.id),
        author: { name: f.userName, avatar: f.userAvatar },
        content: f.content,
        timestamp: f.createTime,
        likes: f.likeCount,
        comments: f.commentCount,
        isLiked: false,
        topics: topicSets[i % topicSets.length],
        mealReference: f.mealReference,
        location: f.location,
      })),
    }
  },

  // 点赞动态
  '[POST]/api/v3/feed/post/like': ({ data: _data }) => {
    return {
      code: 200,
      message: 'success',
      data: {
        isLiked: true,
        likes: 1,
      },
    }
  },
}, true)
