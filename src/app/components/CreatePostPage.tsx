import { useState } from 'react';
import { ChevronLeft, Image as ImageIcon, Video, X, Hash, Plus, ChevronRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MealRecord {
  id: string;
  mealType: string;
  items: { name: string; amount: string; calories: number }[];
  totalCalories: number;
}

interface DayMeals {
  date: string;
  dateLabel: string;
  meals: MealRecord[];
}

interface CreatePostPageProps {
  onBack: () => void;
  onPublish?: (post: any) => void;
}

export function CreatePostPage({ onBack, onPublish }: CreatePostPageProps) {
  const [content, setContent] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<MealRecord[]>([]);
  const [showMealSelector, setShowMealSelector] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [enableLocation, setEnableLocation] = useState(false);

  // 手动获取地理位置
  const getLocation = () => {
    if (!navigator.geolocation) {
      console.log('浏览器不支持地理定位');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsGettingLocation(false);
      },
      (error) => {
        console.log('位置获取失败，将继续不带位置信息发布');
        setIsGettingLocation(false);
        setEnableLocation(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // 处理位置开关
  const handleLocationToggle = (checked: boolean) => {
    setEnableLocation(checked);
    if (checked && !location) {
      getLocation();
    } else if (!checked) {
      setLocation(null);
    }
  };

  // 预设话题标签
  const popularTopics = [
    '#健康饮食',
    '#减脂餐',
    '#增肌',
    '#低卡',
    '#高蛋白',
    '#营养搭配',
    '#早餐',
    '#午餐',
    '#晚餐',
    '#轻食',
    '#健身餐',
    '#打卡',
  ];

  // 模拟近一周餐食记录
  const getDateLabel = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    if (daysAgo === 0) return '今天';
    if (daysAgo === 1) return '昨天';
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const weekMeals: DayMeals[] = [
    {
      date: '2026-01-10',
      dateLabel: getDateLabel(0),
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
      ],
    },
    {
      date: '2026-01-09',
      dateLabel: getDateLabel(1),
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
      ],
    },
    {
      date: '2026-01-08',
      dateLabel: getDateLabel(2),
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
      ],
    },
  ];

  const handleAddTopic = (topic: string) => {
    if (!selectedTopics.includes(topic)) {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setSelectedTopics(selectedTopics.filter((t) => t !== topic));
  };

  const handleAddCustomTopic = () => {
    if (customTopic.trim()) {
      const formattedTopic = customTopic.startsWith('#') ? customTopic : `#${customTopic}`;
      handleAddTopic(formattedTopic);
      setCustomTopic('');
      setShowTopicInput(false);
    }
  };

  const handlePublish = () => {
    const post = {
      content,
      topics: selectedTopics,
      mealReference: selectedMeals
        ? {
            mealType: selectedMeals.map(meal => meal.mealType),
            items: selectedMeals.map(meal => meal.items.map((item) => `${item.name} ${item.amount}`)),
            totalCalories: selectedMeals.reduce((sum, meal) => sum + meal.totalCalories, 0),
          }
        : undefined,
      images,
      location,
    };
    console.log('发布动态:', post);
    onPublish?.(post);
    onBack();
  };

  const canPublish = content.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 px-4 py-4 shadow-sm flex items-center justify-between transition-colors">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-lg text-gray-900 dark:text-gray-100">发布动态</h1>
        <button
          onClick={handlePublish}
          disabled={!canPublish}
          className={`px-4 py-1.5 rounded-lg transition-colors ${
            canPublish
              ? 'bg-emerald-500 dark:bg-emerald-600 text-white hover:bg-emerald-600 dark:hover:bg-emerald-700'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          发布
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {/* 内容输入区 */}
        <div className="bg-white dark:bg-gray-800 px-4 py-4 mb-2 transition-colors">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享你的饮食心得..."
            className="w-full min-h-[150px] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none outline-none bg-transparent"
            maxLength={500}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <ImageIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">{content.length}/500</span>
          </div>
        </div>

        {/* 已选话题 */}
        {selectedTopics.length > 0 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 mb-2 transition-colors">
            <div className="flex flex-wrap gap-2">
              {selectedTopics.map((topic) => (
                <motion.div
                  key={topic}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full"
                >
                  <span className="text-sm">{topic}</span>
                  <button
                    onClick={() => handleRemoveTopic(topic)}
                    className="hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 添加话题 */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 mb-2 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-gray-100">添加话题</span>
            </div>
            <button
              onClick={() => setShowTopicInput(!showTopicInput)}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              <Plus className="w-4 h-4" />
              <span>自建话题</span>
            </button>
          </div>

          {/* 自定义话题输入 */}
          <AnimatePresence>
            {showTopicInput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-3"
              >
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                  <Hash className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTopic()}
                    placeholder="输入自定义话题"
                    className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <button
                    onClick={handleAddCustomTopic}
                    className="text-emerald-600 dark:text-emerald-400 text-sm hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    添加
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 热门话题 */}
          <div className="flex flex-wrap gap-2">
            {popularTopics
              .filter((topic) => !selectedTopics.includes(topic))
              .map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleAddTopic(topic)}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {topic}
                </button>
              ))}
          </div>
        </div>

        {/* 关联餐食记录 */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 transition-colors">
          <button
            onClick={() => setShowMealSelector(!showMealSelector)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400 text-sm">餐</span>
              </div>
              <span className="text-gray-900 dark:text-gray-100">
                {selectedMeals.length > 0 ? `已关联 ${selectedMeals.length}个餐食` : '关联餐食记录'}
              </span>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${
                showMealSelector ? 'rotate-90' : ''
              }`}
            />
          </button>

          {/* 餐食选择器 */}
          <AnimatePresence>
            {showMealSelector && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="space-y-3 max-h-96 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {weekMeals.map((day) => (
                    <div key={day.date}>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 px-1">{day.dateLabel}</div>
                      <div className="space-y-2">
                        {day.meals.map((meal) => (
                          <button
                            key={meal.id}
                            onClick={() => {
                              setSelectedMeals([...selectedMeals, meal]);
                              setShowMealSelector(false);
                            }}
                            className={`w-full p-3 rounded-lg border-2 transition-all ${
                              selectedMeals.some(selectedMeal => selectedMeal.id === meal.id)
                                ? 'border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'
                                : 'border-gray-200 dark:border-gray-600 hover:border-emerald-200 dark:hover:border-emerald-600 bg-gray-50 dark:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-900 dark:text-gray-100">{meal.mealType}</span>
                              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                                {meal.totalCalories} kcal
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {meal.items.map((item, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400"
                                >
                                  {item.name} {item.amount}
                                </span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {selectedMeals.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedMeals([]);
                        setShowMealSelector(false);
                      }}
                      className="w-full py-2 text-red-500 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      取消关联
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 已关联餐食预览 */}
        {selectedMeals.length > 0 && !showMealSelector && (
          <div className="px-4 mt-2 space-y-2">
            {selectedMeals.map((meal) => (
              <div key={meal.id} className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-3 border border-emerald-100 dark:border-emerald-800 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center">
                      <span className="text-white text-xs">餐</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{meal.mealType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-emerald-600 dark:text-emerald-400">{meal.totalCalories} kcal</span>
                    <button
                      onClick={() => setSelectedMeals(selectedMeals.filter(m => m.id !== meal.id))}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3 text-red-500 dark:text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {meal.items.map((item, index) => (
                    <span key={index} className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                      {item.name} {item.amount}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 位置开关 */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 mt-2 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className={`w-5 h-5 ${enableLocation ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <div>
                <div className="text-gray-900 dark:text-gray-100">添加位置信息</div>
                {location && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    已获取位置 ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
                  </div>
                )}
                {isGettingLocation && (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">正在获取位置...</div>
                )}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableLocation}
                onChange={(e) => handleLocationToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 dark:peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}