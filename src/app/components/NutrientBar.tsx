interface NutrientBarProps {
  name: string;
  current: number;
  total: number;
  unit?: string;
  color: string;
}

export function NutrientBar({ name, current, total, unit = 'g', color }: NutrientBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  const isOver = current > total;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{name}</span>
        <span className={`text-sm ${isOver ? 'text-red-500' : 'text-gray-600'}`}>
          {current}{unit} / {total}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: isOver ? '#ef4444' : color,
          }}
        />
      </div>
    </div>
  );
}
