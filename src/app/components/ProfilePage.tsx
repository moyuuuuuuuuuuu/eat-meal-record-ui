import { User, Target, TrendingUp, Settings, ChevronRight, BookOpen, UserCircle, Palette } from 'lucide-react';

interface ProfilePageProps {
  onNavigateToMealHistory?: () => void;
  onNavigateToGoalSettings?: () => void;
  onNavigateToPersonalInfo?: () => void;
  onNavigateToThemeSettings?: () => void;
}

export function ProfilePage({ onNavigateToMealHistory, onNavigateToGoalSettings, onNavigateToPersonalInfo, onNavigateToThemeSettings }: ProfilePageProps) {
  const userStats = {
    name: '用户',
    joinDays: 45,
    totalRecords: 128,
    avgCalories: 1890,
    currentWeight: 65,
    targetWeight: 60,
    height: 170,
    age: 28,
    gender: '女',
  };

  const dailyGoals = {
    calories: 2000,
    protein: 150,
    fat: 60,
    carbs: 250,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors">
      {/* 头部 */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 px-4 py-8 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center transition-colors">
            <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 text-white">
            <h1 className="text-xl mb-1">{userStats.name}</h1>
            <p className="text-sm text-emerald-100">已坚持 {userStats.joinDays} 天</p>
          </div>
          <button 
            onClick={onNavigateToThemeSettings}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <Palette className="w-5 h-5" />
          </button>
          <button 
            onClick={onNavigateToPersonalInfo}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="px-4 -mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 grid grid-cols-3 gap-4 transition-colors">
          <div className="text-center">
            <div className="text-2xl text-gray-900 dark:text-gray-100">{userStats.totalRecords}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">记录天数</div>
          </div>
          <div className="text-center border-l border-r border-gray-200 dark:border-gray-700">
            <div className="text-2xl text-gray-900 dark:text-gray-100">{userStats.avgCalories}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">平均摄入</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-emerald-600 dark:text-emerald-400">
              {userStats.currentWeight - userStats.targetWeight}kg
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">距离目标</div>
          </div>
        </div>
      </div>

      {/* 快捷菜单 */}
      <div className="px-4 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors">
          <button
            onClick={onNavigateToMealHistory}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-gray-900 dark:text-gray-100">餐食记录</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </button>
          <button
            onClick={onNavigateToGoalSettings}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-gray-900 dark:text-gray-100">目标设置</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </button>
        </div>
      </div>

      {/* 个人信息 */}
      <div className="px-4 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-gray-900 dark:text-gray-100">个人信息</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">性别</span>
              <span className="text-gray-900 dark:text-gray-100">{userStats.gender}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">年龄</span>
              <span className="text-gray-900 dark:text-gray-100">{userStats.age}岁</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">身高</span>
              <span className="text-gray-900 dark:text-gray-100">{userStats.height}cm</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">当前体重</span>
              <span className="text-gray-900 dark:text-gray-100">{userStats.currentWeight}kg</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">目标体重</span>
              <span className="text-emerald-600 dark:text-emerald-400">{userStats.targetWeight}kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* 每日目标 */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-gray-900 dark:text-gray-100">每日目标</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">热量</span>
              <span className="text-gray-900 dark:text-gray-100">{dailyGoals.calories} kcal</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">蛋白质</span>
              <span className="text-gray-900 dark:text-gray-100">{dailyGoals.protein}g</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">脂肪</span>
              <span className="text-gray-900 dark:text-gray-100">{dailyGoals.fat}g</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">碳水化合物</span>
              <span className="text-gray-900 dark:text-gray-100">{dailyGoals.carbs}g</span>
            </div>
          </div>
        </div>
      </div>

      {/* 趋势分析 */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-gray-900 dark:text-gray-100">本周趋势</h2>
          </div>
          <div className="text-center py-8 text-gray-400">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">趋势图表功能即将上线</p>
          </div>
        </div>
      </div>
    </div>
  );
}