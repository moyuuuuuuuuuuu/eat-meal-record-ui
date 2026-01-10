import { defineStore } from 'pinia';
import type { Theme } from '@/types';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'system' as Theme,
    effectiveTheme: 'light' as 'light' | 'dark'
  }),

  actions: {
    setTheme(theme: Theme) {
      this.theme = theme;
      this.applyTheme();
      uni.setStorageSync('theme', theme);

      uni.showToast({
        title: `主题已切换`,
        icon: 'success'
      });
    },

    applyTheme() {
      let applied: 'light' | 'dark' = 'light';

      if (this.theme === 'system') {
        const systemInfo = uni.getSystemInfoSync();
        applied = systemInfo.theme === 'dark' ? 'dark' : 'light';
      } else {
        applied = this.theme;
      }

      this.effectiveTheme = applied;

      // 应用深色模式
      // Wot UI 深色模式通过在页面根元素添加 class="dark" 实现
      // 这里我们通过 uni.setNavigationBarColor 和页面样式来处理

      if (applied === 'dark') {
        uni.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#111827'
        });
      } else {
        uni.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#ffffff'
        });
      }
    },

    loadFromStorage() {
      const theme = uni.getStorageSync('theme');
      if (theme) {
        this.theme = theme;
        this.applyTheme();
      } else {
        this.applyTheme(); // 初始化系统主题
      }
    },

    // 监听系统主题变化
    watchSystemTheme() {
      // Uniapp 不支持直接监听系统主题变化
      // 可以在应用显示时重新应用主题
      uni.onAppShow(() => {
        if (this.theme === 'system') {
          this.applyTheme();
        }
      });
    }
  }
});
