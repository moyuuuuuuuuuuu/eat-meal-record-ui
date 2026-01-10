import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const suggestions = [
  { name: '香煎鸡胸肉配糙米', calories: 450, tag: '高蛋白' },
  { name: '三文鱼沙拉', calories: 380, tag: '健康脂肪' },
  { name: '全麦三明治', calories: 320, tag: '均衡营养' },
  { name: '牛油果吐司', calories: 350, tag: '优质碳水' },
  { name: '藜麦鸡肉碗', calories: 420, tag: '超级食物' },
  { name: '蔬菜蛋饼', calories: 280, tag: '低卡' },
  { name: '虾仁炒西兰花', calories: 240, tag: '低脂' },
  { name: '番茄意面', calories: 390, tag: '经典' },
  { name: '烤鳕鱼配蔬菜', calories: 310, tag: '清淡' },
  { name: '鸡肉蔬菜卷', calories: 360, tag: '便携' },
];

export function FoodSuggestion() {
  const [currentSuggestion, setCurrentSuggestion] = useState(
    suggestions[Math.floor(Math.random() * suggestions.length)]
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const newSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setCurrentSuggestion(newSuggestion);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 rounded-lg p-4 shadow-md text-white transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-medium">今日吃什么</h3>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleRefresh}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <motion.div
            animate={{ rotate: isAnimating ? 360 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <RefreshCw className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSuggestion.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-lg mb-1">{currentSuggestion.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-emerald-100 dark:text-emerald-200">约 {currentSuggestion.calories} kcal</span>
                <span className="text-xs bg-white/20 dark:bg-white/25 px-2 py-0.5 rounded-full">
                  {currentSuggestion.tag}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}