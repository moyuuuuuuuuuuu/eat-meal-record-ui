import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { HomePage } from './components/HomePage';
import { FeedPage } from './components/FeedPage';
import { ProfilePage } from './components/ProfilePage';
import { MealHistoryPage } from './components/MealHistoryPage';
import { CreatePostPage } from './components/CreatePostPage';
import { GoalSettingsPage } from './components/GoalSettingsPage';
import { PersonalInfoPage } from './components/PersonalInfoPage';
import { AddMealPage } from './components/AddMealPage';
import { ThemeSettingsPage } from './components/ThemeSettingsPage';
import { House, List, User } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    'home' | 'feed' | 'profile' | 'meal-history' | 'create-post' | 'goal-settings' | 'personal-info' | 'add-meal' | 'theme-settings'
  >('home');
  const [selectedMealType, setSelectedMealType] = useState<'早餐' | '午餐' | '晚餐' | '加餐' | undefined>();

  const handleNavigateToAddMeal = (mealType?: '早餐' | '午餐' | '晚餐' | '加餐') => {
    setSelectedMealType(mealType);
    setCurrentPage('add-meal');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigateToAddMeal={handleNavigateToAddMeal} />;
      case 'feed':
        return <FeedPage onNavigateToCreatePost={() => setCurrentPage('create-post')} />;
      case 'profile':
        return (
          <ProfilePage
            onNavigateToMealHistory={() => setCurrentPage('meal-history')}
            onNavigateToGoalSettings={() => setCurrentPage('goal-settings')}
            onNavigateToPersonalInfo={() => setCurrentPage('personal-info')}
            onNavigateToThemeSettings={() => setCurrentPage('theme-settings')}
          />
        );
      case 'meal-history':
        return <MealHistoryPage onBack={() => setCurrentPage('profile')} />;
      case 'create-post':
        return <CreatePostPage onBack={() => setCurrentPage('feed')} />;
      case 'goal-settings':
        return <GoalSettingsPage onBack={() => setCurrentPage('profile')} />;
      case 'personal-info':
        return <PersonalInfoPage onBack={() => setCurrentPage('profile')} />;
      case 'theme-settings':
        return <ThemeSettingsPage onBack={() => setCurrentPage('profile')} />;
      case 'add-meal':
        return <AddMealPage onBack={() => setCurrentPage('home')} initialMealType={selectedMealType} />;
      default:
        return <HomePage onNavigateToAddMeal={handleNavigateToAddMeal} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* 主内容区域 */}
        <main className="pb-16">{renderPage()}</main>

        {/* 底部导航栏 */}
        {currentPage !== 'meal-history' &&
          currentPage !== 'create-post' &&
          currentPage !== 'goal-settings' &&
          currentPage !== 'personal-info' &&
          currentPage !== 'add-meal' &&
          currentPage !== 'theme-settings' && (
            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 transition-colors">
              <div className="flex items-center justify-around h-16">
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    currentPage === 'home' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <House className="w-6 h-6 mb-1" />
                  <span className="text-xs">首页</span>
                </button>

                <button
                  onClick={() => setCurrentPage('feed')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    currentPage === 'feed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <List className="w-6 h-6 mb-1" />
                  <span className="text-xs">动态</span>
                </button>

                <button
                  onClick={() => setCurrentPage('profile')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    currentPage === 'profile' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <User className="w-6 h-6 mb-1" />
                  <span className="text-xs">我的</span>
                </button>
              </div>
            </nav>
          )}
      </div>
    </ThemeProvider>
  );
}