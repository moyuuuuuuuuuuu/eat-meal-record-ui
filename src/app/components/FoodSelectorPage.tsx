import { useState } from 'react';
import { ChevronLeft, Search, X, Plus, Minus, ChevronUp, ChevronDown, Camera } from 'lucide-react';

interface FoodData {
  name: string;
  unit: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface SelectedFood extends FoodData {
  quantity: number;
  selectedUnit: string;
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

interface FoodSelectorPageProps {
  onBack: () => void;
  onConfirm: (food: SelectedFood) => void;
}

export function FoodSelectorPage({ onBack, onConfirm }: FoodSelectorPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [showRecognitionResults, setShowRecognitionResults] = useState(false);
  const [recognizedFoods, setRecognizedFoods] = useState<FoodData[]>([]);
  const [showCameraGuide, setShowCameraGuide] = useState(false);

  // 常见食物数据库
  const commonFoods: FoodData[] = [
    { name: '燕麦粥', unit: '100g', calories: 68, protein: 2.4, fat: 1.4, carbs: 12 },
    { name: '煮鸡蛋', unit: '1个', calories: 78, protein: 6.3, fat: 5.3, carbs: 0.6 },
    { name: '全麦面包', unit: '1片', calories: 90, protein: 3.5, fat: 1.2, carbs: 17 },
    { name: '牛奶', unit: '100ml', calories: 60, protein: 3.2, fat: 3.4, carbs: 4.8 },
    { name: '糙米饭', unit: '100g', calories: 111, protein: 2.6, fat: 0.9, carbs: 23 },
    { name: '鸡胸肉', unit: '100g', calories: 133, protein: 24, fat: 5, carbs: 0 },
    { name: '西兰花', unit: '100g', calories: 34, protein: 2.8, fat: 0.4, carbs: 6.6 },
    { name: '三文鱼', unit: '100g', calories: 206, protein: 20, fat: 13, carbs: 0 },
    { name: '香蕉', unit: '1个', calories: 89, protein: 1.1, fat: 0.3, carbs: 23 },
    { name: '苹果', unit: '1个', calories: 52, protein: 0.3, fat: 0.2, carbs: 14 },
    { name: '紫薯', unit: '100g', calories: 82, protein: 1.1, fat: 0.2, carbs: 20 },
    { name: '藜麦', unit: '100g', calories: 120, protein: 4.4, fat: 1.9, carbs: 21 },
    { name: '蔬菜沙拉', unit: '100g', calories: 20, protein: 1.5, fat: 0.2, carbs: 4 },
    { name: '坚果', unit: '20g', calories: 120, protein: 5, fat: 10, carbs: 4 },
    { name: '酸奶', unit: '100g', calories: 72, protein: 3.5, fat: 2.7, carbs: 9.3 },
    { name: '豆浆', unit: '100ml', calories: 31, protein: 2.8, fat: 1.5, carbs: 1.8 },
    { name: '红薯', unit: '100g', calories: 90, protein: 1.6, fat: 0.2, carbs: 20.1 },
    { name: '牛肉', unit: '100g', calories: 125, protein: 20, fat: 4.2, carbs: 0 },
  ];

  // 获取不同食物类型的可用单位
  const getAvailableUnits = (foodName: string): { name: string; ratio: number }[] => {
    // 米饭、粥类
    if (foodName.includes('饭') || foodName.includes('粥') || foodName.includes('藜麦')) {
      return [
        { name: '份', ratio: 1 },
        { name: '100g', ratio: 1 },
        { name: '碗', ratio: 2 }, // 1碗约200g
        { name: '盒', ratio: 3 }, // 1盒约300g
      ];
    }
    // 面包、饼类
    if (foodName.includes('面包') || foodName.includes('饼')) {
      return [
        { name: '份', ratio: 1 },
        { name: '片', ratio: 1 },
        { name: '100g', ratio: 1.1 },
      ];
    }
    // 液体类
    if (foodName.includes('奶') || foodName.includes('豆浆') || foodName.includes('汁')) {
      return [
        { name: '份', ratio: 1 },
        { name: '100ml', ratio: 1 },
        { name: '杯', ratio: 2.5 }, // 1杯约250ml
        { name: '瓶', ratio: 5 }, // 1瓶约500ml
      ];
    }
    // 鸡蛋
    if (foodName.includes('鸡蛋') || foodName.includes('蛋')) {
      return [
        { name: '份', ratio: 1 },
        { name: '个', ratio: 1 },
      ];
    }
    // 肉类
    if (foodName.includes('肉') || foodName.includes('鱼') || foodName.includes('虾')) {
      return [
        { name: '份', ratio: 1 },
        { name: '100g', ratio: 1 },
        { name: '盒', ratio: 1.5 }, // 1盒约150g
      ];
    }
    // 蔬菜类
    if (foodName.includes('菜') || foodName.includes('花') || foodName.includes('瓜')) {
      return [
        { name: '份', ratio: 1 },
        { name: '100g', ratio: 1 },
        { name: '盘', ratio: 2 }, // 1盘约200g
        { name: '碗', ratio: 1.5 }, // 1碗约150g
      ];
    }
    // 水果类
    if (foodName.includes('果') || foodName.includes('蕉') || foodName.includes('梨') || foodName.includes('苹果')) {
      return [
        { name: '份', ratio: 1 },
        { name: '个', ratio: 1 },
        { name: '100g', ratio: 1 },
      ];
    }
    // 薯类
    if (foodName.includes('薯')) {
      return [
        { name: '份', ratio: 1 },
        { name: '100g', ratio: 1 },
        { name: '个', ratio: 1.5 }, // 1个约150g
      ];
    }
    // 坚果
    if (foodName.includes('坚果') || foodName.includes('仁')) {
      return [
        { name: '份', ratio: 1 },
        { name: '20g', ratio: 1 },
        { name: '把', ratio: 1.5 }, // 1把约30g
      ];
    }
    // 默认
    return [
      { name: '份', ratio: 1 },
      { name: '100g', ratio: 1 },
      { name: '碗', ratio: 2 },
      { name: '盒', ratio: 1.5 },
    ];
  };

  const filteredFoods = searchQuery
    ? commonFoods.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : commonFoods;

  const handleFoodSelect = (food: FoodData) => {
    setSelectedFood(food);
    const units = getAvailableUnits(food.name);
    // 默认选择第一个单位
    setSelectedUnit(units[0].name);
    setQuantity(1);
  };

  const handleConfirm = () => {
    if (!selectedFood) return;

    const units = getAvailableUnits(selectedFood.name);
    const unitObj = units.find(u => u.name === selectedUnit);
    const ratio = unitObj?.ratio || 1;

    const confirmedFood: SelectedFood = {
      ...selectedFood,
      quantity,
      selectedUnit,
      totalCalories: Math.round(selectedFood.calories * ratio * quantity),
      totalProtein: parseFloat((selectedFood.protein * ratio * quantity).toFixed(1)),
      totalFat: parseFloat((selectedFood.fat * ratio * quantity).toFixed(1)),
      totalCarbs: parseFloat((selectedFood.carbs * ratio * quantity).toFixed(1)),
    };

    onConfirm(confirmedFood);
    setSelectedFood(null);
  };

  const updateQuantity = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const getCurrentNutrition = () => {
    if (!selectedFood) return { calories: 0, protein: 0, fat: 0, carbs: 0 };

    const units = getAvailableUnits(selectedFood.name);
    const unitObj = units.find(u => u.name === selectedUnit);
    const ratio = unitObj?.ratio || 1;

    return {
      calories: Math.round(selectedFood.calories * ratio * quantity),
      protein: parseFloat((selectedFood.protein * ratio * quantity).toFixed(1)),
      fat: parseFloat((selectedFood.fat * ratio * quantity).toFixed(1)),
      carbs: parseFloat((selectedFood.carbs * ratio * quantity).toFixed(1)),
    };
  };

  const currentNutrition = getCurrentNutrition();

  // 模拟拍照识别功能
  const handleCameraRecognition = () => {
    // 模拟识别结果
    const mockRecognizedFoods: FoodData[] = [
      { name: '糙米饭', unit: '100g', calories: 111, protein: 2.6, fat: 0.9, carbs: 23 },
      { name: '鸡胸肉', unit: '100g', calories: 133, protein: 24, fat: 5, carbs: 0 },
      { name: '西兰花', unit: '100g', calories: 34, protein: 2.8, fat: 0.4, carbs: 6.6 },
      { name: '煮鸡蛋', unit: '1个', calories: 78, protein: 6.3, fat: 5.3, carbs: 0.6 },
    ];
    
    setRecognizedFoods(mockRecognizedFoods);
    setShowRecognitionResults(true);
  };

  const handleRecognizedFoodSelect = (food: FoodData) => {
    setShowRecognitionResults(false);
    handleFoodSelect(food);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 flex flex-col transition-colors">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 px-4 py-4 shadow-sm transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-lg text-gray-900 dark:text-gray-100">选择食物</h1>
          </div>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索食物..."
            className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* 食物列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-2">
          {filteredFoods.map((food, index) => (
            <button
              key={index}
              onClick={() => handleFoodSelect(food)}
              className="w-full bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-left border border-transparent hover:border-emerald-500 dark:hover:border-emerald-600"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-gray-900 dark:text-gray-100 font-medium mb-1">{food.name}</div>
                  <div className="flex gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <span>{food.calories}kcal/{food.unit}</span>
                    <span>蛋白{food.protein}g</span>
                    <span>脂肪{food.fat}g</span>
                    <span>碳水{food.carbs}g</span>
                  </div>
                </div>
                <Plus className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 食物详情模态框 */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white dark:bg-gray-800 w-full rounded-t-3xl flex flex-col transition-colors">
            {/* 模态框头部 */}
            <div className="relative px-4 py-6 border-b border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setSelectedFood(null)}
                className="absolute left-4 top-6 p-1"
              >
                <X className="w-6 h-6 text-gray-900 dark:text-gray-100" />
              </button>
              <h3 className="text-center text-xl text-gray-900 dark:text-gray-100">{selectedFood.name}</h3>
            </div>

            {/* 营养信息 - 紧凑布局 */}
            <div className="px-6 py-6 grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg text-gray-900 dark:text-gray-100 font-medium">{currentNutrition.calories}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">千卡</div>
              </div>
              <div>
                <div className="text-lg text-gray-900 dark:text-gray-100 font-medium">{currentNutrition.carbs}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">碳水</div>
              </div>
              <div>
                <div className="text-lg text-gray-900 dark:text-gray-100 font-medium">{currentNutrition.protein}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">蛋白质</div>
              </div>
              <div>
                <div className="text-lg text-gray-900 dark:text-gray-100 font-medium">{currentNutrition.fat}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">脂肪</div>
              </div>
            </div>

            {/* 数量输入 - 大号居中 */}
            <div className="px-6 py-12 flex flex-col items-center">
              <input
                type="number"
                value={quantity || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value > 0 || e.target.value === '') {
                    setQuantity(value || 0);
                  }
                }}
                step="0.5"
                min="0.5"
                className="w-full text-center text-5xl text-gray-900 dark:text-gray-100 font-bold border-none outline-none bg-transparent"
                placeholder="0"
              />
              <div className="w-64 h-px bg-gray-200 dark:bg-gray-700 mt-4"></div>
            </div>

            {/* 单位切换 */}
            <div className="px-6 pb-8">
              <div className="flex gap-2 justify-center">
                {getAvailableUnits(selectedFood.name).map((unit) => (
                  <button
                    key={unit.name}
                    onClick={() => setSelectedUnit(unit.name)}
                    className={`px-6 py-2 text-lg transition-all ${
                      selectedUnit === unit.name
                        ? 'text-gray-900 dark:text-gray-100 font-medium'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {unit.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 底部确定按钮 */}
            <div className="px-6 pb-8">
              <button
                onClick={handleConfirm}
                className="w-full bg-emerald-500 dark:bg-emerald-600 text-white text-lg py-4 rounded-full active:bg-emerald-600 dark:active:bg-emerald-700 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 拍照识别结果 */}
      {showRecognitionResults && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white dark:bg-gray-800 w-full rounded-t-3xl flex flex-col transition-colors">
            {/* 模态框头部 */}
            <div className="relative px-4 py-6 border-b border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setShowRecognitionResults(false)}
                className="absolute left-4 top-6 p-1"
              >
                <X className="w-6 h-6 text-gray-900 dark:text-gray-100" />
              </button>
              <h3 className="text-center text-xl text-gray-900 dark:text-gray-100">识别结果</h3>
            </div>

            {/* 识别结果列表 */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-3">
                {recognizedFoods.map((food, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecognizedFoodSelect(food)}
                    className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-md transition-all text-left"
                  >
                    <div className="mb-2">
                      <div className="text-gray-900 dark:text-gray-100 font-medium mb-1">{food.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{food.unit}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">热量</span>
                        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{food.calories} kcal</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>蛋白 {food.protein}g</span>
                        <span>脂肪 {food.fat}g</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {recognizedFoods.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  未找到识别结果
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 拍照识别按钮 */}
      <div className="absolute bottom-6 right-6">
        <button
          onClick={() => setShowCameraGuide(true)}
          className="w-14 h-14 bg-emerald-500 dark:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl active:bg-emerald-600 dark:active:bg-emerald-700 transition-all flex items-center justify-center"
        >
          <Camera className="w-6 h-6" />
        </button>
      </div>

      {/* 拍照识别引导页面 */}
      {showCameraGuide && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white dark:bg-gray-800 w-full rounded-t-3xl flex flex-col transition-colors">
            {/* 模态框头部 */}
            <div className="relative px-4 py-6 border-b border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setShowCameraGuide(false)}
                className="absolute left-4 top-6 p-1"
              >
                <X className="w-6 h-6 text-gray-900 dark:text-gray-100" />
              </button>
              <h3 className="text-center text-xl text-gray-900 dark:text-gray-100">AI 识别食物</h3>
            </div>

            {/* 引导内容 */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
              {/* 相机图标 */}
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                <Camera className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              </div>

              {/* 标题 */}
              <h2 className="text-2xl text-gray-900 dark:text-gray-100 mb-4 text-center">拍照识别食物</h2>

              {/* 说明文字 */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">1</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">对准餐盘拍摄照片</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">2</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">AI 自动识别照片中的食物</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">3</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">选择识别到的食物并填写数量</p>
                </div>
              </div>

              {/* 提示 */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 w-full mb-8">
                <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
                  💡 拍摄时请保证光线充足，食物清晰可见
                </p>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="px-6 pb-8 space-y-3">
              <button
                onClick={() => {
                  setShowCameraGuide(false);
                  handleCameraRecognition();
                }}
                className="w-full bg-emerald-500 dark:bg-emerald-600 text-white text-lg py-4 rounded-full active:bg-emerald-600 dark:active:bg-emerald-700 transition-colors"
              >
                开始拍照
              </button>
              <button
                onClick={() => setShowCameraGuide(false)}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-lg py-4 rounded-full active:bg-gray-200 dark:active:bg-gray-600 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}