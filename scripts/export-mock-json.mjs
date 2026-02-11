/**
 * 导出所有 mock 数据为 JSON 文件
 * 用法: node scripts/export-mock-json.mjs
 * 输出目录: mock-json/
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.resolve(__dirname, '..', 'mock-json')

// ========== 工具函数（复刻 generators.ts）==========
const g = {
  id: () => Math.floor(Math.random() * 10000),
  name: (prefix = '名称') => `${prefix}_${Math.floor(Math.random() * 1000)}`,
  code: (prefix = 'CODE') => `${prefix}_${Math.floor(Math.random() * 1000)}`,
  datetime: (dayOffset = 0) => {
    const d = new Date()
    if (dayOffset)
      d.setDate(d.getDate() + dayOffset)
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  },
  date: (dayOffset = 0) => g.datetime(dayOffset).split(' ')[0],
  boolean: () => Math.random() > 0.5,
  number: (min = 0, max = 100) => Math.floor(Math.random() * (max - min)) + min,
  array: (gen, len = 10) => Array.from({ length: len }, (_, i) => gen(i)),
}

// ========== diary 模块 ==========
const dailyGoal = { calories: 2000, protein: 150, fat: 60, carbs: 250 }
const meals = {
  早餐: [
    { id: '1', name: '全麦面包', amount: 2, unit: '片', calories: 180, protein: 8, fat: 2, carbs: 32 },
    { id: '2', name: '煮鸡蛋', amount: 1, unit: '个', calories: 78, protein: 6, fat: 5, carbs: 1 },
  ],
  午餐: [
    { id: '4', name: '糙米饭', amount: 150, unit: 'g', calories: 180, protein: 4, fat: 1, carbs: 38 },
    { id: '5', name: '鸡胸肉', amount: 120, unit: 'g', calories: 165, protein: 31, fat: 4, carbs: 0 },
  ],
  晚餐: [
    { id: '6', name: '煎三文鱼', amount: 100, unit: 'g', calories: 208, protein: 20, fat: 13, carbs: 0 },
    { id: '7', name: '水煮西兰花', amount: 150, unit: 'g', calories: 50, protein: 4, fat: 0, carbs: 10 },
  ],
  加餐: [
    { id: '8', name: '希腊酸奶', amount: 1, unit: '杯', calories: 100, protein: 10, fat: 0, carbs: 15 },
  ],
}
const burnedCalories = 350

function getDiarySummary() {
  const allFoods = Object.values(meals).flat()
  const totalIntake = allFoods.reduce((acc, f) => ({
    calories: acc.calories + f.calories,
    protein: acc.protein + f.protein,
    fat: acc.fat + f.fat,
    carbs: acc.carbs + f.carbs,
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 })
  return { code: 200, data: { dailyGoal, totalIntake, burnedCalories }, message: 'ok' }
}

function getDiaryMeals() {
  return { code: 200, data: meals, message: 'ok' }
}

function postDiaryMealAdd() {
  const newFood = { id: String(Date.now()), name: '示例食物', amount: 100, unit: 'g', calories: 200, protein: 15, fat: 5, carbs: 30 }
  return { code: 200, data: newFood, message: 'Food added successfully' }
}

function deleteDiaryMealFood() {
  return { code: 200, message: 'Food deleted successfully' }
}

// ========== feed 模块 ==========
const mealTypes = ['早餐', '午餐', '晚餐', '加餐']
const mealFoods = {
  早餐: { foods: ['全麦面包+牛奶', '燕麦粥+水果', '鸡蛋三明治', '豆浆+油条'], caloriesRange: [250, 450] },
  午餐: { foods: ['糙米饭+鸡胸肉+西兰花', '牛肉面', '鸡肉沙拉', '三文鱼便当'], caloriesRange: [500, 800] },
  晚餐: { foods: ['清蒸鱼+蔬菜', '番茄牛腩+米饭', '鸡胸肉配藜麦', '虾仁蔬菜汤'], caloriesRange: [400, 700] },
  加餐: { foods: ['希腊酸奶', '坚果拼盘', '蛋白棒', '水果沙拉'], caloriesRange: [100, 250] },
}
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
  '学会了看营养标签，才发现很多"健康食品"其实热量很高 🏷️',
  '和朋友一起做了健康版火锅，清汤底+大量蔬菜，太满足了 🍲',
  '打卡100天！感谢这个社区的陪伴，一起加油！🎉',
  '今天的蛋白质摄入超标了一点，但都是优质蛋白，问题不大 💪',
]
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
const topicSets = [
  ['#健康饮食', '#减脂餐'],
  ['#增肌食谱', '#高蛋白'],
  ['#低碳水', '#生酮饮食'],
  ['#轻食主义', '#卡路里控制'],
  ['#备餐日记', '#健康生活'],
]

function generateFeed(id) {
  const feedId = id || g.id()
  const hasMealRef = feedId % 3 !== 0
  const hasLocation = feedId % 2 === 0
  const mealType = mealTypes[feedId % mealTypes.length]
  const mealInfo = mealFoods[mealType]
  const loc = locations[feedId % locations.length]
  return {
    id: feedId,
    content: feedContents[(feedId - 1) % feedContents.length],
    imageUrl: `https://picsum.photos/300/200?random=${g.number(1, 1000)}`,
    createTime: g.datetime(),
    userId: g.id(),
    userName: g.name('用户'),
    userAvatar: `https://i.pravatar.cc/150?u=${g.number(1, 1000)}`,
    likeCount: g.number(0, 100),
    commentCount: g.number(0, 50),
    mealReference: hasMealRef
      ? {
          mealType,
          foods: mealInfo.foods[feedId % mealInfo.foods.length],
          totalCalories: g.number(mealInfo.caloriesRange[0], mealInfo.caloriesRange[1]),
        }
      : null,
    location: hasLocation
      ? {
          name: loc.name,
          latitude: loc.lat + (Math.random() - 0.5) * 0.02,
          longitude: loc.lng + (Math.random() - 0.5) * 0.02,
        }
      : null,
  }
}

const mockFeeds = g.array(i => generateFeed(i + 1), 20)

function getFeedList() {
  return {
    code: 200,
    message: 'success',
    data: { list: mockFeeds.slice(0, 10), total: mockFeeds.length, page: 1, pageSize: 10, hasMore: true },
  }
}

function getFeedDetail() {
  return { code: 200, message: 'success', data: mockFeeds[0] }
}

function getFeedPosts() {
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
}

function postFeedLike() {
  return { code: 200, message: 'success', data: { isLiked: true, likes: 1 } }
}

// ========== pet 模块 ==========
const PET_CATEGORIES = [
  { id: 1, name: 'Dogs' },
  { id: 2, name: 'Cats' },
  { id: 3, name: 'Birds' },
  { id: 4, name: 'Fish' },
  { id: 5, name: 'Reptiles' },
]
const PET_TAGS = [
  { id: 1, name: 'friendly' },
  { id: 2, name: 'playful' },
  { id: 3, name: 'calm' },
  { id: 4, name: 'energetic' },
  { id: 5, name: 'trained' },
  { id: 6, name: 'house-trained' },
]
const PET_STATUS = ['available', 'pending', 'sold']

function generatePet(id, status) {
  const petId = id || g.number(1, 10000)
  return {
    id: petId,
    category: PET_CATEGORIES[g.number(0, PET_CATEGORIES.length - 1)],
    name: g.name('Pet'),
    photoUrls: g.array(i => `https://example.com/pet/${petId}/photo${i + 1}.jpg`, g.number(1, 3)),
    tags: g.array(() => PET_TAGS[g.number(0, PET_TAGS.length - 1)], g.number(1, 3)),
    status: status || PET_STATUS[g.number(0, PET_STATUS.length - 1)],
  }
}

function postPetUploadImage() {
  return { code: 200, type: 'success', message: 'Image uploaded successfully for pet 1', data: { petId: '1', imageUrl: `https://example.com/pet/1/uploaded-${Date.now()}.jpg` } }
}
function postPet() {
  return { ...generatePet(g.number(10001, 20000)), id: g.number(10001, 20000) }
}
function putPet() {
  return { ...generatePet(1), updatedAt: g.datetime() }
}
function getPetFindByStatus() {
  return g.array(i => generatePet(undefined, PET_STATUS[i % PET_STATUS.length]), 10)
}
function getPetById() {
  return generatePet(1)
}
function postPetById() {
  return { ...generatePet(1), updatedAt: g.datetime() }
}
function deletePetById() {
  return { code: 200, message: 'Pet 1 deleted successfully' }
}

// ========== store 模块 ==========
const ORDER_STATUS = ['placed', 'approved', 'delivered']

function generateOrder(id, status) {
  const orderId = id || g.number(1, 10000)
  return {
    id: orderId,
    petId: g.number(1, 1000),
    quantity: g.number(1, 10),
    shipDate: g.datetime(g.number(1, 30)),
    status: status || ORDER_STATUS[g.number(0, ORDER_STATUS.length - 1)],
    complete: g.boolean(),
  }
}

function getStoreInventory() {
  return {
    placed: g.number(0, 100),
    approved: g.number(0, 100),
    delivered: g.number(0, 100),
    pending: g.number(0, 50),
    sold: g.number(0, 200),
    available: g.number(10, 300),
  }
}
function postStoreOrder() {
  return { id: g.number(10001, 20000), petId: 1, quantity: 2, shipDate: g.datetime(g.number(1, 7)), status: 'placed', complete: false }
}
function getStoreOrderById() {
  return generateOrder(1)
}
function deleteStoreOrderById() {
  return { code: 200, message: 'Order 1 deleted successfully' }
}

// ========== user 模块 ==========
function generateUser(username, status) {
  const base = username || g.name('user').toLowerCase()
  return {
    id: g.number(1, 10000),
    username: base,
    firstName: g.name('First'),
    lastName: g.name('Last'),
    email: `${base}@example.com`,
    password: 'password123',
    phone: `1${g.number(1000000000, 9999999999)}`,
    userStatus: status ?? g.number(0, 2),
  }
}

function getUserStats() {
  return {
    code: 200,
    message: 'success',
    data: {
      name: '健康达人',
      joinDays: g.number(1, 365),
      totalRecords: g.number(1, 300),
      avgCalories: g.number(1500, 2500),
      currentWeight: g.number(50, 90),
      targetWeight: g.number(45, 85),
      height: g.number(150, 190),
      age: g.number(18, 60),
      gender: Math.random() > 0.5 ? '男' : '女',
    },
  }
}
function postUserCreateWithArray() {
  return { code: 200, message: 'Successfully created 3 users' }
}
function postUserCreateWithList() {
  return { code: 200, message: 'Successfully created 3 users from list' }
}
function getUserLogin() {
  return { code: 200, message: 'logged in user session', token: `mock_token_${Date.now()}`, expiresIn: 3600, user: generateUser('admin', 1) }
}
function getUserLogout() {
  return { code: 200, message: 'ok' }
}
function getUserByName() {
  return generateUser('testuser')
}
function putUserByName() {
  return { ...generateUser('testuser'), updatedAt: g.datetime() }
}
function deleteUserByName() {
  return { code: 200, message: 'User testuser deleted successfully' }
}
function postUser() {
  return { ...generateUser('newuser'), id: g.number(20001, 30000), createdAt: g.datetime() }
}

// ========== food 模块 ==========
const foodDatabase = [
  { id: 'f001', name: '燕麦粥', category: '主食', unit: '100g', calories: 68, protein: 2.4, fat: 1.4, carbs: 12, fiber: 1.7 },
  { id: 'f002', name: '全麦面包', category: '主食', unit: '1片', calories: 90, protein: 3.5, fat: 1.2, carbs: 17, fiber: 2.0 },
  { id: 'f003', name: '糙米饭', category: '主食', unit: '100g', calories: 111, protein: 2.6, fat: 0.9, carbs: 23, fiber: 1.8 },
  { id: 'f004', name: '白米饭', category: '主食', unit: '100g', calories: 116, protein: 2.6, fat: 0.3, carbs: 25.9, fiber: 0.3 },
  { id: 'f005', name: '馒头', category: '主食', unit: '1个', calories: 221, protein: 7.0, fat: 1.1, carbs: 44.2, fiber: 1.3 },
  { id: 'f006', name: '红薯', category: '主食', unit: '100g', calories: 86, protein: 1.6, fat: 0.1, carbs: 20.1, fiber: 3.0 },
  { id: 'f007', name: '玉米', category: '主食', unit: '1根', calories: 112, protein: 4.0, fat: 1.2, carbs: 22.8, fiber: 2.7 },
  { id: 'f008', name: '紫薯', category: '主食', unit: '100g', calories: 82, protein: 1.6, fat: 0.2, carbs: 18.7, fiber: 2.2 },
  { id: 'f009', name: '煮鸡蛋', category: '蛋白质', unit: '1个', calories: 78, protein: 6.3, fat: 5.3, carbs: 0.6, fiber: 0 },
  { id: 'f010', name: '鸡胸肉', category: '蛋白质', unit: '100g', calories: 133, protein: 24, fat: 5, carbs: 0, fiber: 0 },
  { id: 'f011', name: '三文鱼', category: '蛋白质', unit: '100g', calories: 206, protein: 20, fat: 13, carbs: 0, fiber: 0 },
  { id: 'f012', name: '牛肉(瘦)', category: '蛋白质', unit: '100g', calories: 106, protein: 20.2, fat: 2.3, carbs: 1.2, fiber: 0 },
  { id: 'f013', name: '虾仁', category: '蛋白质', unit: '100g', calories: 85, protein: 18.6, fat: 0.8, carbs: 0.2, fiber: 0 },
  { id: 'f014', name: '豆腐', category: '蛋白质', unit: '100g', calories: 81, protein: 8.1, fat: 3.7, carbs: 4.2, fiber: 0.4 },
  { id: 'f015', name: '鸡腿肉', category: '蛋白质', unit: '100g', calories: 181, protein: 16, fat: 13, carbs: 0, fiber: 0 },
  { id: 'f016', name: '猪里脊', category: '蛋白质', unit: '100g', calories: 155, protein: 20.2, fat: 7.9, carbs: 1.5, fiber: 0 },
  { id: 'f017', name: '西兰花', category: '蔬菜', unit: '100g', calories: 34, protein: 2.8, fat: 0.4, carbs: 6.6, fiber: 2.6 },
  { id: 'f018', name: '菠菜', category: '蔬菜', unit: '100g', calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2 },
  { id: 'f019', name: '番茄', category: '蔬菜', unit: '1个', calories: 22, protein: 1.1, fat: 0.2, carbs: 4.8, fiber: 1.2 },
  { id: 'f020', name: '黄瓜', category: '蔬菜', unit: '1根', calories: 15, protein: 0.7, fat: 0.1, carbs: 3.6, fiber: 0.5 },
  { id: 'f021', name: '生菜', category: '蔬菜', unit: '100g', calories: 15, protein: 1.4, fat: 0.2, carbs: 2.9, fiber: 1.3 },
  { id: 'f022', name: '胡萝卜', category: '蔬菜', unit: '1根', calories: 41, protein: 0.9, fat: 0.2, carbs: 9.6, fiber: 2.8 },
  { id: 'f023', name: '苹果', category: '水果', unit: '1个', calories: 52, protein: 0.3, fat: 0.2, carbs: 14, fiber: 2.4 },
  { id: 'f024', name: '香蕉', category: '水果', unit: '1根', calories: 89, protein: 1.1, fat: 0.3, carbs: 22.8, fiber: 2.6 },
  { id: 'f025', name: '蓝莓', category: '水果', unit: '100g', calories: 57, protein: 0.7, fat: 0.3, carbs: 14.5, fiber: 2.4 },
  { id: 'f026', name: '橙子', category: '水果', unit: '1个', calories: 47, protein: 0.9, fat: 0.1, carbs: 11.8, fiber: 2.4 },
  { id: 'f027', name: '猕猴桃', category: '水果', unit: '1个', calories: 61, protein: 1.1, fat: 0.5, carbs: 14.7, fiber: 3.0 },
  { id: 'f028', name: '牛奶', category: '乳制品', unit: '100ml', calories: 60, protein: 3.2, fat: 3.4, carbs: 4.8, fiber: 0 },
  { id: 'f029', name: '希腊酸奶', category: '乳制品', unit: '100g', calories: 97, protein: 9, fat: 5, carbs: 3.6, fiber: 0 },
  { id: 'f030', name: '脱脂牛奶', category: '乳制品', unit: '100ml', calories: 34, protein: 3.4, fat: 0.1, carbs: 5, fiber: 0 },
  { id: 'f031', name: '杏仁', category: '坚果', unit: '10颗', calories: 69, protein: 2.5, fat: 6, carbs: 2.5, fiber: 1.2 },
  { id: 'f032', name: '核桃', category: '坚果', unit: '3个', calories: 98, protein: 2.3, fat: 9.2, carbs: 2.1, fiber: 1.0 },
  { id: 'f033', name: '腰果', category: '坚果', unit: '10颗', calories: 87, protein: 2.7, fat: 7, carbs: 4.6, fiber: 0.5 },
  { id: 'f034', name: '豆浆(无糖)', category: '饮品', unit: '250ml', calories: 40, protein: 3.3, fat: 1.6, carbs: 2.9, fiber: 1.1 },
  { id: 'f035', name: '黑咖啡', category: '饮品', unit: '1杯', calories: 2, protein: 0.3, fat: 0, carbs: 0, fiber: 0 },
  { id: 'f036', name: '绿茶', category: '饮品', unit: '1杯', calories: 2, protein: 0.5, fat: 0, carbs: 0, fiber: 0 },
]
const foodCategories = [...new Set(foodDatabase.map(f => f.category))]

function getFoodList() {
  return {
    code: 200,
    message: 'success',
    data: {
      list: foodDatabase,
      total: foodDatabase.length,
      page: 1,
      pageSize: 36,
      hasMore: false,
      categories: foodCategories,
    },
  }
}
function postFoodRecognize() {
  const picked = [foodDatabase[2], foodDatabase[9], foodDatabase[16], foodDatabase[8]]
  return {
    code: 200,
    message: 'success',
    data: picked.map(f => ({ ...f, confidence: g.number(85, 99) })),
  }
}
function getFoodDetail() {
  return { code: 200, message: 'success', data: foodDatabase[0] }
}
function getFoodCategories() {
  return {
    code: 200,
    message: 'success',
    data: foodCategories.map(cat => ({
      name: cat,
      count: foodDatabase.filter(f => f.category === cat).length,
    })),
  }
}

// ========== 注册所有接口 ==========
const endpoints = [
  // diary
  { method: 'GET', path: '/api/v3/diary/summary', fn: getDiarySummary },
  { method: 'GET', path: '/api/v3/diary/meals', fn: getDiaryMeals },
  { method: 'POST', path: '/api/v3/diary/meal/add', fn: postDiaryMealAdd },
  { method: 'DELETE', path: '/api/v3/diary/meal/food', fn: deleteDiaryMealFood },
  // feed
  { method: 'GET', path: '/api/v3/feed/list', fn: getFeedList },
  { method: 'GET', path: '/api/v3/feed/detail', fn: getFeedDetail },
  { method: 'GET', path: '/api/v3/feed/posts', fn: getFeedPosts },
  { method: 'POST', path: '/api/v3/feed/post/like', fn: postFeedLike },
  // food
  { method: 'GET', path: '/api/v3/food/list', fn: getFoodList },
  { method: 'POST', path: '/api/v3/food/recognize', fn: postFoodRecognize },
  { method: 'GET', path: '/api/v3/food/detail', fn: getFoodDetail },
  { method: 'GET', path: '/api/v3/food/categories', fn: getFoodCategories },
  // pet
  { method: 'POST', path: '/api/v3/pet/{petId}/uploadImage', fn: postPetUploadImage },
  { method: 'POST', path: '/api/v3/pet', fn: postPet },
  { method: 'PUT', path: '/api/v3/pet', fn: putPet },
  { method: 'GET', path: '/api/v3/pet/findByStatus', fn: getPetFindByStatus },
  { method: 'GET', path: '/api/v3/pet/{petId}', fn: getPetById },
  { method: 'POST', path: '/api/v3/pet/{petId}', fn: postPetById },
  { method: 'DELETE', path: '/api/v3/pet/{petId}', fn: deletePetById },
  // store
  { method: 'GET', path: '/api/v3/store/inventory', fn: getStoreInventory },
  { method: 'POST', path: '/api/v3/store/order', fn: postStoreOrder },
  { method: 'GET', path: '/api/v3/store/order/{orderId}', fn: getStoreOrderById },
  { method: 'DELETE', path: '/api/v3/store/order/{orderId}', fn: deleteStoreOrderById },
  // user
  { method: 'GET', path: '/api/v3/user/stats', fn: getUserStats },
  { method: 'POST', path: '/api/v3/user/createWithArray', fn: postUserCreateWithArray },
  { method: 'POST', path: '/api/v3/user/createWithList', fn: postUserCreateWithList },
  { method: 'GET', path: '/api/v3/user/login', fn: getUserLogin },
  { method: 'GET', path: '/api/v3/user/logout', fn: getUserLogout },
  { method: 'GET', path: '/api/v3/user/{username}', fn: getUserByName },
  { method: 'PUT', path: '/api/v3/user/{username}', fn: putUserByName },
  { method: 'DELETE', path: '/api/v3/user/{username}', fn: deleteUserByName },
  { method: 'POST', path: '/api/v3/user', fn: postUser },
]

// ========== 生成并写入 JSON 文件 ==========
function pathToFilename(apiPath, method) {
  // /api/v3/diary/summary + GET => api_v3_diary_summary_get.json
  const cleaned = apiPath
    .replace(/^\//, '') // 去掉开头的 /
    .replace(/\{(\w+)\}/g, '$1') // {petId} => petId
    .replace(/\//g, '_') // / => _
  return `${cleaned}_${method.toLowerCase()}.json`
}

// 确保输出目录存在
fs.mkdirSync(OUTPUT_DIR, { recursive: true })

let count = 0
for (const ep of endpoints) {
  const data = ep.fn()
  const filename = pathToFilename(ep.path, ep.method)
  const filepath = path.join(OUTPUT_DIR, filename)
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`✅ [${ep.method.padEnd(6)}] ${ep.path}  =>  ${filename}`)
  count++
}

console.log(`\n🎉 共导出 ${count} 个 JSON 文件到 ${OUTPUT_DIR}`)
