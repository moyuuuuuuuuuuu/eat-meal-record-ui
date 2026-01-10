import { Trash2 } from 'lucide-react';

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

interface MealRecordProps {
  mealType: '早餐' | '午餐' | '晚餐' | '加餐';
  foods: FoodItem[];
  onDeleteFood: (foodId: string) => void;
}

export function MealRecord({ mealType, foods, onDeleteFood }: MealRecordProps) {
  if (foods.length === 0) return null;

  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = foods.reduce((sum, food) => sum + food.protein, 0);
  const totalFat = foods.reduce((sum, food) => sum + food.fat, 0);
  const totalCarbs = foods.reduce((sum, food) => sum + food.carbs, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mb-4 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{mealType}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          共 {totalCalories} kcal
        </div>
      </div>

      <div className="space-y-3">
        {foods.map((food) => (
          <div
            key={food.id}
            className="flex items-start justify-between border-l-4 border-emerald-500 dark:border-emerald-600 pl-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-900 dark:text-gray-100">{food.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {food.amount}{food.unit}
                </span>
              </div>
              <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                <span>热量: {food.calories}kcal</span>
                <span>蛋白质: {food.protein}g</span>
                <span>脂肪: {food.fat}g</span>
                <span>碳水: {food.carbs}g</span>
              </div>
            </div>
            <button
              onClick={() => onDeleteFood(food.id)}
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {foods.length > 1 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex gap-4 text-xs text-gray-600 dark:text-gray-400">
          <span>蛋白质: {totalProtein.toFixed(1)}g</span>
          <span>脂肪: {totalFat.toFixed(1)}g</span>
          <span>碳水: {totalCarbs.toFixed(1)}g</span>
        </div>
      )}
    </div>
  );
}