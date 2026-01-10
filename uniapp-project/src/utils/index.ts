/**
 * 工具函数集合
 */

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: Date | string | number): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * 格式化日期
 */
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 格式化时间
 */
export const formatTime = (date: Date | string | number): string => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * 计算BMI
 */
export const calculateBMI = (weight: number, height: number): number => {
  if (height <= 0) return 0;
  const heightM = height / 100;
  return Number((weight / (heightM * heightM)).toFixed(1));
};

/**
 * 获取BMI状态
 */
export const getBMIStatus = (bmi: number): string => {
  if (bmi < 18.5) return '偏瘦';
  if (bmi < 24) return '正常';
  if (bmi < 28) return '偏胖';
  return '肥胖';
};

/**
 * 计算基础代谢率 (BMR)
 */
export const calculateBMR = (weight: number, height: number, age: number, gender: '男' | '女'): number => {
  if (weight <= 0 || height <= 0 || age <= 0) return 0;

  if (gender === '男') {
    return Math.round(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age));
  } else {
    return Math.round(447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age));
  }
};

/**
 * 计算每日总能量消耗 (TDEE)
 */
export const calculateTDEE = (bmr: number, activityLevel: number = 1.375): number => {
  return Math.round(bmr * activityLevel);
};

/**
 * 计算推荐卡路里
 */
export const calculateRecommendedCalories = (tdee: number, goal: 'lose' | 'maintain' | 'gain'): number => {
  if (goal === 'lose') return tdee - 400;
  if (goal === 'gain') return tdee + 400;
  return tdee;
};

/**
 * 计算推荐营养素分配
 */
export const calculateRecommendedNutrients = (calories: number): { protein: number; carbs: number; fat: number } => {
  return {
    protein: Math.round((calories * 0.27) / 4),
    carbs: Math.round((calories * 0.45) / 4),
    fat: Math.round((calories * 0.28) / 9)
  };
};

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 显示提示消息
 */
export const showToast = (title: string, icon: 'success' | 'error' | 'none' = 'none', duration: number = 2000): void => {
  uni.showToast({
    title,
    icon,
    duration
  });
};

/**
 * 显示确认对话框
 */
export const showConfirm = (title: string, content: string): Promise<boolean> => {
  return new Promise((resolve) => {
    uni.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm);
      }
    });
  });
};

/**
 * 格式化卡路里显示
 */
export const formatCalories = (calories: number): string => {
  return `${Math.round(calories)}kcal`;
};

/**
 * 格式化营养素显示
 */
export const formatNutrient = (value: number, unit: string = 'g'): string => {
  return `${value.toFixed(1)}${unit}`;
};

/**
 * 获取当前日期字符串
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * 获取当前时间字符串
 */
export const getCurrentTime = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

/**
 * 计算两个日期之间的天数差
 */
export const getDaysDiff = (date1: Date | string, date2: Date | string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

/**
 * 生成日期数组
 */
export const generateDateArray = (days: number = 7): string[] => {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
};

/**
 * 检查是否为有效数字
 */
export const isValidNumber = (value: any): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * 限制数值范围
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * 百分比计算
 */
export const calculatePercentage = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.round((current / target) * 100);
};

/**
 * 获取状态颜色
 */
export const getStatusColor = (percentage: number): string => {
  if (percentage > 100) return '#ef4444'; // 红色
  if (percentage > 90) return '#f59e0b';  // 橙色
  if (percentage > 70) return '#10b981';  // 绿色
  return '#3b82f6'; // 蓝色
};

/**
 * 格式化体重显示
 */
export const formatWeight = (weight: number): string => {
  return `${weight.toFixed(1)}kg`;
};

/**
 * 格式化身高显示
 */
export const formatHeight = (height: number): string => {
  return `${height}cm`;
};