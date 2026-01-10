import { useState } from 'react';
import { Plus, X, Sunrise, Sun, Moon, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingActionButtonProps {
  onSelectMeal: (mealType: '早餐' | '午餐' | '晚餐' | '加餐') => void;
}

export function FloatingActionButton({ onSelectMeal }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const mealOptions = [
    { type: '早餐' as const, icon: Sunrise, color: 'bg-orange-500 dark:bg-orange-600' },
    { type: '午餐' as const, icon: Sun, color: 'bg-yellow-500 dark:bg-yellow-600' },
    { type: '晚餐' as const, icon: Moon, color: 'bg-indigo-500 dark:bg-indigo-600' },
    { type: '加餐' as const, icon: Coffee, color: 'bg-amber-600 dark:bg-amber-700' },
  ];

  const handleMealSelect = (mealType: '早餐' | '午餐' | '晚餐' | '加餐') => {
    onSelectMeal(mealType);
    setIsOpen(false);
  };

  return (
    <motion.div
      drag
      dragConstraints={{
        top: -window.innerHeight + 150,
        left: -window.innerWidth + 100,
        right: 0,
        bottom: 0,
      }}
      dragElastic={0.1}
      dragMomentum={false}
      className="fixed bottom-20 right-6 z-50"
      style={{ touchAction: 'none' }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2"
          >
            {mealOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.button
                  key={option.type}
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, y: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleMealSelect(option.type)}
                  className={`${option.color} text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-500 dark:bg-emerald-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors cursor-move"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}