import { useState } from 'react';
import { Flame, TrendingUp, ChevronLeft, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MealItem {
  id: string;
  mealType: string;
  items: { name: string; amount: string; calories: number }[];
  totalCalories: number;
}

interface FeedItem {
  id: string;
  date: string;
  totalCalories: number;
  totalBurned: number;
  mealCount: number;
  meals: MealItem[];
}

interface MealHistoryPageProps {
  onBack?: () => void;
}

export function MealHistoryPage({ onBack }: MealHistoryPageProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  // 模拟历史数据
  const feedItems: FeedItem[] = [
    {
      id: '1',
      date: '2026-01-10',
      totalCalories: 1850,
      totalBurned: 420,
      mealCount: 3,
      meals: [
        {
          id: '1-1',
          mealType: '早餐',
          items: [
            { name: '燕麦粥', amount: '200g', calories: 150 },
            { name: '煮鸡蛋', amount: '1个', calories: 78 },
          ],
          totalCalories: 228,
        },
        {
          id: '1-2',
          mealType: '午餐',
          items: [
            { name: '糙米饭', amount: '150g', calories: 171 },
            { name: '鸡胸肉', amount: '120g', calories: 130 },
            { name: '西兰花', amount: '100g', calories: 34 },
          ],
          totalCalories: 335,
        },
        {
          id: '1-3',
          mealType: '晚餐',
          items: [
            { name: '蔬菜沙拉', amount: '200g', calories: 85 },
            { name: '三文鱼', amount: '150g', calories: 280 },
          ],
          totalCalories: 365,
        },
      ],
    },
    {
      id: '2',
      date: '2026-01-09',
      totalCalories: 1920,
      totalBurned: 380,
      mealCount: 4,
      meals: [
        {
          id: '2-1',
          mealType: '早餐',
          items: [
            { name: '全麦面包', amount: '2片', calories: 180 },
            { name: '牛奶', amount: '250ml', calories: 150 },
          ],
          totalCalories: 330,
        },
        {
          id: '2-2',
          mealType: '午餐',
          items: [
            { name: '藜麦', amount: '100g', calories: 120 },
            { name: '三文鱼', amount: '100g', calories: 206 },
          ],
          totalCalories: 326,
        },
        {
          id: '2-3',
          mealType: '晚餐',
          items: [
            { name: '蔬菜沙拉', amount: '200g', calories: 85 },
            { name: '鸡胸肉', amount: '100g', calories: 110 },
          ],
          totalCalories: 195,
        },
        {
          id: '2-4',
          mealType: '加餐',
          items: [
            { name: '苹果', amount: '1个', calories: 52 },
            { name: '坚果', amount: '20g', calories: 120 },
          ],
          totalCalories: 172,
        },
      ],
    },
    {
      id: '3',
      date: '2026-01-08',
      totalCalories: 2100,
      totalBurned: 450,
      mealCount: 3,
      meals: [
        {
          id: '3-1',
          mealType: '早餐',
          items: [
            { name: '水煮蛋', amount: '2个', calories: 156 },
            { name: '香蕉', amount: '1根', calories: 89 },
          ],
          totalCalories: 245,
        },
        {
          id: '3-2',
          mealType: '午餐',
          items: [
            { name: '米饭', amount: '200g', calories: 230 },
            { name: '牛排', amount: '150g', calories: 450 },
          ],
          totalCalories: 680,
        },
        {
          id: '3-3',
          mealType: '晚餐',
          items: [
            { name: '意大利面', amount: '200g', calories: 280 },
            { name: '番茄酱', amount: '50g', calories: 30 },
          ],
          totalCalories: 310,
        },
      ],
    },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  };

  const toggleExpandDay = (itemId: string) => {
    if (expandedDay === itemId) {
      setExpandedDay(null);
    } else {
      setExpandedDay(itemId);
    }
  };

  const toggleExpandMeal = (itemId: string) => {
    if (expandedMeal === itemId) {
      setExpandedMeal(null);
    } else {
      setExpandedMeal(itemId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 px-4 py-4 shadow-sm sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          )}
          <h1 className="text-lg text-gray-900 dark:text-gray-100">餐食记录</h1>
        </div>
      </div>

      {/* 动态列表 */}
      <div className="px-4 py-4 space-y-3">
        {feedItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors">
            {/* 日期卡片 - 可点击展开 */}
            <button
              onClick={() => toggleExpandDay(item.id)}
              className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 dark:text-gray-100">{formatDate(item.date)}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.mealCount}餐</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${
                    expandedDay === item.id ? 'rotate-180' : ''
                  }`}
                />
              </div>

              <div className="flex items-center justify-around">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">摄入</div>
                    <div className="text-lg text-gray-900 dark:text-gray-100">{item.totalCalories}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">kcal</div>
                  </div>
                </div>

                <div className="w-px h-12 bg-gray-200 dark:bg-gray-700" />

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">消耗</div>
                    <div className="text-lg text-gray-900 dark:text-gray-100">{item.totalBurned}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">kcal</div>
                  </div>
                </div>

                <div className="w-px h-12 bg-gray-200 dark:bg-gray-700" />

                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">净摄入</div>
                  <div className="text-lg text-gray-900 dark:text-gray-100">
                    {item.totalCalories - item.totalBurned}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">kcal</div>
                </div>
              </div>
            </button>

            {/* 餐食详情 - 风琴式展开 */}
            <AnimatePresence>
              {expandedDay === item.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                    {item.meals.map((meal, index) => (
                      <div key={meal.id} className={index > 0 ? 'mt-2' : ''}>
                        <button
                          onClick={() => toggleExpandMeal(meal.id)}
                          className="w-full flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-600" />
                            <span className="text-sm text-gray-900 dark:text-gray-100">{meal.mealType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{meal.totalCalories} kcal</span>
                            <ChevronDown
                              className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${
                                expandedMeal === meal.id ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </button>
                        <AnimatePresence>
                          {expandedMeal === meal.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-6 pr-2 py-2 space-y-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg mt-1 transition-colors">
                                {meal.items.map((foodItem, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <div className="flex-1">
                                      <span className="text-gray-900 dark:text-gray-100">{foodItem.name}</span>
                                      <span className="text-gray-400 dark:text-gray-500 ml-2">{foodItem.amount}</span>
                                    </div>
                                    <span className="text-emerald-600 dark:text-emerald-400 text-xs">
                                      {foodItem.calories} kcal
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}