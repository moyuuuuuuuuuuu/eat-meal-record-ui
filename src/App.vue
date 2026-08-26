<script setup lang="ts">
const { theme, themeVars, isDark } = useManualTheme()
</script>

<template>
  <wd-config-provider :theme="theme" :theme-vars="themeVars">
    <view class="page-wraper" :class="{ 'wot-theme-dark': isDark }">
      <slot />
    </view>
  </wd-config-provider>
</template>

<style lang="scss">
page {
  --page-bg: #f9f9f9;
  --card-bg: #ffffff;
  --text-main: #111827;
  --text-sub: #6b7280;
  --border-color: #f3f4f6;
  --surface-subtle: #f5f7f6;
  --brand: #10b981;
  --brand-strong: #059669;
  --brand-soft: #ecfdf5;
  --danger: #ef4444;
  --warning: #f59e0b;
  --nutrient-protein: #3b82f6;
  --nutrient-fat: #f97316;
  --nutrient-carbs: #8b5cf6;

  background-color: var(--page-bg);
  height: 100%;
}

.wot-theme-dark {
  --page-bg: #0f0f0f;
  --card-bg: #1a1a1a;
  --text-main: #ffffff;
  --text-sub: #a0a0a0;
  --border-color: #2f2f2f;
  --surface-subtle: #242424;
  --brand: #34d399;
  --brand-strong: #10b981;
  --brand-soft: #0d2f27;
  --danger: #f87171;
  --warning: #fbbf24;
  --nutrient-protein: #60a5fa;
  --nutrient-fat: #fb923c;
  --nutrient-carbs: #a78bfa;
}

view, scroll-view {
  box-sizing: border-box;
}

.page-wraper {
  min-height: 100vh;
  background: var(--page-bg);
  color: var(--text-main);
}
</style>
