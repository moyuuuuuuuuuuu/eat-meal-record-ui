import { defineStore } from 'pinia';
import type { UserInfo, GoalSettings } from '@/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      name: '食刻用户',
      age: 25,
      gender: '男',
      height: 170,
      weight: 65
    } as UserInfo,
    goalSettings: {
      dailyCalories: 1800,
      protein: 90,
      carbs: 200,
      fat: 60,
      targetWeight: 60,
      goal: 'lose'
    } as GoalSettings
  }),

  getters: {
    // 计算BMI
    bmi: (state): number => {
      if (state.userInfo.height <= 0) return 0;
      const heightM = state.userInfo.height / 100;
      return Number((state.userInfo.weight / (heightM * heightM)).toFixed(1));
    },

    // BMI状态
    bmiStatus: (state): string => {
      const bmi = state.userInfo.height > 0
        ? state.userInfo.weight / ((state.userInfo.height / 100) ** 2)
        : 0;

      if (bmi < 18.5) return '偏瘦';
      if (bmi < 24) return '正常';
      if (bmi < 28) return '偏胖';
      return '肥胖';
    },

    // 距离目标体重
    weightDiff: (state): number => {
      return Number((state.userInfo.weight - state.goalSettings.targetWeight).toFixed(1));
    },

    // 计算基础代谢率 (BMR)
    bmr: (state): number => {
      const { weight, height, age, gender } = state.userInfo;
      if (weight <= 0 || height <= 0 || age <= 0) return 0;

      if (gender === '男') {
        return Math.round(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age));
      } else {
        return Math.round(447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age));
      }
    },

    // 计算每日总能量消耗 (TDEE)
    tdee: (state): number => {
      const bmr = state.userInfo.height > 0
        ? (state.userInfo.gender === '男'
            ? 88.362 + (13.397 * state.userInfo.weight) + (4.799 * state.userInfo.height) - (5.677 * state.userInfo.age)
            : 447.593 + (9.247 * state.userInfo.weight) + (3.098 * state.userInfo.height) - (4.330 * state.userInfo.age))
        : 0;

      // 假设轻度活动系数 1.375
      return Math.round(bmr * 1.375);
    },

    // 推荐卡路里目标
    recommendedCalories: (state): number => {
      const tdee = state.tdee;
      const goal = state.goalSettings.goal;

      if (goal === 'lose') {
        return tdee - 400; // 减脂
      } else if (goal === 'gain') {
        return tdee + 400; // 增肌
      } else {
        return tdee; // 保持
      }
    },

    // 推荐营养素分配
    recommendedNutrients: (state): { protein: number; carbs: number; fat: number } => {
      const calories = state.goalSettings.dailyCalories;

      // 蛋白质: 25-30%, 碳水: 40-50%, 脂肪: 20-30%
      return {
        protein: Math.round((calories * 0.27) / 4),
        carbs: Math.round((calories * 0.45) / 4),
        fat: Math.round((calories * 0.28) / 9)
      };
    }
  },

  actions: {
    updateUserInfo(info: Partial<UserInfo>) {
      this.userInfo = { ...this.userInfo, ...info };
      uni.setStorageSync('userInfo', this.userInfo);
    },

    updateGoalSettings(settings: Partial<GoalSettings>) {
      this.goalSettings = { ...this.goalSettings, ...settings };
      uni.setStorageSync('goalSettings', this.goalSettings);
    },

    // 使用推荐值
    useRecommendedGoals() {
      this.goalSettings.dailyCalories = this.recommendedCalories;
      const nutrients = this.recommendedNutrients;
      this.goalSettings.protein = nutrients.protein;
      this.goalSettings.carbs = nutrients.carbs;
      this.goalSettings.fat = nutrients.fat;
      uni.setStorageSync('goalSettings', this.goalSettings);

      uni.showToast({
        title: '已使用推荐值',
        icon: 'success'
      });
    },

    loadFromStorage() {
      const userInfo = uni.getStorageSync('userInfo');
      const goalSettings = uni.getStorageSync('goalSettings');

      if (userInfo) {
        this.userInfo = userInfo;
      }
      if (goalSettings) {
        this.goalSettings = goalSettings;
      }
    }
  }
});
