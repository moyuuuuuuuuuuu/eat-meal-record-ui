import { defineMock } from '@alova/mock'

// Daily nutritional goals
const dailyGoal = {
  calories: 2000,
  protein: 150,
  fat: 60,
  carbs: 250,
}

// Initial meal records
const meals: Record<string, any[]> = {
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

export default defineMock({
  // Get diary summary (goals, intake stats, burned calories)
  '[GET]/api/v3/diary/summary': () => {
    // Calculate total intake dynamically
    const allFoods = Object.values(meals).flat()
    const totalIntake = allFoods.reduce((acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      fat: acc.fat + f.fat,
      carbs: acc.carbs + f.carbs,
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 })

    return {
      code: 200,
      data: {
        dailyGoal,
        totalIntake,
        burnedCalories,
      },
      message: 'ok',
    }
  },

  // Get meal records for a specific date (currently returns same static data)
  '[GET]/api/v3/diary/meals': ({ _query }: any) => {
    return {
      code: 200,
      data: meals,
      message: 'ok',
    }
  },

  // Add a food item to a meal
  '[POST]/api/v3/diary/meal/add': ({ data }: any) => {
    const { type, food } = data
    if (!meals[type]) {
      meals[type] = []
    }
    // Simulate adding id
    const newFood = { ...food, id: String(Date.now()) }
    meals[type].push(newFood)
    return {
      code: 200,
      data: newFood,
      message: 'Food added successfully',
    }
  },

  // Delete a food item
  '[DELETE]/api/v3/diary/meal/food': ({ query }: any) => {
    const { id } = query
    let found = false
    Object.keys(meals).forEach((type) => {
      const initialLength = meals[type].length
      meals[type] = meals[type].filter(f => f.id !== id)
      if (meals[type].length < initialLength)
        found = true
    })

    if (found) {
      return {
        code: 200,
        message: 'Food deleted successfully',
      }
    }
    return {
      code: 404,
      message: 'Food not found',
    }
  },
}, true)
