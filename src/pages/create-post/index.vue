<script setup lang="ts">
import type { Topic } from '@/api/globals'
import { useRequest } from 'alova/client'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import IconHash from '@/components/icons/IconHash.vue'
import IconImage from '@/components/icons/IconImage.vue'
import IconMapPin from '@/components/icons/IconMapPin.vue'
import IconVideo from '@/components/icons/IconVideo.vue'
import IconX from '@/components/icons/IconX.vue'

definePage({
  style: {
    navigationBarTitleText: '发布动态',
    navigationStyle: 'custom',
  },
})

interface MealRecord {
  id: string
  mealType: string
  items: { name: string, amount: string, calories: number }[]
  totalCalories: number
}

interface DayMeals {
  date: string
  dateLabel: string
  meals: MealRecord[]
}

const content = ref('')
const showLocation = ref(false)
const selectedTopicIds = ref<number[]>([])
const customTopics = ref<Topic[]>([])
const selectedMeals = ref<MealRecord[]>([])
const showMealSelector = ref(false)
const showCustomTopicInput = ref(false)
const customTopicName = ref('')
const selectedImages = ref<string[]>([])
const selectedVideo = ref<string | null>(null)

const { data: popularTopics, loading: topicLoading } = useRequest(Apis.topic.hot(), {
  immediate: true,
  initialData: [],
})

const showTopicSkeleton = computed(() => {
  return topicLoading.value && popularTopics.value.length === 0
})

const allTopics = computed(() => {
  return [...popularTopics.value, ...customTopics.value]
})

// 模拟近一周餐食记录
function getDateLabel(daysAgo: number) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  if (daysAgo === 0) {
    return '今天'
  }
  if (daysAgo === 1) {
    return '昨天'
  }
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

function handleChooseImage() {
  uni.chooseImage({
    count: 9 - selectedImages.value.length,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      selectedImages.value = [...selectedImages.value, ...(res.tempFilePaths as string[])]
    },
  })
}

function handleChooseVideo() {
  uni.chooseVideo({
    sourceType: ['album', 'camera'],
    compressed: true,
    maxDuration: 60,
    success: (res) => {
      selectedVideo.value = res.tempFilePath
    },
  })
}

function removeImage(index: number) {
  selectedImages.value.splice(index, 1)
}

function removeVideo() {
  selectedVideo.value = null
}

function previewImage(current: string) {
  uni.previewImage({
    urls: selectedImages.value,
    current,
  })
}

function toggleTopic(topicId: number) {
  const index = selectedTopicIds.value.indexOf(topicId)
  if (index > -1) {
    selectedTopicIds.value.splice(index, 1)
  }
  else {
    selectedTopicIds.value.push(topicId)
  }
}

const { loading: creatingTopic, send: createTopicApi } = useRequest(title => Apis.topic.create({ data: { title } }), {
  immediate: false,
})

function handleCreateTopic() {
  showCustomTopicInput.value = !showCustomTopicInput.value
  if (showCustomTopicInput.value) {
    customTopicName.value = ''
  }
}

async function confirmCreateTopic() {
  const title = customTopicName.value.trim()
  if (!title || creatingTopic.value)
    return

  // 检查是否已存在同名话题
  const exists = allTopics.value.find(t => t.title === title)
  if (exists) {
    if (!selectedTopicIds.value.includes(exists.id)) {
      selectedTopicIds.value.push(exists.id)
    }
    showCustomTopicInput.value = false
    customTopicName.value = ''
    return
  }

  try {
    const newTopic = await createTopicApi(title)
    customTopics.value.push(newTopic)
    selectedTopicIds.value.push(newTopic.id)
    showCustomTopicInput.value = false
    customTopicName.value = ''
    uni.showToast({ title: '创建成功', icon: 'success' })
  }
  catch {
    // 错误处理已在全局拦截器中
  }
}

function toggleMealSelection(meal: MealRecord) {
  const index = selectedMeals.value.findIndex(m => m.id === meal.id)
  if (index > -1) {
    selectedMeals.value.splice(index, 1)
  }
  else {
    selectedMeals.value.push(meal)
  }
}

const { loading: publishing, send: publishPost } = useRequest(data => Apis.feed.create({ data }), {
  immediate: false,
})

async function handlePublish() {
  if (!content.value.trim() || publishing.value) {
    return
  }

  uni.showLoading({ title: '正在发布...' })
  try {
    const postData = {
      content: content.value,
      visibility: 1, // 所有人可见
      topic: selectedTopicIds.value,
      images: selectedImages.value,
      video: selectedVideo.value,
      meals: selectedMeals.value.map(m => m.id),
    }

    await publishPost(postData)

    uni.hideLoading()
    uni.showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1500)
  }
  catch {
    uni.hideLoading()
    // 错误处理由 alova 全局拦截或在此处理
  }
}
</script>

<template>
  <view class="page-container h-screen flex flex-col overflow-hidden bg-[var(--page-bg)]">
    <wd-navbar title="发布动态" placeholder left-arrow fixed @click-left="goBack">
      <template #right>
        <view class="publish-btn" :class="{ disabled: !content.trim() }" @click="handlePublish">
          <text>发布</text>
        </view>
      </template>
    </wd-navbar>

    <scroll-view scroll-y class="w-full flex-1">
      <view class="w-full p-4 pb-10 space-y-4">
        <!-- 输入区 -->
        <view class="rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
          <textarea
            v-model="content"
            class="min-h-[160px] w-full text-base text-[var(--text-main)]"
            placeholder="分享你的饮食心得..."
            :maxlength="500"
          />

          <view class="mt-4 flex flex-col gap-4 border-b border-[var(--border-color)] pb-4">
            <!-- 媒体预览 -->
            <view v-if="selectedImages.length > 0 || selectedVideo" class="flex flex-wrap gap-2">
              <!-- 图片预览 -->
              <view v-for="(img, index) in selectedImages" :key="index" class="relative h-20 w-20">
                <image
                  :src="img"
                  mode="aspectFill"
                  class="h-full w-full rounded-lg"
                  @click="previewImage(img)"
                />
                <view
                  class="absolute h-5 w-5 flex items-center justify-center rounded-full bg-black/50 text-white -right-1.5 -top-1.5"
                  @click.stop="removeImage(index)"
                >
                  <IconX size="12" color="#fff" />
                </view>
              </view>

              <!-- 视频预览 -->
              <view v-if="selectedVideo" class="relative h-20 w-20">
                <video
                  :src="selectedVideo"
                  class="h-full w-full rounded-lg"
                  :show-center-play-btn="false"
                  :controls="false"
                />
                <view
                  class="absolute h-5 w-5 flex items-center justify-center rounded-full bg-black/50 text-white -right-1.5 -top-1.5"
                  @click.stop="removeVideo"
                >
                  <IconX size="12" color="#fff" />
                </view>
              </view>
            </view>

            <view class="flex items-center justify-between">
              <view class="flex gap-4">
                <view class="cursor-pointer transition-opacity active:opacity-60" @click="handleChooseImage">
                  <IconImage size="22" :color="selectedImages.length >= 9 ? '#d1d5db' : '#9ca3af'" />
                </view>
                <view class="cursor-pointer transition-opacity active:opacity-60" @click="handleChooseVideo">
                  <IconVideo size="22" :color="selectedVideo ? '#d1d5db' : '#9ca3af'" />
                </view>
              </view>
              <text class="text-xs text-[var(--text-sub)]">
                {{ content.length }}/500
              </text>
            </view>
          </view>
        </view>

        <!-- 话题选择 -->
        <view class="rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
          <view class="mb-4 flex items-center justify-between">
            <view class="flex items-center gap-2">
              <IconHash size="18" color="#10b981" />
              <text class="text-sm text-[var(--text-main)] font-bold">
                推荐话题
              </text>
            </view>
            <view
              class="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-emerald-600 transition-opacity active:opacity-70"
              @click="handleCreateTopic"
            >
              <text class="text-[10px] font-bold">
                + 自建
              </text>
            </view>
          </view>
          <view class="flex flex-wrap gap-2">
            <template v-if="showTopicSkeleton">
              <view v-for="i in 5" :key="i" class="w-16">
                <wd-skeleton
                  :row="1"
                  loading
                  custom-class="!h-6 !rounded-full"
                />
              </view>
            </template>
            <template v-else>
              <view
                v-for="topic in allTopics"
                :key="topic.id"
                class="border rounded-full px-3 py-1.5 text-xs transition-all"
                :class="selectedTopicIds.includes(topic.id)
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-[var(--page-bg)] border-[var(--border-color)] text-[var(--text-sub)]'"
                @click="toggleTopic(topic.id)"
              >
                #{{ topic.title }}
              </view>
            </template>
          </view>

          <!-- 自建话题输入框 -->
          <view v-if="showCustomTopicInput" class="mt-3 flex items-center gap-2">
            <input
              v-model="customTopicName"
              class="h-8 flex-1 border border-[var(--border-color)] rounded-lg bg-[var(--page-bg)] px-2.5 text-xs"
              placeholder="输入话题名称"
              :focus="showCustomTopicInput"
              @confirm="confirmCreateTopic"
            >
            <view
              class="h-8 flex items-center justify-center rounded-lg bg-emerald-500 px-3 text-xs text-white font-bold transition-opacity active:opacity-80"
              :class="{ 'opacity-50': !customTopicName.trim() || creatingTopic }"
              @click="confirmCreateTopic"
            >
              <text>{{ creatingTopic ? '...' : '确认' }}</text>
            </view>
          </view>
        </view>

        <!-- 关联餐食 -->
        <view class="rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
          <view class="flex items-center justify-between" @click="showMealSelector = !showMealSelector">
            <view class="flex items-center gap-3">
              <view class="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-100">
                <text class="text-xs text-emerald-600 font-bold">
                  餐
                </text>
              </view>
              <text class="text-sm text-[var(--text-main)] font-medium">
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
          <view
            v-if="showMealSelector"
            class="mt-4 max-h-[400px] overflow-y-auto border-t border-[var(--border-color)] pt-2 space-y-4"
          >
            <view v-for="day in weekMeals" :key="day.date">
              <view class="mb-2 text-[10px] text-[var(--text-sub)] tracking-tight uppercase">
                {{ day.dateLabel }}
              </view>
              <view class="space-y-2">
                <view
                  v-for="meal in day.meals"
                  :key="meal.id"
                  class="border-2 rounded-lg p-3 transition-all"
                  :class="selectedMeals.some(m => m.id === meal.id)
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-[var(--border-color)] bg-[var(--page-bg)]'"
                  @click="toggleMealSelection(meal)"
                >
                  <view class="mb-1 flex items-center justify-between">
                    <text class="text-xs text-[var(--text-main)] font-bold">
                      {{ meal.mealType }}
                    </text>
                    <text class="text-[10px] text-emerald-600">
                      {{ meal.totalCalories }} kcal
                    </text>
                  </view>
                  <view class="flex flex-wrap gap-1">
                    <text
                      v-for="(item, idx) in meal.items"
                      :key="idx"
                      class="border border-[var(--border-color)] rounded bg-[var(--card-bg)] px-1.5 py-0.5 text-[9px] text-[var(--text-sub)]"
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
            class="flex items-center justify-between border border-emerald-100 rounded-lg from-emerald-50/50 to-teal-50/50 bg-gradient-to-r p-3"
          >
            <view class="flex items-center gap-3">
              <view class="h-6 w-6 flex items-center justify-center rounded bg-emerald-500">
                <text class="text-[10px] text-white">
                  餐
                </text>
              </view>
              <view>
                <text class="block text-xs text-[var(--text-main)] font-bold">
                  {{ meal.mealType }}
                </text>
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
        <view class="flex items-center justify-between rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
          <view class="flex items-center gap-3">
            <IconMapPin size="18" color="#9ca3af" />
            <text class="text-sm text-[var(--text-main)] font-medium">
              显示位置
            </text>
          </view>
          <wd-switch v-model="showLocation" size="small" active-color="#10b981" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.publish-btn {
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  font-size: 13px;
  font-weight: bold;
  color: white;
  background-color: #10b981;
  border-radius: 6px;
}

.publish-btn.disabled {
  background-color: #9ca3af;
  opacity: 0.5;
}
</style>
