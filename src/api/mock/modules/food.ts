import { defineMock } from '@alova/mock'

// 食物数据库 - 丰富的中国常见食物
const foodDatabase = [
  // 主食类
  { id: 'f001', name: '燕麦粥', category: '主食', unit: '100g', calories: 68, protein: 2.4, fat: 1.4, carbs: 12, fiber: 1.7 },
  { id: 'f002', name: '全麦面包', category: '主食', unit: '1片', calories: 90, protein: 3.5, fat: 1.2, carbs: 17, fiber: 2.0 },
  { id: 'f003', name: '糙米饭', category: '主食', unit: '100g', calories: 111, protein: 2.6, fat: 0.9, carbs: 23, fiber: 1.8 },
  { id: 'f004', name: '白米饭', category: '主食', unit: '100g', calories: 116, protein: 2.6, fat: 0.3, carbs: 25.9, fiber: 0.3 },
  { id: 'f005', name: '馒头', category: '主食', unit: '1个', calories: 221, protein: 7.0, fat: 1.1, carbs: 44.2, fiber: 1.3 },
  { id: 'f006', name: '红薯', category: '主食', unit: '100g', calories: 86, protein: 1.6, fat: 0.1, carbs: 20.1, fiber: 3.0 },
  { id: 'f007', name: '玉米', category: '主食', unit: '1根', calories: 112, protein: 4.0, fat: 1.2, carbs: 22.8, fiber: 2.7 },
  { id: 'f008', name: '紫薯', category: '主食', unit: '100g', calories: 82, protein: 1.6, fat: 0.2, carbs: 18.7, fiber: 2.2 },

  // 蛋白质类
  { id: 'f009', name: '煮鸡蛋', category: '蛋白质', unit: '1个', calories: 78, protein: 6.3, fat: 5.3, carbs: 0.6, fiber: 0 },
  { id: 'f010', name: '鸡胸肉', category: '蛋白质', unit: '100g', calories: 133, protein: 24, fat: 5, carbs: 0, fiber: 0 },
  { id: 'f011', name: '三文鱼', category: '蛋白质', unit: '100g', calories: 206, protein: 20, fat: 13, carbs: 0, fiber: 0 },
  { id: 'f012', name: '牛肉(瘦)', category: '蛋白质', unit: '100g', calories: 106, protein: 20.2, fat: 2.3, carbs: 1.2, fiber: 0 },
  { id: 'f013', name: '虾仁', category: '蛋白质', unit: '100g', calories: 85, protein: 18.6, fat: 0.8, carbs: 0.2, fiber: 0 },
  { id: 'f014', name: '豆腐', category: '蛋白质', unit: '100g', calories: 81, protein: 8.1, fat: 3.7, carbs: 4.2, fiber: 0.4 },
  { id: 'f015', name: '鸡腿肉', category: '蛋白质', unit: '100g', calories: 181, protein: 16, fat: 13, carbs: 0, fiber: 0 },
  { id: 'f016', name: '猪里脊', category: '蛋白质', unit: '100g', calories: 155, protein: 20.2, fat: 7.9, carbs: 1.5, fiber: 0 },

  // 蔬菜类
  { id: 'f017', name: '西兰花', category: '蔬菜', unit: '100g', calories: 34, protein: 2.8, fat: 0.4, carbs: 6.6, fiber: 2.6 },
  { id: 'f018', name: '菠菜', category: '蔬菜', unit: '100g', calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2 },
  { id: 'f019', name: '番茄', category: '蔬菜', unit: '1个', calories: 22, protein: 1.1, fat: 0.2, carbs: 4.8, fiber: 1.2 },
  { id: 'f020', name: '黄瓜', category: '蔬菜', unit: '1根', calories: 15, protein: 0.7, fat: 0.1, carbs: 3.6, fiber: 0.5 },
  { id: 'f021', name: '生菜', category: '蔬菜', unit: '100g', calories: 15, protein: 1.4, fat: 0.2, carbs: 2.9, fiber: 1.3 },
  { id: 'f022', name: '胡萝卜', category: '蔬菜', unit: '1根', calories: 41, protein: 0.9, fat: 0.2, carbs: 9.6, fiber: 2.8 },

  // 水果类
  { id: 'f023', name: '苹果', category: '水果', unit: '1个', calories: 52, protein: 0.3, fat: 0.2, carbs: 14, fiber: 2.4 },
  { id: 'f024', name: '香蕉', category: '水果', unit: '1根', calories: 89, protein: 1.1, fat: 0.3, carbs: 22.8, fiber: 2.6 },
  { id: 'f025', name: '蓝莓', category: '水果', unit: '100g', calories: 57, protein: 0.7, fat: 0.3, carbs: 14.5, fiber: 2.4 },
  { id: 'f026', name: '橙子', category: '水果', unit: '1个', calories: 47, protein: 0.9, fat: 0.1, carbs: 11.8, fiber: 2.4 },
  { id: 'f027', name: '猕猴桃', category: '水果', unit: '1个', calories: 61, protein: 1.1, fat: 0.5, carbs: 14.7, fiber: 3.0 },

  // 乳制品
  { id: 'f028', name: '牛奶', category: '乳制品', unit: '100ml', calories: 60, protein: 3.2, fat: 3.4, carbs: 4.8, fiber: 0 },
  { id: 'f029', name: '希腊酸奶', category: '乳制品', unit: '100g', calories: 97, protein: 9, fat: 5, carbs: 3.6, fiber: 0 },
  { id: 'f030', name: '脱脂牛奶', category: '乳制品', unit: '100ml', calories: 34, protein: 3.4, fat: 0.1, carbs: 5, fiber: 0 },

  // 坚果类
  { id: 'f031', name: '杏仁', category: '坚果', unit: '10颗', calories: 69, protein: 2.5, fat: 6, carbs: 2.5, fiber: 1.2 },
  { id: 'f032', name: '核桃', category: '坚果', unit: '3个', calories: 98, protein: 2.3, fat: 9.2, carbs: 2.1, fiber: 1.0 },
  { id: 'f033', name: '腰果', category: '坚果', unit: '10颗', calories: 87, protein: 2.7, fat: 7, carbs: 4.6, fiber: 0.5 },

  // 饮品
  { id: 'f034', name: '豆浆(无糖)', category: '饮品', unit: '250ml', calories: 40, protein: 3.3, fat: 1.6, carbs: 2.9, fiber: 1.1 },
  { id: 'f035', name: '黑咖啡', category: '饮品', unit: '1杯', calories: 2, protein: 0.3, fat: 0, carbs: 0, fiber: 0 },
  { id: 'f036', name: '绿茶', category: '饮品', unit: '1杯', calories: 2, protein: 0.5, fat: 0, carbs: 0, fiber: 0 },
]

// 获取所有分类
const categories = [...new Set(foodDatabase.map(f => f.category))]

export default defineMock({
  // 获取食物列表（支持搜索和分类筛选）
  '[GET]/api/v3/food/list': ({ query }) => {
    const keyword = (query.keyword as string) || ''
    const category = (query.category as string) || ''
    const page = Number.parseInt(query.page as string) || 1
    const pageSize = Number.parseInt(query.pageSize as string) || 20

    let filtered = [...foodDatabase]

    if (keyword) {
      filtered = filtered.filter(f =>
        f.name.includes(keyword) || f.category.includes(keyword),
      )
    }

    if (category) {
      filtered = filtered.filter(f => f.category === category)
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = filtered.slice(start, end)

    return {
      code: 200,
      message: 'success',
      data: {
        list,
        total: filtered.length,
        page,
        pageSize,
        hasMore: end < filtered.length,
        categories,
      },
    }
  },

  // AI 拍照识别食物
  '[POST]/api/v3/food/recognize': () => {
    // 模拟 AI 识别结果，随机返回 3~5 个食物
    const count = 3 + Math.floor(Math.random() * 3)
    const indices = new Set<number>()
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * foodDatabase.length))
    }
    const recognized = [...indices].map(i => ({
      ...foodDatabase[i],
      confidence: Math.round((0.85 + Math.random() * 0.14) * 100), // 85%~99%
    }))

    return {
      code: 200,
      message: 'success',
      data: recognized,
    }
  },

  // 获取食物详情
  '[GET]/api/v3/food/detail': ({ query }) => {
    const id = query.id as string
    const food = foodDatabase.find(f => f.id === id)

    if (!food) {
      return {
        code: 404,
        message: '食物未找到',
        data: null,
      }
    }

    return {
      code: 200,
      message: 'success',
      data: food,
    }
  },

  // 获取食物分类列表
  '[GET]/api/v3/food/categories': () => {
    const categoryStats = categories.map(cat => ({
      name: cat,
      count: foodDatabase.filter(f => f.category === cat).length,
    }))

    return {
      code: 200,
      message: 'success',
      data: categoryStats,
    }
  },
}, true)
