
<template>
  <view class="page-container bg-[var(--page-bg)] h-screen flex flex-col overflow-hidden">
    <wd-navbar title="发布动态" fixed placeholder left-arrow @click-left="goBack">
      <template #right>
        <view class="publish-btn" :class="{ 'disabled': !content.trim() }" @click="handlePublish">
          <text>发布</text>
        </view>
      </template>
    </wd-navbar>

    <scroll-view scroll-y class="flex-1 w-full">
      <view class="p-4 space-y-4 pb-10 w-full">
        <!-- 输入区 -->
        <view class="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm">
          <textarea
            v-model="content"
            class="w-full min-h-[160px] text-base text-[var(--text-main)]"
            placeholder="分享你的饮食心得..."
            :maxlength="500"
          />

          <view class="flex items-center justify-between mt-4 pb-2 border-b border-[var(--border-color)]">
            <view class="flex gap-4">
              <IconImage size="22" color="#9ca3af" />
              <IconVideo size="22" color="#9ca3af" />
            </view>
            <text class="text-xs text-[var(--text-sub)]">{{ content.length }}/500</text>
          </view>
        </view>

      <!-- 话题选择 -->
      <view class="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm">
        <view class="flex items-center gap-2 mb-4">
          <IconHash size="18" color="#10b981" />
          <text class="text-sm font-bold text-[var(--text-main)]">推荐话题</text>
        </view>
        <view class="flex flex-wrap gap-2">
          <view
            v-for="topic in popularTopics"
            :key="topic"
            class="px-3 py-1.5 rounded-full text-xs transition-all border"
            :class="selectedTopics.includes(topic)
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'bg-[var(--page-bg)] border-[var(--border-color)] text-[var(--text-sub)]'"
            @click="toggleTopic(topic)"
          >
            {{ topic }}
          </view>
        </view>
      </view>

      <!-- 关联餐食 -->
      <view class="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm">
        <view class="flex items-center justify-between" @click="showMealSelector = !showMealSelector">
          <view class="flex items-center gap-3">
            <view class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <text class="text-emerald-600 text-xs font-bold">餐</text>
            </view>
            <text class="text-sm font-medium text-[var(--text-main)]">
              {{ selectedMeals.length > 0 ? `已关联 ${selectedMeals.length}个餐食` : '关联餐食记录' }}
            </text>
          </view>
          <IconChevronRight
            size="16"
            color="#9ca3af"
            :style="{ transform: showMealSelector ? 'rotate(90deg)' : 'rotate(0)', transition: 'all 0.3s' }"
          />
        </view>

        <!-- 选择器区域 -->
        <view v-if="showMealSelector" class="mt-4 space-y-4 max-h-[400px] overflow-y-auto pt-2 border-t border-[var(--border-color)]">
          <view v-for="day in weekMeals" :key="day.date">
            <view class="text-[10px] text-[var(--text-sub)] mb-2 uppercase tracking-tight">{{ day.dateLabel }}</view>
            <view class="space-y-2">
              <view
                v-for="meal in day.meals"
                :key="meal.id"
                class="p-3 rounded-lg border-2 transition-all"
                :class="selectedMeals.some(m => m.id === meal.id)
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-[var(--border-color)] bg-[var(--page-bg)]'"
                @click="toggleMealSelection(meal)"
              >
                <view class="flex items-center justify-between mb-1">
                  <text class="text-xs font-bold text-[var(--text-main)]">{{ meal.mealType }}</text>
                  <text class="text-[10px] text-emerald-600">{{ meal.totalCalories }} kcal</text>
                </view>
                <view class="flex flex-wrap gap-1">
                  <text
                    v-for="(item, idx) in meal.items"
                    :key="idx"
                    class="text-[9px] bg-[var(--card-bg)] px-1.5 py-0.5 rounded text-[var(--text-sub)] border border-[var(--border-color)]"
                  >
                    {{ item.name }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 已关联餐食详细展示 -->
      <view v-if="selectedMeals.length > 0 && !showMealSelector" class="space-y-2">
        <view
          v-for="meal in selectedMeals"
          :key="meal.id"
          class="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-lg p-3 border border-emerald-100 flex items-center justify-between"
        >
          <view class="flex items-center gap-3">
            <view class="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
              <text class="text-white text-[10px]">餐</text>
            </view>
            <view>
              <text class="text-xs font-bold text-[var(--text-main)] block">{{ meal.mealType }}</text>
              <text class="text-[9px] text-[var(--text-sub)]">
                {{ meal.items.map(i => i.name).join(', ') }} ({{ meal.totalCalories }}kcal)
              </text>
            </view>
          </view>
          <view class="p-1" @click="toggleMealSelection(meal)">
            <IconX size="14" color="#9ca3af" />
          </view>
        </view>
      </view>

      <!-- 位置信息 -->
      <view class="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm flex items-center justify-between">
        <view class="flex items-center gap-3">
          <IconMapPin size="18" color="#9ca3af" />
          <text class="text-sm font-medium text-[var(--text-main)]">显示位置</text>
        </view>
        <wd-switch v-model="showLocation" size="small" active-color="#10b981" />
      </view>
    </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '发布动态',
    navigationStyle: 'custom',
  },
})
import IconImage from '@/components/icons/IconImage.vue'
import IconVideo from '@/components/icons/IconVideo.vue'
import IconHash from '@/components/icons/IconHash.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import IconX from '@/components/icons/IconX.vue'
import IconMapPin from '@/components/icons/IconMapPin.vue'

interface MealRecord {
  id: string
  mealType: string
  items: { name: string; amount: string; calories: number }[]
  totalCalories: number
}

interface DayMeals {
  date: string
  dateLabel: string
  meals: MealRecord[]
}

const content = ref('')
const showLocation = ref(false)
const selectedTopics = ref<string[]>([])
const selectedMeals = ref<MealRecord[]>([])
const showMealSelector = ref(false)

const popularTopics = ['#健康饮食', '#减脂餐', '#全天打卡', '#增肌', '#营养均衡', '#自制午餐']

// 模拟近一周餐食记录
const getDateLabel = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  if (daysAgo === 0) return '今天'
  if (daysAgo === 1) return '昨天'
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const weekMeals: DayMeals[] = [
  {
    date: '2026-01-29',
    dateLabel: getDateLabel(0),
    meals: [
      {
        id: '1-1',
        mealType: '早餐',
        items: [
          { name: '燕麦粥', amount: '200g', calories: 150 },
          { name: '煮鸡蛋', amount: '1个', calories: 78 },
        ],
        totalCalories: 228,
      },
      {
        id: '1-2',
        mealType: '午餐',
        items: [
          { name: '糙米饭', amount: '150g', calories: 171 },
          { name: '鸡胸肉', amount: '120g', calories: 130 },
        ],
        totalCalories: 301,
      },
    ],
  },
  {
    date: '2026-01-28',
    dateLabel: getDateLabel(1),
    meals: [
      {
        id: '2-1',
        mealType: '晚餐',
        items: [
          { name: '蔬菜沙拉', amount: '200g', calories: 85 },
          { name: '煎牛排', amount: '150g', calories: 250 },
        ],
        totalCalories: 335,
      },
    ],
  },
]

function goBack() {
  uni.navigateBack()
}

function toggleTopic(topic: string) {
  const index = selectedTopics.value.indexOf(topic)
  if (index > -1) {
    selectedTopics.value.splice(index, 1)
  } else {
    selectedTopics.value.push(topic)
  }
}

function toggleMealSelection(meal: MealRecord) {
  const index = selectedMeals.value.findIndex(m => m.id === meal.id)
  if (index > -1) {
    selectedMeals.value.splice(index, 1)
  } else {
    selectedMeals.value.push(meal)
  }
}

function handlePublish() {
  if (!content.value.trim()) return
  uni.showLoading({ title: '正在发布...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1500)
  }, 1000)
}
</script>

<style scoped>
.publish-btn {
  background-color: #10b981;
  color: white;
  height: 28px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  display: flex;
  align-items: center;
}
.publish-btn.disabled {
  opacity: 0.5;
  background-color: #9ca3af;
}
</style>
