<script setup lang="ts">
/**
 * FeedMediaAttach —— 动态附件媒体渲染组件
 *
 * 支持三种附件类型：
 *   type 0 → 图片
 *   type 1 → 视频
 *   type 4 → 餐食记录卡片
 *
 * Props:
 *   attach   附件列表（post.attach / detail.attach）
 *   variant  'list'   列表页：图片 96×96 网格
 *            'detail' 详情页：多图合并为 swiper，视频/餐食逐条展示
 *
 * Emits:
 *   preview-image(src: string)  点击图片时抛出，由父级调用 uni.previewImage
 */

import { computed, ref } from 'vue'

interface AttachItem {
  /** 0=图片  1=视频  4=餐食记录 */
  type: 0 | 1 | 4
  attach: any
  poster?: string
}

const props = withDefaults(
  defineProps<{
    attach?: AttachItem[]
    variant?: 'list' | 'detail'
  }>(),
  {
    attach: () => [],
    variant: 'list',
  },
)

const emit = defineEmits<{
  (e: 'preview-image', src: string): void
}>()

const isDetail = computed(() => props.variant === 'detail')

// 详情页：把所有图片附件聚合成一个数组，统一放入 swiper
const detailImages = computed(() =>
  (props.attach ?? [])
    .filter(item => item.type === 0)
    .map(item => item.attach as string),
)

// 详情页：非图片附件（视频、餐食）保持原顺序单独渲染
const detailNonImages = computed(() =>
  (props.attach ?? []).filter(item => item.type !== 0),
)

// swiper 当前页索引，用于右下角 x/n 指示器
const swiperCurrent = ref(0)
</script>

<template>
  <view v-if="attach && attach.length">
    <!-- ══════════════════════════════════════════
         列表页：图片网格 + 视频 + 餐食 逐条渲染
    ══════════════════════════════════════════ -->
    <view v-if="!isDetail" class="mb-3 flex flex-wrap gap-2">
      <template v-for="(item, index) in attach" :key="index">
        <!-- 图片：原生 image，圆角直接生效 -->
        <image
          v-if="item.type === 0"
          :src="item.attach"
          mode="aspectFill"
          style="width: 96px; height: 96px; border-radius: 8px; display: block; flex-shrink: 0;"
          @click.stop="emit('preview-image', item.attach)"
        />

        <!-- 视频 -->
        <view v-else-if="item.type === 1" class="h-24 w-40 overflow-hidden rounded-lg">
          <video
            :src="item.attach"
            :poster="item.poster"
            class="h-full w-full"
            :controls="true"
            @click.stop
          />
        </view>

        <!-- 餐食记录 -->
        <view
          v-else-if="item.type === 4"
          class="w-full border border-emerald-500/10 rounded-xl bg-emerald-500/5 p-3.5 shadow-sm"
        >
          <view class="mb-1 flex items-center justify-between">
            <view class="flex items-center gap-1">
              <view class="h-4 w-4 flex items-center justify-center rounded bg-emerald-500">
                <text class="text-[8px] text-white">
                  餐
                </text>
              </view>
              <text class="text-xs text-[var(--text-main)] font-medium">
                {{ item.attach.type }}
              </text>
            </view>
            <text class="text-xs text-emerald-600">
              {{ item.attach.calories }} kcal
            </text>
          </view>
          <view class="flex flex-wrap gap-1">
            <text
              v-for="(food, idx) in item.attach.foods"
              :key="idx"
              class="text-[11px] text-[var(--text-sub)]"
            >
              {{ food }}{{ Number(idx) < item.attach.foods.length - 1 ? '、' : '' }}
            </text>
          </view>
        </view>
      </template>
    </view>

    <!-- ══════════════════════════════════════════
         详情页
    ══════════════════════════════════════════ -->
    <view v-else class="mb-6 space-y-3">
      <!-- 图片 swiper（有图片时才渲染） -->
      <view
        v-if="detailImages.length"
        class="relative overflow-hidden rounded-xl shadow-sm"
        style="width: 100%;"
      >
        <swiper
          :current="swiperCurrent"
          circular
          style="width: 100%; height: 280px;"
          @change="(e: any) => swiperCurrent = e.detail.current"
        >
          <swiper-item
            v-for="(src, idx) in detailImages"
            :key="idx"
            style="width: 100%; height: 100%;"
          >
            <image
              :src="src"
              mode="aspectFill"
              style="width: 100%; height: 100%; display: block;"
              @click.stop="emit('preview-image', src)"
            />
          </swiper-item>
        </swiper>

        <!-- 右下角 x/n 页码指示器（多于 1 张才显示） -->
        <view
          v-if="detailImages.length > 1"
          class="absolute bottom-2.5 right-3 flex items-center rounded-full bg-black/40 px-2 py-0.5"
        >
          <text class="text-[11px] text-white">
            {{ swiperCurrent + 1 }}/{{ detailImages.length }}
          </text>
        </view>
      </view>

      <!-- 视频 & 餐食记录 -->
      <template v-for="(item, index) in detailNonImages" :key="index">
        <!-- 视频 -->
        <view v-if="item.type === 1" class="aspect-video overflow-hidden rounded-xl bg-black">
          <video
            :src="item.attach"
            :poster="item.poster"
            class="h-full w-full"
            controls
          />
        </view>

        <!-- 餐食记录 -->
        <view
          v-else-if="item.type === 4"
          class="w-full border border-emerald-500/10 rounded-xl bg-emerald-500/5 p-4 shadow-sm"
        >
          <view class="mb-2 flex items-center justify-between">
            <view class="flex items-center gap-2">
              <view class="h-5 w-5 flex items-center justify-center rounded bg-emerald-500">
                <text class="text-[11px] text-white">
                  餐
                </text>
              </view>
              <text class="text-sm text-[var(--text-main)] font-semibold">
                {{ item.attach.type }}
              </text>
            </view>
            <text class="text-sm text-emerald-600 font-medium">
              {{ item.attach.calories }} kcal
            </text>
          </view>
          <view class="flex flex-wrap gap-2">
            <wd-badge
              v-for="(food, idx) in item.attach.foods"
              :key="idx"
              :value="food"
              type="primary"
              plain
            />
          </view>
        </view>
      </template>
    </view>
  </view>
</template>
