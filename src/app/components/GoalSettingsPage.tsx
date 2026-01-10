import { useState, useEffect } from 'react';
import { ChevronLeft, Save } from 'lucide-react';

interface GoalSettingsPageProps {
  onBack: () => void;
}

export function GoalSettingsPage({ onBack }: GoalSettingsPageProps) {
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [protein, setProtein] = useState(150);
  const [fat, setFat] = useState(60);
  const [carbs, setCarbs] = useState(250);
  const [targetWeight, setTargetWeight] = useState(60);
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [autoCalculate, setAutoCalculate] = useState(true);

  // 根据每日热量自动计算营养素
  useEffect(() => {
    if (autoCalculate) {
      // 使用常见的宏量营养素比例：
      // 蛋白质: 30% (每克4卡路里)
      // 脂肪: 25% (每克9卡路里)
      // 碳水化合物: 45% (每克4卡路里)
      const proteinCalories = dailyCalories * 0.3;
      const fatCalories = dailyCalories * 0.25;
      const carbsCalories = dailyCalories * 0.45;

      setProtein(Math.round(proteinCalories / 4));
      setFat(Math.round(fatCalories / 9));
      setCarbs(Math.round(carbsCalories / 4));
    }
  }, [dailyCalories, autoCalculate]);

  const handleSave = () => {
    const settings = {
      dailyCalories,
      protein,
      fat,
      carbs,
      targetWeight,
      activityLevel,
    };
    console.log('保存目标设置:', settings);
    onBack();
  };

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
            <h1 className="text-lg text-gray-900 dark:text-gray-100">目标设置</h1>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-emerald-500 dark:bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>保存</span>
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 每日热量目标 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm transition-colors">
          <h2 className="text-gray-900 dark:text-gray-100 mb-4">每日热量目标</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">每日热量 (kcal)</label>
                <span className="text-lg text-emerald-600 dark:text-emerald-400">{dailyCalories}</span>
              </div>
              <input
                type="range"
                min="1200"
                max="3500"
                step="50"
                value={dailyCalories}
                onChange={(e) => setDailyCalories(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span>1200</span>
                <span>3500</span>
              </div>
            </div>
          </div>
        </div>

        {/* 营养素目标 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm transition-colors">
          <h2 className="text-gray-900 dark:text-gray-100 mb-4">营养素目标</h2>
          <div className="space-y-4">
            {/* 蛋白质 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">蛋白质 (g)</label>
                <span className="text-lg text-emerald-600 dark:text-emerald-400">{protein}</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="5"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span>50</span>
                <span>300</span>
              </div>
            </div>

            {/* 脂肪 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">脂肪 (g)</label>
                <span className="text-lg text-blue-600 dark:text-blue-400">{fat}</span>
              </div>
              <input
                type="range"
                min="30"
                max="150"
                step="5"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span>30</span>
                <span>150</span>
              </div>
            </div>

            {/* 碳水化合物 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">碳水化合物 (g)</label>
                <span className="text-lg text-orange-600 dark:text-orange-400">{carbs}</span>
              </div>
              <input
                type="range"
                min="100"
                max="500"
                step="10"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span>100</span>
                <span>500</span>
              </div>
            </div>
          </div>
        </div>

        {/* 体重目标 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm transition-colors">
          <h2 className="text-gray-900 dark:text-gray-100 mb-4">体重目标</h2>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">目标体重 (kg)</label>
              <span className="text-lg text-emerald-600 dark:text-emerald-400">{targetWeight}</span>
            </div>
            <input
              type="range"
              min="40"
              max="120"
              step="1"
              value={targetWeight}
              onChange={(e) => setTargetWeight(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
              <span>40</span>
              <span>120</span>
            </div>
          </div>
        </div>

        {/* 活动水平 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm transition-colors">
          <h2 className="text-gray-900 dark:text-gray-100 mb-4">活动水平</h2>
          <div className="space-y-2">
            <label className="flex items-center p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-600 transition-colors bg-white dark:bg-gray-700">
              <input
                type="radio"
                name="activity"
                value="sedentary"
                checked={activityLevel === 'sedentary'}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-4 h-4 text-emerald-600 accent-emerald-500"
              />
              <div className="ml-3 flex-1">
                <div className="text-gray-900 dark:text-gray-100">久坐</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">几乎不运动</div>
              </div>
            </label>

            <label className="flex items-center p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-600 transition-colors bg-white dark:bg-gray-700">
              <input
                type="radio"
                name="activity"
                value="light"
                checked={activityLevel === 'light'}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-4 h-4 text-emerald-600 accent-emerald-500"
              />
              <div className="ml-3 flex-1">
                <div className="text-gray-900 dark:text-gray-100">轻度活动</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">每周运动1-3次</div>
              </div>
            </label>

            <label className="flex items-center p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-600 transition-colors bg-white dark:bg-gray-700">
              <input
                type="radio"
                name="activity"
                value="moderate"
                checked={activityLevel === 'moderate'}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-4 h-4 text-emerald-600 accent-emerald-500"
              />
              <div className="ml-3 flex-1">
                <div className="text-gray-900 dark:text-gray-100">中度活动</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">每周运动3-5次</div>
              </div>
            </label>

            <label className="flex items-center p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-600 transition-colors bg-white dark:bg-gray-700">
              <input
                type="radio"
                name="activity"
                value="active"
                checked={activityLevel === 'active'}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-4 h-4 text-emerald-600 accent-emerald-500"
              />
              <div className="ml-3 flex-1">
                <div className="text-gray-900 dark:text-gray-100">高度活动</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">每周运动6-7次</div>
              </div>
            </label>

            <label className="flex items-center p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-600 transition-colors bg-white dark:bg-gray-700">
              <input
                type="radio"
                name="activity"
                value="extreme"
                checked={activityLevel === 'extreme'}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-4 h-4 text-emerald-600 accent-emerald-500"
              />
              <div className="ml-3 flex-1">
                <div className="text-gray-900 dark:text-gray-100">极度活动</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">每天高强度训练</div>
              </div>
            </label>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 建议根据个人身体状况和运动习惯合理设置目标，循序渐进地调整。
          </p>
        </div>
      </div>
    </div>
  );
}