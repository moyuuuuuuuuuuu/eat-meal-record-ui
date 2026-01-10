import { useState } from 'react';
import { ChevronLeft, Save, Plus, X } from 'lucide-react';
import { FoodSelectorPage } from './FoodSelectorPage';

interface FoodItem {
  name: string;
  quantity: number;
  selectedUnit: string;
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

interface AddMealPageProps {
  onBack: () => void;
  initialMealType?: '早餐' | '午餐' | '晚餐' | '加餐';
}

export function AddMealPage({ onBack, initialMealType }: AddMealPageProps) {
  const [mealType, setMealType] = useState(initialMealType || '早餐');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [showFoodSelector, setShowFoodSelector] = useState(false);

  const handleFoodConfirm = (food: FoodItem) => {
    setFoodItems([...foodItems, food]);
    setShowFoodSelector(false);
  };

  const removeFoodItem = (index: number) => {
    setFoodItems(foodItems.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    return foodItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.totalCalories,
        protein: acc.protein + item.totalProtein,
        fat: acc.fat + item.totalFat,
        carbs: acc.carbs + item.totalCarbs,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  };

  const totals = calculateTotals();

  const handleSave = () => {
    const meal = {
      mealType,
      items: foodItems,
      totals,
      timestamp: new Date().toISOString(),
    };
    console.log('保存餐食:', meal);
    onBack();
  };

  // 如果显示食物选择器，渲染FoodSelectorPage
  if (showFoodSelector) {
    return (
      <FoodSelectorPage
        onBack={() => setShowFoodSelector(false)}
        onConfirm={handleFoodConfirm}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 px-4 py-4 shadow-sm sticky top-0 z-10 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-lg text-gray-900 dark:text-gray-100">添加餐食</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={foodItems.length === 0}
            className="flex items-center gap-2 bg-emerald-500 dark:bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>保存</span>
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 餐次选择 - 仅在没有预设时显示 */}
        {!initialMealType && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm transition-colors">
            <h2 className="text-gray-900 dark:text-gray-100 mb-3">选择餐次</h2>
            <div className="grid grid-cols-4 gap-2">
              {['早餐', '午餐', '晚餐', '加餐'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMealType(type as typeof mealType)}
                  className={`py-2 px-3 rounded-lg transition-all ${
                    mealType === type
                      ? 'bg-emerald-500 dark:bg-emerald-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 当前餐次提示 - 仅在有预设时显示 */}
        {initialMealType && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-600"></div>
              <span className="text-gray-900 dark:text-gray-100">正在添加：</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{mealType}</span>
            </div>
          </div>
        )}

        {/* 已添加的食物 */}
        {foodItems.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-gray-900 dark:text-gray-100">已添加食物</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">{foodItems.length} 项</span>
            </div>
            <div className="space-y-2">
              {foodItems.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-900 dark:text-gray-100 font-medium">{item.name}</span>
                        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                          {item.quantity} {item.selectedUnit}
                        </span>
                      </div>
                      <div className="flex gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <span>{item.totalCalories}kcal</span>
                        <span>蛋白{item.totalProtein}g</span>
                        <span>脂肪{item.totalFat}g</span>
                        <span>碳水{item.totalCarbs}g</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFoodItem(index)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors ml-2"
                    >
                      <X className="w-4 h-4 text-red-500 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 营养汇总 */}
        {foodItems.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800 transition-colors">
            <h2 className="text-gray-900 dark:text-gray-100 mb-3 font-medium">营养汇总</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 transition-colors">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">总热量</div>
                <div className="text-2xl text-emerald-600 dark:text-emerald-400 font-semibold">{totals.calories.toFixed(0)}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">kcal</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 transition-colors">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">蛋白质</div>
                <div className="text-2xl text-blue-600 dark:text-blue-400 font-semibold">{totals.protein.toFixed(1)}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">g</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 transition-colors">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">脂肪</div>
                <div className="text-2xl text-orange-600 dark:text-orange-400 font-semibold">{totals.fat.toFixed(1)}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">g</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 transition-colors">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">碳水化合物</div>
                <div className="text-2xl text-purple-600 dark:text-purple-400 font-semibold">{totals.carbs.toFixed(1)}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">g</div>
              </div>
            </div>
          </div>
        )}

        {/* 添加食物按钮 */}
        <button
          onClick={() => setShowFoodSelector(true)}
          className="w-full bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
        >
          <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Plus className="w-6 h-6" />
            <span className="font-medium">添加食物</span>
          </div>
        </button>
      </div>
    </div>
  );
}