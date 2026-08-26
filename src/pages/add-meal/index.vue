<script setup lang="ts">
import { useRequest } from 'alova/client'
import IconCamera from '@/components/icons/IconCamera.vue'
import IconMapPin from '@/components/icons/IconMapPin.vue'
import IconMessageCircle from '@/components/icons/IconMessageCircle.vue'
import IconMic from '@/components/icons/IconMic.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconSave from '@/components/icons/IconSave.vue'
import IconX from '@/components/icons/IconX.vue'
import { useAuth } from '@/composables/useAuth'
import { useSystemInfo } from '@/composables/useSystemInfo'

const { totalHeight, navBarHeight } = useSystemInfo()

definePage({
  style: {
    navigationBarTitleText: '添加餐食',
    navigationStyle: 'custom',
  },
})
const mealType = ref('早餐')
const foodItems = ref<any[]>([])
const showLocation = ref(false)
const locationData = ref<{ latitude: number, longitude: number, address?: string, name?: string } | null>(null)

const { isLogin } = useAuth()

const showAiPopup = ref(false)
const aiInputText = ref('')
const isRecording = ref(false)
const recorderManager = ref<UniApp.RecorderManager | null>(null)
const recognizedFoods = ref<any[]>([])
const showAiResults = ref(false)

// #ifdef MP-WEIXIN || APP-PLUS
recorderManager.value = uni.getRecorderManager()
// #endif

function handleAiRecognize() {
  showAiPopup.value = true
}

async function handleTextRecognize() {
  if (!aiInputText.value.trim())
    return
  await callRecognizeApi(aiInputText.value, 'text')
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader: FileReader = new FileReader()

    reader.onloadend = () => {
      resolve(reader.result as string)
    }

    reader.onerror = () => {
      reject(new Error('FileReader error'))
    }

    reader.readAsDataURL(blob)
  })
}

function handleCameraRecognize() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera', 'album'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]

      // 将图片转换为 base64
      // #ifdef MP-WEIXIN || APP-PLUS
      uni.getFileSystemManager().readFile({
        filePath: tempFilePath,
        encoding: 'base64',
        success: async (fileRes) => {
          await callRecognizeApi(fileRes.data as string, 'image')
        },
      })
      // #endif

      // #ifdef H5
      const file = res.tempFiles[0]

      if (!(file instanceof Blob)) {
        console.error('H5 环境未获取到 File 对象')
        return
      }

      const base64: string = await blobToBase64(file)

      await callRecognizeApi(base64, 'image')
      // #endif
    },
  })
}

function startVoiceRecognize() {
  if (!recorderManager.value) {
    uni.showToast({ title: '当前环境不支持语音识别', icon: 'none' })
    return
  }
  isRecording.value = true
  recorderManager.value.start({
    duration: 20000,
    sampleRate: 16000,
    numberOfChannels: 1,
    encodeBitRate: 48000,
    format: 'wav', // 根据实际后端支持调整
  })

  recorderManager.value.onStop(async (res) => {
    isRecording.value = false
    uni.showLoading({ title: '语音解析中...' })
    uni.getFileSystemManager().readFile({
      filePath: res.tempFilePath,
      encoding: 'base64',
      success: async (fileRes) => {
        await callRecognizeApi(fileRes.data as string, 'audio', { format: 'wav' })
      },
    })
  })
}

function stopVoiceRecognize() {
  if (recorderManager.value) {
    recorderManager.value.stop()
  }
  isRecording.value = false
}

const { send: recognizeApi } = useRequest(data => Apis.food.recognize({ data }), {
  immediate: false,
  timeout: 120000,
})

async function callRecognizeApi(content: string, type: 'text' | 'image' | 'audio', options: any = {}) {
  uni.showLoading({ title: 'AI 识别中...' })
  try {
    const res = await recognizeApi({
      content,
      type,
      options: {
        ...options,
        rate: 16000,
      },
    })
    if (res) {
      recognizedFoods.value = res
      showAiResults.value = true
      showAiPopup.value = false
    }
    else {
      uni.showToast({ title: '未识别到食物', icon: 'none' })
    }
  }
  catch (err) {
    console.error('AI 识别失败', err)
  }
  finally {
    uni.hideLoading()
  }
}

function addRecognizedFood(food: any) {
  // 这里需要模拟 food-selector 的逻辑，将 food 转为 foodItems 格式
  // 由于 recognize 返回的是 FoodInfo & { confidence: number }
  // 我们默认选择其第一个单位，数量为 1
  const unit = food.units && food.units.length > 0 ? food.units[0] : { unit_id: 1, unit_name: food.unit, weight: 100, nutrition: { calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat } }

  const selectedFood = {
    ...food,
    quantity: 1,
    selectedUnit: {
      id: unit.unit_id,
      name: unit.unit_name,
      nutrition: unit.nutrition,
    },
    totalCalories: food.calories,
    totalProtein: food.protein,
    totalFat: food.fat || 0,
    totalCarbs: food.carbs,
  }
  foodItems.value.push(selectedFood)
  uni.showToast({ title: `已添加 ${food.name}`, icon: 'success' })
}

onShow(async () => {
  if (!isLogin.value) {
    uni.navigateTo({
      url: '/pages/login/index',
    })
  }
})
watch(showLocation, async (val) => {
  if (!val) {
    locationData.value = null
    return
  }

  uni.showLoading({ title: '获取位置中...' })

  try {
    let locType: 'gcj02' | 'wgs84' = 'gcj02'

    // #ifdef H5
    const ua = window.navigator.userAgent.toLowerCase()
    const isWechat = ua.includes('micromessenger')
    if (!isWechat)
      locType = 'wgs84'
    // #endif

    const res = await uni.getLocation({ type: locType })

    // 所有平台都调用逆地理编码
    try {
      const geoRes = await Apis.location.reverseGeo({
        params: {
          latitude: res.latitude,
          longitude: res.longitude,
        },
      })
      if (geoRes) {
        res.address = geoRes.address
        res.name = geoRes.name
      }
    }
    catch (geoErr) {
      console.error('逆地理编码失败', geoErr)
    }

    locationData.value = {
      latitude: res.latitude,
      longitude: res.longitude,
      address: res.address || '',
      name: res.name || '',
    }
  }
  catch (err: any) {
    console.error('获取位置失败', err)
    showLocation.value = false

    // #ifdef MP-WEIXIN
    const isAuthErr = err.errMsg && (
      err.errMsg.includes('auth deny')
      || err.errMsg.includes('authorize:fail')
    )
    if (isAuthErr) {
      uni.showModal({
        title: '提示',
        content: '获取位置失败，请在设置中允许使用位置信息',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm)
            uni.openSetting()
        },
      })
      return
    }
    // #endif

    uni.showToast({ title: '获取位置失败', icon: 'none' })
  }
  finally {
    uni.hideLoading()
  }
})

onLoad((options: any) => {
  if (options.type)
    mealType.value = options.type
})

const totals = computed(() => {
  return foodItems.value.reduce((acc, item) => ({
    calories: Number(acc.calories) + Number(item.totalCalories),
    protein: Number(acc.protein) + Number(item.totalProtein),
    fat: Number(acc.fat) + Number(item.totalFat),
    carbs: Number(acc.carbs) + Number(item.totalCarbs),
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 })
})

function goBack() {
  uni.navigateBack()
}

function removeItem(index: number) {
  foodItems.value.splice(index, 1)
}

function goToFoodSelector() {
  uni.navigateTo({
    url: '/pages/food-selector/index',
  })
}

onMounted(() => {
  uni.$on('add-food-item', (item: any) => {
    foodItems.value.push(item)
  })
})

onUnload(() => {
  uni.$off('add-food-item')
})

const { loading: saving, send: addMealApi } = useRequest(data => Apis.diary.addFood({ data }), {
  immediate: false,
})

async function handleSave() {
  if (!foodItems.value.length || saving.value)
    return

  const typeMap: Record<string, number> = {
    早餐: 1,
    午餐: 2,
    晚餐: 3,
    加餐: 4,
  }

  const postData = {
    type: typeMap[mealType.value] || 1,
    latitude: showLocation.value ? locationData.value?.latitude : undefined,
    longitude: showLocation.value ? locationData.value?.longitude : undefined,
    address: showLocation.value ? (locationData.value?.name || locationData.value?.address || '') : '',
    foods: foodItems.value.map(item => ({
      food_id: item.id,
      unit_id: item.selectedUnit?.id,
      number: item.quantity,
      name: item.name,
      image: item.image || '',
    })),
  }

  uni.showLoading({ title: '正在保存...' })
  try {
    await addMealApi(postData)
    uni.hideLoading()
    uni.showToast({ title: '添加成功', icon: 'success' })
    // 通知首页刷新
    uni.$emit('refresh-diary')
    setTimeout(() => uni.navigateBack(), 1500)
  }
  catch (err) {
    uni.hideLoading()
    console.error('保存失败', err)
  }
}
</script>

<template>
  <view class="page-container h-screen flex flex-col overflow-hidden bg-[var(--page-bg)]">
    <wd-navbar title="添加餐食" safe-area-inset-top fixed :custom-style="`--wd-navbar-height: ${navBarHeight}px`">
      <template #left>
        <view class="flex items-center gap-2 pl-2">
          <view class="flex items-center justify-center p-1" @click="goBack">
            <wd-icon name="arrow-left" size="20" />
          </view>
          <view
            class="save-btn from-emerald-500 to-emerald-600 bg-gradient-to-r"
            :class="{ disabled: !foodItems.length || saving }"
            @click="handleSave"
          >
            <IconSave size="14" color="white" />
            <text class="ml-1">
              {{ saving ? '...' : '保存' }}
            </text>
          </view>
        </view>
      </template>
    </wd-navbar>
    <view :style="{ height: `${totalHeight}px` }" />

    <scroll-view scroll-y class="flex-1 px-4 py-4 space-y-4">
      <view class="pb-24 space-y-4">
        <!-- 餐次提示 -->
        <view
          class="flex items-center gap-3 border border-emerald-100 rounded-xl bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20"
        >
          <view class="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgb(16,185,129,0.6)]" />
          <text class="text-sm text-[var(--text-main)] font-bold">
            正在添加：
          </text>
          <text class="text-sm text-emerald-600 font-bold">
            {{ mealType }}
          </text>
        </view>

        <!-- 添加按钮 -->
        <view class="flex gap-3">
          <view
            class="flex flex-1 flex-col items-center justify-center gap-2 border-2 border-[var(--border-color)] rounded-xl border-dashed bg-[var(--card-bg)] p-6 transition-all active:border-emerald-500 active:bg-emerald-50"
            @click="goToFoodSelector"
          >
            <view
              class="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500/50 text-emerald-500 dark:bg-emerald-900/20"
            >
              <IconPlus size="20" color="white" />
            </view>
            <text class="text-sm text-emerald-600 font-bold">
              手动添加
            </text>
          </view>
          <view
            class="flex flex-1 flex-col items-center justify-center gap-2 border-2 border-emerald-100 rounded-xl border-dashed bg-emerald-50/30 p-6 transition-all active:border-emerald-500 active:bg-emerald-50"
            @click="handleAiRecognize"
          >
            <view
              class="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-emerald-200 shadow-lg"
            >
              <IconCamera size="20" color="white" />
            </view>
            <text class="text-sm text-emerald-600 font-bold">
              AI 识别
            </text>
          </view>
        </view>

        <!-- 位置信息 -->
        <view class="rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
          <view class="flex items-center justify-between">
            <view class="flex items-center gap-3">
              <IconMapPin size="14" color="#9ca3af" />
              <text class="text-sm text-[var(--text-main)] font-medium">
                显示位置
              </text>
            </view>
            <wd-switch v-model="showLocation" size="small" active-color="#10b981" />
          </view>
          <view v-if="showLocation && locationData" class="mt-2 pl-7">
            <text class="text-xs text-emerald-600 font-medium">
              {{ locationData.address || '正在获取位置...' }}
            </text>
          </view>
        </view>

        <!-- 汇总卡片 -->
        <view
          v-if="foodItems.length"
          class="border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)] p-4 shadow-sm transition-all dark:border-[var(--wot-color-theme)]/10"
        >
          <text class="mb-4 block text-[10px] text-[var(--text-sub)] font-bold uppercase">
            今日营养汇总
          </text>
          <view class="grid grid-cols-2 gap-3">
            <view class="border border-[var(--border-color)] rounded-lg bg-[var(--page-bg)] p-3 shadow-sm">
              <view class="mb-1 text-[10px] text-[var(--text-sub)]">
                热量
              </view>
              <view class="text-xl text-emerald-500 font-bold">
                {{ totals.calories.toFixed(0) }}
                <text class="ml-1 text-[10px] text-[var(--text-sub)] font-normal">
                  kcal
                </text>
              </view>
            </view>
            <view class="border border-[var(--border-color)] rounded-lg bg-[var(--page-bg)] p-3 shadow-sm">
              <view class="mb-1 text-[10px] text-[var(--text-sub)]">
                蛋白质
              </view>
              <view class="text-xl text-blue-500 font-bold dark:text-blue-400">
                {{ totals.protein.toFixed(1) }}
                <text class="ml-1 text-[10px] text-[var(--text-sub)] font-normal">
                  g
                </text>
              </view>
            </view>
            <view class="border border-[var(--border-color)] rounded-lg bg-[var(--page-bg)] p-3 shadow-sm">
              <view class="mb-1 text-[10px] text-[var(--text-sub)]">
                脂肪
              </view>
              <view class="text-xl text-orange-500 font-bold dark:text-orange-400">
                {{ totals.fat.toFixed(1) }}
                <text class="ml-1 text-[10px] text-[var(--text-sub)] font-normal">
                  g
                </text>
              </view>
            </view>
            <view class="border border-[var(--border-color)] rounded-lg bg-[var(--page-bg)] p-3 shadow-sm">
              <view class="mb-1 text-[10px] text-[var(--text-sub)]">
                碳水
              </view>
              <view class="text-xl text-purple-500 font-bold dark:text-purple-400">
                {{ totals.carbs.toFixed(1) }}
                <text class="ml-1 text-[10px] text-[var(--text-sub)] font-normal">
                  g
                </text>
              </view>
            </view>
          </view>
        </view>

        <!-- 已添加食物 -->
        <view v-if="foodItems.length" class="rounded-xl bg-[var(--card-bg)] p-4 shadow-sm">
          <view class="mb-3 flex items-center justify-between px-1">
            <text class="text-xs text-[var(--text-sub)] font-bold uppercase">
              已选食物
            </text>
            <text class="text-[10px] text-[var(--text-sub)]/40">
              {{ foodItems.length }} 项
            </text>
          </view>
          <view class="space-y-3">
            <view
              v-for="(item, index) in foodItems" :key="index"
              class="flex items-center justify-between rounded-lg bg-[var(--page-bg)] p-3"
            >
              <view>
                <view class="mb-1 flex items-center gap-2">
                  <text class="text-sm text-[var(--text-main)] font-bold">
                    {{ item.name }}
                  </text>
                  <text class="text-xs text-emerald-600 font-bold">
                    {{ item.quantity }} {{ item.selectedUnit.name }}
                  </text>
                </view>
                <text class="text-[10px] text-[var(--text-sub)]">
                  {{ item.totalCalories || 0 }}kcal | 蛋白质:{{ item.totalProtein || 0 }}g 脂肪:{{ item.totalFat || 0 }}g 碳水:{{ item.totalCarbs || 0 }}g
                </text>
              </view>
              <view class="p-1" @click="removeItem(index)">
                <IconX size="14" color="#ef4444" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- AI 识别入口弹窗 -->
    <wd-popup
      v-model="showAiPopup"
      position="bottom"
      close-on-click-modal
      safe-area-inset-bottom
      custom-style="border-radius: 20px 20px 0 0; background: var(--card-bg);"
    >
      <view class="p-5">
        <view class="mb-6 flex items-center justify-between">
          <view class="p-2" aria-label="关闭 AI 识别" @click="showAiPopup = false">
            <IconX size="20" color="var(--text-main)" />
          </view>
          <text class="text-base text-[var(--text-main)] font-bold">
            AI 识别食物
          </text>
          <view class="w-7" />
        </view>

        <view class="space-y-6">
          <!-- 文字输入 -->
          <view class="rounded-xl bg-[var(--page-bg)] p-3">
            <textarea
              v-model="aiInputText"
              class="h-24 w-full text-sm text-[var(--text-main)]"
              placeholder="例如：我吃了两碗米饭，一份黄焖鸡..."
            />
            <view class="mt-2 flex justify-end">
              <view
                class="flex items-center gap-1 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs text-white font-bold transition-opacity active:opacity-80"
                @click="handleTextRecognize"
              >
                <IconMessageCircle size="14" color="white" />
                <text>文字识别</text>
              </view>
            </view>
          </view>

          <!-- 拍照与语音 -->
          <view class="flex gap-4">
            <view
              class="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl bg-emerald-50/50 py-6 transition-all active:bg-emerald-100/50"
              @click="handleCameraRecognize"
            >
              <view class="h-12 w-12 flex items-center justify-center rounded-full bg-cyan-500/50 text-emerald-500 shadow-sm">
                <IconCamera size="24" color="white" />
              </view>
              <text class="text-xs text-emerald-600 font-bold">
                拍摄照片
              </text>
            </view>

            <view
              class="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl py-6 transition-all"
              :class="isRecording ? 'bg-red-50' : 'bg-emerald-50/50 active:bg-emerald-100/50'"
              @touchstart="startVoiceRecognize"
              @touchend="stopVoiceRecognize"
              @touchcancel="stopVoiceRecognize"
            >
              <view
                class="h-12 w-12 flex items-center justify-center rounded-full shadow-sm"
                :class="isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500/50 text-emerald-500'"
              >
                <IconMic size="24" color="white" />
              </view>
              <text class="text-xs font-bold" :class="isRecording ? 'text-red-600' : 'text-emerald-600'">
                {{ isRecording ? '松开识别' : '按住说话' }}
              </text>
            </view>
          </view>
        </view>
        <view class="mt-8 text-center text-[10px] text-[var(--text-sub)]/60">
          AI 识别结果仅供参考，请以实际为准
        </view>
      </view>
    </wd-popup>

    <!-- 识别结果弹窗 -->
    <wd-popup
      v-model="showAiResults"
      position="bottom"
      custom-style="border-radius: 24px 24px 0 0; background: var(--card-bg);"
    >
      <view class="p-6">
        <view class="mb-6 flex items-center justify-between">
          <view class="p-2" @click="showAiResults = false">
            <IconX size="20" color="var(--text-main)" />
          </view>
          <text class="text-lg text-[var(--text-main)] font-bold">
            识别结果
          </text>
          <view class="w-10" />
        </view>

        <view class="max-h-[60vh] overflow-y-auto px-1 pb-4 space-y-3">
          <view
            v-for="(food, idx) in recognizedFoods"
            :key="idx"
            class="flex items-center justify-between border border-[var(--border-color)] rounded-xl bg-[var(--page-bg)] p-4 transition-all active:border-emerald-500"
            @click="addRecognizedFood(food)"
          >
            <view>
              <view class="mb-1 flex items-center gap-2">
                <text class="text-sm text-[var(--text-main)] font-bold">
                  {{ food.name }}
                </text>
                <text class="text-[10px] text-emerald-600 font-bold">
                  匹配度 {{ Math.round(food.confidence || 98) }}%
                </text>
              </view>
              <view class="flex gap-2 text-[10px] text-[var(--text-sub)]">
                <text>{{ food.calories }}kcal / {{ food.unit }}</text>
                <text>蛋白质:{{ food.protein }}g 脂肪:{{ food.fat }}g 碳水:{{ food.carbs }}g</text>
              </view>
            </view>
            <IconPlus size="16" color="#10b981" />
          </view>
        </view>

        <view class="mt-6 flex gap-3">
          <wd-button plain block type="success" size="large" @click="showAiResults = false">
            取消
          </wd-button>
          <wd-button block type="success" size="large" class="from-emerald-500 to-emerald-600 bg-gradient-to-r" @click="showAiResults = false">
            完成
          </wd-button>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<style scoped>
.save-btn {
  color: white;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  font-size: 13px;
  display: flex;
  align-items: center;
  font-weight: bold;
}

.save-btn.disabled {
  opacity: 0.5;
  background-color: #9ca3af;
}
</style>
