<template>
  <view class="fab-container">
    <wd-fab
      v-model:active="active"
      type="primary"
      position="right-bottom"
      :gap="{ bottom: 100, right: 20 }"
    >
      <template #default>
        <view
          v-for="(item, index) in actions"
          :key="index"
          class="fab-item"
          :style="{ backgroundColor: item.color }"
          @click="handleClick(item.type)"
        >
          <component :is="item.icon" size="20" color="white" />
        </view>
      </template>
      <template #trigger>
        <view class="fab-trigger" @click="active = !active">
          <IconPlus :size="active ? 28 : 24" color="white" :style="{ transform: active ? 'rotate(135deg)' : 'rotate(0)', transition: 'all 0.3s' }" />
        </view>
      </template>
    </wd-fab>
  </view>
</template>

<script setup lang="ts">
import IconSunrise from './icons/IconSunrise.vue'
import IconSun from './icons/IconSun.vue'
import IconMoon from './icons/IconMoon.vue'
import IconCoffee from './icons/IconCoffee.vue'

const active = ref(false)

const actions = [
  { type: '早餐', icon: IconSunrise, color: '#f97316' },
  { type: '午餐', icon: IconSun, color: '#eab308' },
  { type: '晚餐', icon: IconMoon, color: '#6366f1' },
  { type: '加餐', icon: IconCoffee, color: '#92400e' },
]

const emit = defineEmits(['select'])

function handleClick(type: string) {
  emit('select', type)
  active.value = false
}
</script>

<style scoped>
.fab-trigger {
  width: 56px;
  height: 56px;
  background-color: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}
.fab-item {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
