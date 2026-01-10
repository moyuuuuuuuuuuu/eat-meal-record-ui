import { useState } from 'react';
import { Heart, MessageCircle, Share2, User, Image as ImageIcon, Video, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface MealReference {
  mealType: string[] | string;
  items: string[][] | string[];
  totalCalories: number;
}

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  images?: string[];
  video?: string;
  topics?: string[];
  mealReference?: MealReference;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
}

interface FeedPageProps {
  onNavigateToCreatePost?: () => void;
}

export function FeedPage({ onNavigateToCreatePost }: FeedPageProps) {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: { name: '健康小达人' },
      content: '今天的午餐太满足了！鸡胸肉配糙米饭，营养又美味 💪',
      images: [],
      topics: ['#健康饮食', '#减脂餐'],
      mealReference: {
        mealType: '午餐',
        items: ['糙米饭 150g', '鸡胸肉 120g', '西兰花 100g'],
        totalCalories: 379,
      },
      likes: 24,
      comments: 5,
      timestamp: '2小时前',
      isLiked: false,
    },
    {
      id: '2',
      author: { name: '营养达人' },
      content: '今天的饮食记录分享！从早餐到晚餐都很营养均衡，总摄入1850大卡，完美控制在目标范围内！💯',
      images: [],
      topics: ['#全天打卡', '#营养均衡', '#健康饮食'],
      mealReference: {
        mealType: ['早餐', '午餐', '晚餐'],
        items: [
          ['燕麦粥 200g', '煮鸡蛋 1个', '蓝莓 50g'],
          ['糙米饭 150g', '鸡胸肉 120g', '西兰花 100g', '番茄 50g'],
          ['蔬菜沙拉 200g', '三文鱼 150g', '紫薯 100g'],
        ],
        totalCalories: 1850,
      },
      likes: 142,
      comments: 28,
      timestamp: '3小时前',
      isLiked: true,
    },
    {
      id: '3',
      author: { name: '减脂达人' },
      content: '坚持打卡第30天！从65kg到现在62kg，感觉整个人都轻盈了！',
      images: [],
      topics: ['#坚持打卡', '#减脂成功'],
      likes: 89,
      comments: 12,
      timestamp: '5小时前',
      isLiked: true,
    },
    {
      id: '4',
      author: { name: '轻食爱好者' },
      content: '早餐来个营养满分的搭配～全麦面包+鸡蛋+牛奶，元气满满的一天开始啦！☀️',
      images: [],
      topics: ['#早餐', '#营养搭配'],
      mealReference: {
        mealType: '早餐',
        items: ['全麦面包 2片', '煮鸡蛋 1个', '牛奶 250ml'],
        totalCalories: 408,
      },
      likes: 56,
      comments: 8,
      timestamp: '8小时前',
      isLiked: false,
    },
  ]);

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-800 px-4 py-4 shadow-sm sticky top-0 z-10 transition-colors">
        <h1 className="text-lg text-gray-900 dark:text-gray-100">动态广场</h1>
      </div>

      {/* 发布按钮 */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors">
        <button
          onClick={onNavigateToCreatePost}
          className="w-full flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-sm">分享你的饮食心得...</span>
          <div className="ml-auto flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <Video className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </button>
      </div>

      {/* 动态列表 */}
      <div className="space-y-2 py-2">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 px-4 py-4 transition-colors">
            {/* 作者信息 */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-gray-900 dark:text-gray-100">{post.author.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</div>
              </div>
            </div>

            {/* 文字内容 */}
            <p className="text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">{post.content}</p>

            {/* 话题标签 */}
            {post.topics && post.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="text-emerald-600 dark:text-emerald-400 text-sm hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}

            {/* 餐食引用 */}
            {post.mealReference && (
              <div className="mb-3">
                {Array.isArray(post.mealReference.mealType) ? (
                  // 多个餐食 - 使用独立卡片展示
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1 mb-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        共{post.mealReference.mealType.length}个餐食
                      </span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        总计 {post.mealReference.totalCalories} kcal
                      </span>
                    </div>
                    {post.mealReference.mealType.map((mealType, mealIndex) => {
                      const mealItems = Array.isArray(post.mealReference.items[mealIndex])
                        ? (post.mealReference.items[mealIndex] as string[])
                        : [];
                      // 简单估算每餐热量（总热量除以餐数）
                      const estimatedCalories = Math.round(
                        post.mealReference.totalCalories / post.mealReference.mealType.length
                      );
                      return (
                        <div
                          key={mealIndex}
                          className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-3 border border-emerald-100 dark:border-emerald-800 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center">
                                <span className="text-white text-[10px]">餐</span>
                              </div>
                              <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">{mealType}</span>
                            </div>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400">
                              约 {estimatedCalories} kcal
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {mealItems.map((item, itemIndex) => (
                              <span
                                key={itemIndex}
                                className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300 border border-emerald-100 dark:border-emerald-800"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // 单个餐食 - 原有样式
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-3 border border-emerald-100 dark:border-emerald-800 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center">
                          <span className="text-white text-xs">餐</span>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-100">{post.mealReference.mealType}</span>
                      </div>
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">
                        {post.mealReference.totalCalories} kcal
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(post.mealReference.items as string[]).map((item, index) => (
                        <span
                          key={index}
                          className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 互动按钮 */}
            <div className="flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-gray-700">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 transition-colors ${
                  post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{post.likes}</span>
              </motion.button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors ml-auto">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 悬浮发布按钮 */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onNavigateToCreatePost}
        className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow z-40"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}