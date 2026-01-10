import { defineStore } from 'pinia';
import type { MealRecord, DailyNutrition, FoodItem } from '@/types';

export const useMealStore = defineStore('meal', {
  state: () => ({
    meals: [] as MealRecord[],
    todayNutrition: {
      date: '',
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      meals: [] as MealRecord[]
    } as DailyNutrition,
    // 模拟数据 - 用于演示
    mockMeals: [
      {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        time: '08:00',
        mealType: '早餐',
        items: [
          { id: '1', name: '全麦面包', amount: 2, unit: '片', calories: 180, protein: 8, fat: 2, carbs: 32 },
          { id: '2', name: '煮鸡蛋', amount: 1, unit: '个', calories: 78, protein: 6, fat: 5, carbs: 1 },
          { id: '3', name: '牛奶', amount: 250, unit: 'ml', calories: 150, protein: 8, fat: 8, carbs: 12 }
        ],
        totalCalories: 408,
        totalProtein: 22,
        totalCarbs: 45,
        totalFat: 15
      },
      {
        id: '2',
        date: new Date().toISOString().split('T')[0],
        time: '12:30',
        mealType: '午餐',
        items: [
          { id: '4', name: '糙米饭', amount: 150, unit: 'g', calories: 180, protein: 4, fat: 1, carbs: 38 },
          { id: '5', name: '鸡胸肉', amount: 120, unit: 'g', calories: 165, protein: 31, fat: 4, carbs: 0 },
          { id: '6', name: '西兰花', amount: 100, unit: 'g', calories: 34, protein: 3, fat: 0, carbs: 7 }
        ],
        totalCalories: 379,
        totalProtein: 38,
        totalCarbs: 45,
        totalFat: 5
      },
      {
        id: '3',
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        mealType: '晚餐',
        items: [
          { id: '7', name: '蒸红薯', amount: 150, unit: 'g', calories: 130, protein: 2, fat: 0, carbs: 30 },
          { id: '8', name: '三文鱼', amount: 100, unit: 'g', calories: 206, protein: 22, fat: 13, carbs: 0 }
        ],
        totalCalories: 336,
        totalProtein: 24,
        totalCarbs: 30,
        totalFat: 13
      }
    ] as MealRecord[]
  }),

  getters: {
    todayMeals: (state): MealRecord[] => {
      const today = new Date().toISOString().split('T')[0];
      // 返回模拟数据或实际数据
      const realMeals = state.meals.filter(meal => meal.date === today);
      return realMeals.length > 0 ? realMeals : state.mockMeals;
    },

    getMealsByDate: (state) => {
      return (date: string): MealRecord[] => {
        const realMeals = state.meals.filter(meal => meal.date === date);
        return realMeals.length > 0 ? realMeals :
               date === new Date().toISOString().split('T')[0] ? state.mockMeals : [];
      };
    }
  },

  actions: {
    addMeal(meal: MealRecord) {
      this.meals.push(meal);
      this.updateTodayNutrition();
      uni.setStorageSync('meals', this.meals);

      uni.showToast({
        title: '添加成功',
        icon: 'success'
      });
    },

    deleteMeal(id: string) {
      this.meals = this.meals.filter(meal => meal.id !== id);
      this.updateTodayNutrition();
      uni.setStorageSync('meals', this.meals);

      uni.showToast({
        title: '删除成功',
        icon: 'success'
      });
    },

    deleteFood(mealId: string, foodId: string) {
      const meal = this.meals.find(m => m.id === mealId);
      if (meal) {
        meal.items = meal.items.filter(item => item.id !== foodId);
        // 重新计算总计
        meal.totalCalories = meal.items.reduce((sum, item) => sum + item.calories, 0);
        meal.totalProtein = meal.items.reduce((sum, item) => sum + item.protein, 0);
        meal.totalCarbs = meal.items.reduce((sum, item) => sum + item.carbs, 0);
        meal.totalFat = meal.items.reduce((sum, item) => sum + item.fat, 0);

        this.updateTodayNutrition();
        uni.setStorageSync('meals', this.meals);
      }
    },

    updateTodayNutrition() {
      const today = new Date().toISOString().split('T')[0];
      const todayMeals = this.meals.filter(meal => meal.date === today);

      // 如果没有数据，使用模拟数据
      const mealsToUse = todayMeals.length > 0 ? todayMeals : this.mockMeals;

      this.todayNutrition = {
        date: today,
        totalCalories: mealsToUse.reduce((sum, m) => sum + m.totalCalories, 0),
        totalProtein: mealsToUse.reduce((sum, m) => sum + m.totalProtein, 0),
        totalCarbs: mealsToUse.reduce((sum, m) => sum + m.totalCarbs, 0),
        totalFat: mealsToUse.reduce((sum, m) => sum + m.totalFat, 0),
        meals: mealsToUse
      };
    },

    loadFromStorage() {
      const meals = uni.getStorageSync('meals');
      if (meals) {
        this.meals = meals;
        this.updateTodayNutrition();
      } else {
        // 初始化模拟数据
        this.updateTodayNutrition();
      }
    },

    // 获取历史日期列表
    getHistoryDates(days: number = 7): string[] {
      const dates: string[] = [];
      const today = new Date();

      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }

      return dates;
    }
  }
});
