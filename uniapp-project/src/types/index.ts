// 用户信息
export interface UserInfo {
  name: string;
  age: number;
  gender: '男' | '女';
  height: number; // cm
  weight: number; // kg
  avatar?: string;
}

// 目标设置
export interface GoalSettings {
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  targetWeight: number;
  goal: 'lose' | 'maintain' | 'gain';
}

// 食物项
export interface FoodItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

// 餐食记录
export interface MealRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  mealType: '早餐' | '午餐' | '晚餐' | '加餐';
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  note?: string;
}

// 动态帖子
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  images?: string[];
  topics: string[];
  mealReference?: {
    mealType: string[];
    items: string[][];
    totalCalories: number;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
}

// 主题
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
}

// 每日营养汇总
export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: MealRecord[];
}

// 食物数据库项
export interface FoodDatabaseItem {
  name: string;
  unit: string;
  defaultAmount: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbsPer100g: number;
}

// 食物分类
export interface FoodCategory {
  name: string;
  foods: FoodDatabaseItem[];
}

// 识别结果
export interface RecognitionResult {
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

// 页面导航参数
export interface AddMealPageParams {
  mealType?: '早餐' | '午餐' | '晚餐' | '加餐';
}

export interface FoodSelectorCallback {
  (food: {
    name: string;
    amount: number;
    unit: string;
    totalCalories: number;
    totalProtein: number;
    totalFat: number;
    totalCarbs: number;
  }): void;
}
