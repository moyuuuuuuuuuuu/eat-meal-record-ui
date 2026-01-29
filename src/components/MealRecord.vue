<template>
  <view v-if="foods.length" class="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm mb-4">
    <view class="flex items-center justify-between mb-3">
      <view class="text-sm font-bold text-[var(--text-main)]">{{ mealType }}</view>
      <view class="text-xs text-[var(--text-sub)]">共 {{ totalCalories }} kcal</view>
    </view>

    <view class="space-y-3">
      <view
        v-for="food in foods"
        :key="food.id"
        class="flex items-start justify-between border-l-4 border-emerald-500 pl-3 py-2 bg-[var(--page-bg)] rounded"
      >
        <view class="flex-1">
          <view class="flex items-center gap-2 mb-1">
            <text class="text-sm font-medium text-[var(--text-main)]">{{ food.name }}</text>
            <text class="text-xs text-[var(--text-sub)]">{{ food.amount }}{{ food.unit }}</text>
          </view>
          <view class="flex gap-3 text-[10px] text-[var(--text-sub)]">
            <text>热量: {{ food.calories }}kcal</text>
            <text>蛋白: {{ food.protein }}g</text>
            <text>脂肪: {{ food.fat }}g</text>
            <text>碳水: {{ food.carbs }}g</text>
          </view>
        </view>
        <view class="p-1" @click="$emit('delete-food', food.id)">
          <IconTrash2 size="12" color="#9ca3af" />
        </view>
      </view>
    </view>

    <view v-if="foods.length > 1" class="mt-3 pt-3 border-t border-[var(--border-color)] flex gap-4 text-[10px] text-[var(--text-sub)]">
      <text>蛋白质: {{ totalNutrients.protein.toFixed(1) }}g</text>
      <text>脂肪: {{ totalNutrients.fat.toFixed(1) }}g</text>
      <text>碳水: {{ totalNutrients.carbs.toFixed(1) }}g</text>
    </view>
  </view>
</template>

<script setup lang="ts">
export interface FoodItem {
  id: string
  name: string
  amount: number
  unit: string
  calories: number
  protein: number
  fat: number
  carbs: number
}

const props = defineProps<{
  mealType: string
  foods: FoodItem[]
}>()

defineEmits(['delete-food'])

const totalCalories = computed(() => props.foods.reduce((sum, f) => sum + f.calories, 0))
const totalNutrients = computed(() => props.foods.reduce((acc, f) => ({
  protein: acc.protein + f.protein,
  fat: acc.fat + f.fat,
  carbs: acc.carbs + f.carbs
}), { protein: 0, fat: 0, carbs: 0 }))
</script>
