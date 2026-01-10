import { useState } from 'react';
import { ChevronLeft, Save, User } from 'lucide-react';

interface PersonalInfoPageProps {
  onBack: () => void;
}

export function PersonalInfoPage({ onBack }: PersonalInfoPageProps) {
  const [name, setName] = useState('用户');
  const [gender, setGender] = useState('女');
  const [age, setAge] = useState(28);
  const [height, setHeight] = useState(170);
  const [currentWeight, setCurrentWeight] = useState(65);
  const [birthday, setBirthday] = useState('1998-01-15');

  const handleSave = () => {
    const info = {
      name,
      gender,
      age,
      height,
      currentWeight,
      birthday,
    };
    console.log('保存个人信息:', info);
    onBack();
  };

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmi = currentWeight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMIStatus = () => {
    const bmi = parseFloat(calculateBMI());
    if (bmi < 18.5) return { text: '偏瘦', color: 'text-blue-600 dark:text-blue-400' };
    if (bmi < 24) return { text: '正常', color: 'text-emerald-600 dark:text-emerald-400' };
    if (bmi < 28) return { text: '超重', color: 'text-orange-600 dark:text-orange-400' };
    return { text: '肥胖', color: 'text-red-600 dark:text-red-400' };
  };

  const bmiStatus = getBMIStatus();

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
            <h1 className="text-lg text-gray-900 dark:text-gray-100">个人信息</h1>
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
        {/* 头像 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-colors">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-600 flex items-center justify-center mb-3">
              <User className="w-10 h-10 text-white" />
            </div>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
              更换头像
            </button>
          </div>
        </div>

        {/* 基本信息 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm transition-colors">
          <h2 className="text-gray-900 dark:text-gray-100 mb-4">基本信息</h2>
          <div className="space-y-4">
            {/* 昵称 */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">昵称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-600 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="请输入昵称"
              />
            </div>

            {/* 性别 */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">性别</label>
              <div className="flex gap-3">
                <label className="flex-1 flex items-center justify-center p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-600 transition-colors bg-white dark:bg-gray-700">
                  <input
                    type="radio"
                    name="gender"
                    value="男"
                    checked={gender === '男'}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-4 h-4 text-emerald-600 accent-emerald-500 mr-2"
                  />
                  <span className="text-gray-900 dark:text-gray-100">男</span>
                </label>
                <label className="flex-1 flex items-center justify-center p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-600 transition-colors bg-white dark:bg-gray-700">
                  <input
                    type="radio"
                    name="gender"
                    value="女"
                    checked={gender === '女'}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-4 h-4 text-emerald-600 accent-emerald-500 mr-2"
                  />
                  <span className="text-gray-900 dark:text-gray-100">女</span>
                </label>
              </div>
            </div>

            {/* 生日 */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">生日</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => {
                  setBirthday(e.target.value);
                  const birthYear = new Date(e.target.value).getFullYear();
                  const currentYear = new Date().getFullYear();
                  setAge(currentYear - birthYear);
                }}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-600 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">年龄: {age} 岁</div>
            </div>
          </div>
        </div>

        {/* 身体数据 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm transition-colors">
          <h2 className="text-gray-900 dark:text-gray-100 mb-4">身体数据</h2>
          <div className="space-y-4">
            {/* 身高 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">身高 (cm)</label>
                <span className="text-lg text-emerald-600 dark:text-emerald-400">{height}</span>
              </div>
              <input
                type="range"
                min="140"
                max="200"
                step="1"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span>140</span>
                <span>200</span>
              </div>
            </div>

            {/* 当前体重 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">当前体重 (kg)</label>
                <span className="text-lg text-emerald-600 dark:text-emerald-400">{currentWeight}</span>
              </div>
              <input
                type="range"
                min="40"
                max="120"
                step="0.5"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span>40</span>
                <span>120</span>
              </div>
            </div>
          </div>
        </div>

        {/* BMI 指标 */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 dark:text-gray-300">BMI 指数</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-gray-900 dark:text-gray-100">{calculateBMI()}</span>
              <span className={`text-sm ${bmiStatus.color}`}>{bmiStatus.text}</span>
            </div>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>偏瘦: &lt; 18.5 | 正常: 18.5-23.9 | 超重: 24-27.9 | 肥胖: ≥ 28</div>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 准确的个人信息有助于系统为您提供更精确的营养建议和目标设置。
          </p>
        </div>
      </div>
    </div>
  );
}