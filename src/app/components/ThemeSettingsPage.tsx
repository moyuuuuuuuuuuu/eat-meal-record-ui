import { ChevronLeft, Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeSettingsPageProps {
  onBack: () => void;
}

export function ThemeSettingsPage({ onBack }: ThemeSettingsPageProps) {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      value: 'light' as const,
      label: '浅色模式',
      icon: Sun,
      description: '始终使用浅色主题',
    },
    {
      value: 'dark' as const,
      label: '深色模式',
      icon: Moon,
      description: '始终使用深色主题',
    },
    {
      value: 'system' as const,
      label: '跟随系统',
      icon: Monitor,
      description: '根据系统设置自动切换',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 px-4 py-4 shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-lg text-gray-900 dark:text-gray-100">主题设置</h1>
        </div>
      </div>

      {/* 主题选项 */}
      <div className="mt-4 mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm transition-colors">
          {themeOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = theme === option.value;

            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`w-full flex items-center gap-4 p-4 transition-colors ${
                  index !== themeOptions.length - 1
                    ? 'border-b border-gray-100 dark:border-gray-700'
                    : ''
                } ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {/* 图标 */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isSelected
                      ? 'bg-emerald-100 dark:bg-emerald-800'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isSelected
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  />
                </div>

                {/* 文字 */}
                <div className="flex-1 text-left">
                  <div
                    className={`text-base mb-1 ${
                      isSelected
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {option.description}
                  </div>
                </div>

                {/* 选中标记 */}
                {isSelected && (
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 提示信息 */}
      <div className="mt-4 mx-4 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 选择"跟随系统"时，应用会根据设备的系统设置自动切换浅色和深色主题
        </p>
      </div>

      {/* 预览区域 */}
      <div className="mt-6 mx-4">
        <h2 className="text-sm text-gray-600 dark:text-gray-400 mb-3 px-1">预览效果</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm transition-colors">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 dark:bg-emerald-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              这是一段示例文本，用于展示当前主题的效果。深色模式可以在夜间使用时减少眼睛疲劳。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
