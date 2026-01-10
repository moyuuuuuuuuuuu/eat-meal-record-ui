import { useState } from 'react';
import { CircularProgress } from './CircularProgress';
import { NutrientBar } from './NutrientBar';
import { MealRecord, FoodItem } from './MealRecord';
import { FloatingActionButton } from './FloatingActionButton';
import { FoodSuggestion } from './FoodSuggestion';
import { Flame, TrendingUp } from 'lucide-react';

interface HomePageProps {
  onNavigateToAddMeal?: (mealType?: '早餐' | '午餐' | '晚餐' | '加餐') => void;
}

export function HomePage({ onNavigateToAddMeal }: HomePageProps) {
  // 用户每日目标
  const dailyGoal = {
    calories: 2000,
    protein: 150,
    fat: 60,
    carbs: 250,
  };

  // 模拟餐食数据
  const [meals, setMeals] = useState<{
    早餐: FoodItem[];
    午餐: FoodItem[];
    晚餐: FoodItem[];
    加餐: FoodItem[];
  }>({
    早餐: [
      {
        id: '1',
        name: '全麦面包',
        amount: 2,
        unit: '片',
        calories: 180,
        protein: 8,
        fat: 2,
        carbs: 32,
      },
      {
        id: '2',
        name: '煮鸡蛋',
        amount: 1,
        unit: '个',
        calories: 78,
        protein: 6,
        fat: 5,
        carbs: 1,
      },
      {
        id: '3',
        name: '牛奶',
        amount: 250,
        unit: 'ml',
        calories: 150,
        protein: 8,
        fat: 8,
        carbs: 12,
      },
    ],
    午餐: [
      {
        id: '4',
        name: '糙米饭',
        amount: 150,
        unit: 'g',
        calories: 180,
        protein: 4,
        fat: 1,
        carbs: 38,
      },
      {
        id: '5',
        name: '鸡胸肉',
        amount: 120,
        unit: 'g',
        calories: 165,
        protein: 31,
        fat: 4,
        carbs: 0,
      },
      {
        id: '6',
        name: '西兰花',
        amount: 100,
        unit: 'g',
        calories: 34,
        protein: 3,
        fat: 0,
        carbs: 7,
      },
    ],
    晚餐: [
      {
        id: '7',
        name: '蒸红薯',
        amount: 150,
        unit: 'g',
        calories: 130,
        protein: 2,
        fat: 0,
        carbs: 30,
      },
      {
        id: '8',
        name: '三文鱼',
        amount: 100,
        unit: 'g',
        calories: 206,
        protein: 22,
        fat: 13,
        carbs: 0,
      },
    ],
    加餐: [
      {
        id: '9',
        name: '苹果',
        amount: 1,
        unit: '个',
        calories: 95,
        protein: 0.5,
        fat: 0.3,
        carbs: 25,
      },
    ],
  });

  const [burnedCalories] = useState(350);

  // 计算总摄入
  const allFoods = [...meals.早餐, ...meals.午餐, ...meals.晚餐, ...meals.加餐];
  const totalIntake = {
    calories: allFoods.reduce((sum, food) => sum + food.calories, 0),
    protein: allFoods.reduce((sum, food) => sum + food.protein, 0),
    fat: allFoods.reduce((sum, food) => sum + food.fat, 0),
    carbs: allFoods.reduce((sum, food) => sum + food.carbs, 0),
  };

  const handleDeleteFood = (foodId: string) => {
    setMeals((prev) => ({
      早餐: prev.早餐.filter((f) => f.id !== foodId),
      午餐: prev.午餐.filter((f) => f.id !== foodId),
      晚餐: prev.晚餐.filter((f) => f.id !== foodId),
      加餐: prev.加餐.filter((f) => f.id !== foodId),
    }));
  };

  const handleAddMeal = (mealType: '早餐' | '午餐' | '晚餐' | '加餐') => {
    if (onNavigateToAddMeal) {
      onNavigateToAddMeal(mealType);
    } else {
      // 这里可以打开一个对话框来添加食物
      // 暂时只是一个演示
      alert(`点击添加${mealType}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors">
      {/* 顶部卡路里摘要 */}
      <div className="bg-white dark:bg-gray-800 px-4 py-6 shadow-sm transition-colors">
        <div className="flex items-center justify-center gap-8 mb-6">
          {/* 摄入 */}
          <div className="text-center">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-sm">摄入</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-gray-100">{totalIntake.calories}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">kcal</div>
          </div>

          {/* 环形进度条 */}
          <CircularProgress current={totalIntake.calories} total={dailyGoal.calories} />

          {/* 消耗 */}
          <div className="text-center">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">消耗</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-gray-100">{burnedCalories}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">kcal</div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          目标: {dailyGoal.calories} kcal/天
        </div>
      </div>

      {/* 营养素摘要 */}
      <div className="px-4 mt-4">
        <h2 className="text-sm text-gray-700 dark:text-gray-300 mb-3">今日营养素</h2>
        <div className="grid grid-cols-3 gap-3">
          {/* 蛋白质 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm transition-colors">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">蛋白质</div>
            <div className="mb-2">
              <div className="text-lg text-gray-900 dark:text-gray-100">{totalIntake.protein.toFixed(1)}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">/ {dailyGoal.protein}g</div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((totalIntake.protein / dailyGoal.protein) * 100, 100)}%`,
                  backgroundColor: totalIntake.protein > dailyGoal.protein ? '#ef4444' : '#3b82f6',
                }}
              />
            </div>
          </div>

          {/* 脂肪 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm transition-colors">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">脂肪</div>
            <div className="mb-2">
              <div className="text-lg text-gray-900 dark:text-gray-100">{totalIntake.fat.toFixed(1)}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">/ {dailyGoal.fat}g</div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((totalIntake.fat / dailyGoal.fat) * 100, 100)}%`,
                  backgroundColor: totalIntake.fat > dailyGoal.fat ? '#ef4444' : '#f59e0b',
                }}
              />
            </div>
          </div>

          {/* 碳水化合物 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm transition-colors">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">碳水</div>
            <div className="mb-2">
              <div className="text-lg text-gray-900 dark:text-gray-100">{totalIntake.carbs.toFixed(1)}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">/ {dailyGoal.carbs}g</div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((totalIntake.carbs / dailyGoal.carbs) * 100, 100)}%`,
                  backgroundColor: totalIntake.carbs > dailyGoal.carbs ? '#ef4444' : '#8b5cf6',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 今日吃什么 */}
      <div className="px-4 mt-4">
        <FoodSuggestion />
      </div>

      {/* 餐食记录 */}
      <div className="px-4 mt-4">
        <h2 className="text-sm text-gray-700 dark:text-gray-300 mb-3">今日餐食</h2>
        <MealRecord mealType="早餐" foods={meals.早餐} onDeleteFood={handleDeleteFood} />
        <MealRecord mealType="午餐" foods={meals.午餐} onDeleteFood={handleDeleteFood} />
        <MealRecord mealType="晚餐" foods={meals.晚餐} onDeleteFood={handleDeleteFood} />
        <MealRecord mealType="加餐" foods={meals.加餐} onDeleteFood={handleDeleteFood} />
      </div>

      {/* 悬浮添加按钮 */}
      <FloatingActionButton onSelectMeal={handleAddMeal} />
    </div>
  );
}