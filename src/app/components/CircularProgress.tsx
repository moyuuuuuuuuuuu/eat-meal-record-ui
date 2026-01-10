interface CircularProgressProps {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({ 
  current, 
  total, 
  size = 180, 
  strokeWidth = 12 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const remaining = total - current;
  const progress = Math.min((current / total) * 100, 100);
  const offset = circumference - (progress / 100) * circumference;
  
  const isOverLimit = remaining <= 0;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        {/* 进度圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isOverLimit ? "#ef4444" : "#10b981"}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {/* 中心内容 */}
      <div className="absolute flex flex-col items-center justify-center">
        <div className={`text-4xl ${isOverLimit ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
          {Math.abs(remaining)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {isOverLimit ? '超出' : '剩余'} kcal
        </div>
      </div>
    </div>
  );
}