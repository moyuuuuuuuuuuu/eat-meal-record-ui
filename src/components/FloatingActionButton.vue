<script setup lang="ts">
import IconCoffee from './icons/IconCoffee.vue'
import IconMoon from './icons/IconMoon.vue'
import IconSun from './icons/IconSun.vue'
import IconSunrise from './icons/IconSunrise.vue'

const emit = defineEmits(['select'])

const active = ref(false)

const actions = [
  { type: '加餐', icon: IconCoffee, color: '#92400e' },
  { type: '晚餐', icon: IconMoon, color: '#6366f1' },
  { type: '午餐', icon: IconSun, color: '#eab308' },
  { type: '早餐', icon: IconSunrise, color: '#f97316' },
]

function handleClick(type: string) {
  emit('select', type)
  active.value = false
}
</script>

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
          <IconCoffee v-if="item.icon === IconCoffee" size="20" color="white" />
          <IconMoon v-else-if="item.icon === IconMoon" size="20" color="white" />
          <IconSun v-else-if="item.icon === IconSun" size="20" color="white" />
          <IconSunrise v-else-if="item.icon === IconSunrise" size="20" color="white" />
          <!--          <component :is="item.icon" size="20" color="white" /> -->
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
