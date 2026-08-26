<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useSystemInfo } from '@/composables/useSystemInfo'

const { fixedNavbarHeight } = useSystemInfo()

definePage({
  style: {
    navigationBarTitleText: '营养统计',
    navigationStyle: 'custom',
  },
})

type Period = 'week' | 'month' | 'quarter' | 'year'

const periods: { key: Period, label: string }[] = [
  { key: 'week', label: '本周' },
  { key: 'month', label: '本月' },
  { key: 'quarter', label: '本季' },
  { key: 'year', label: '本年' },
]

const activePeriod = ref<Period>('week')

const dimensions = [
  { key: 'kcal', label: '热量', unit: 'kcal', dri: 2000 },
  { key: 'pro', label: '蛋白质', unit: 'g', dri: 60 },
  { key: 'fat', label: '脂肪', unit: 'g', dri: 60 },
  { key: 'carb', label: '碳水', unit: 'g', dri: 300 },
  { key: 'fiber', label: '纤维', unit: 'g', dri: 25 },
  { key: 'na', label: '钠', unit: 'mg', dri: 2000 },
]

interface StatsResponse {
  period: Period
  date_range: { start: string, end: string }
  days: number
  nutrition: Record<string, number>
  totals: Record<string, number>
  score: number
  score_level: string
}

const loading = ref(false)
const apiScore = ref<number | null>(null)
const statsData = ref<Record<string, number>>({
  kcal: 0,
  pro: 0,
  fat: 0,
  carb: 0,
  fiber: 0,
  na: 0,
})
async function fetchStats(period: Period) {
  loading.value = true
  try {
    const res = await Apis.nutrition.stats({ params: { period } })
    const data = res as unknown as StatsResponse // res 本身就是 data
    statsData.value = data.nutrition
    apiScore.value = data.score
  }
  catch (e) {
    console.error('[nutrition-stats] fetch error', e)
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
  finally {
    loading.value = false
  }
}

watch(activePeriod, p => fetchStats(p))
onMounted(() => fetchStats('week'))

// ── 雷达图 SVG 计算 ────────────────────────────────────────
const CX = 140
const CY = 140
const R = 92
const N = dimensions.length
const LEVELS = [20, 40, 60, 80, 100]

function angle(i: number) {
  return (360 / N) * i - 90
}
function polarXY(deg: number, r: number) {
  const rad = deg * (Math.PI / 180)
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}
function polyPoints(r: number) {
  return Array.from({ length: N }, (_, i) => {
    const p = polarXY(angle(i), r)
    return `${p.x},${p.y}`
  }).join(' ')
}

// 实际数据多边形（最多 120%，避免撑破图形）
const dataPoints = computed(() => {
  const pts = dimensions.map((d, i) => {
    const pct = Math.min(((statsData.value[d.key] ?? 0) / d.dri), 1.2)
    const r = R * pct
    const p = polarXY(angle(i), r)
    return `${p.x},${p.y}`
  })
  return pts.join(' ')
})

// 轴线端点（轴标签定位用）
const axisPoints = computed(() =>
  dimensions.map((d, i) => {
    const tip = polarXY(angle(i), R + 22)
    const inner = polarXY(angle(i), R)
    return { label: d.label, tip, inner }
  }),
)

// ── 摘要卡片 ──────────────────────────────────────────────
const summaryCards = computed(() =>
  dimensions.map((d) => {
    const val = statsData.value[d.key] ?? 0
    const pct = Math.round((val / d.dri) * 100)
    return { ...d, value: val, pct, over: pct > 100, under: pct < 60 }
  }),
)

// 整体健康得分：各维度偏差平均
// 优先使用后端计算好的得分，无数据时前端兜底计算
const healthScore = computed(() => {
  if (apiScore.value !== null)
    return apiScore.value
  const scores = dimensions.map((d) => {
    const pct = (statsData.value[d.key] ?? 0) / d.dri
    if (pct >= 0.6 && pct <= 1.0)
      return 100
    if (pct < 0.6)
      return Math.round(pct / 0.6 * 100)
    return Math.max(0, Math.round((1 - (pct - 1) * 1.5) * 100))
  })
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
})

const scoreLevel = computed(() => {
  if (healthScore.value >= 85)
    return { text: '优秀', color: 'text-teal-500' }
  if (healthScore.value >= 65)
    return { text: '良好', color: 'text-sky-500' }
  return { text: '待改善', color: 'text-amber-500' }
})

function goBack() {
  uni.navigateBack()
}
</script>

<template>
  <view class="page-container min-h-screen bg-[var(--page-bg)]">
    <wd-navbar title="营养统计" left-arrow safe-area-inset-top fixed @click-left="goBack" />
    <view :style="{ height: `${fixedNavbarHeight}px` }" />

    <view class="px-4 py-4 space-y-4">
      <!-- ── 时间段切换 ── -->
      <view class="flex border border-[var(--border-color)] rounded-2xl bg-[var(--card-bg)] p-1 shadow-sm">
        <view
          v-for="p in periods"
          :key="p.key"
          class="flex flex-1 items-center justify-center rounded-xl py-2 transition-all"
          :class="activePeriod === p.key
            ? 'bg-teal-500 shadow-sm'
            : 'active:opacity-60'"
          @click="activePeriod = p.key"
        >
          <text
            class="text-sm font-medium"
            :class="activePeriod === p.key ? 'text-white' : 'text-[var(--text-sub)]'"
          >
            {{ p.label }}
          </text>
        </view>
      </view>

      <!-- ── 健康得分卡片 ── -->
      <view class="relative overflow-hidden border border-teal-100 rounded-2xl bg-teal-50/60 p-5 dark:border-teal-800/40 dark:bg-teal-950/25">
        <view class="flex items-center justify-between">
          <view>
            <text class="block text-xs text-teal-600/70 dark:text-teal-400/70">
              综合营养得分
            </text>
            <view class="mt-1 flex items-end gap-2">
              <text class="text-5xl text-teal-600 font-black leading-none dark:text-teal-400">
                {{ loading ? '--' : healthScore }}
              </text>
              <text class="mb-1 text-sm text-teal-600/60 dark:text-teal-400/60">
                / 100
              </text>
            </view>
            <text class="mt-1 block text-sm font-semibold" :class="scoreLevel.color">
              {{ loading ? '' : scoreLevel.text }}
            </text>
          </view>
          <!-- 圆形进度环 -->
          <view class="relative h-20 w-20">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#99f6e4" stroke-width="6" opacity="0.4" />
              <circle
                cx="40" cy="40" r="32" fill="none"
                stroke="#0d9488" stroke-width="6"
                stroke-linecap="round"
                :stroke-dasharray="`${loading ? 0 : (healthScore / 100) * 201} 201`"
                stroke-dashoffset="50"
                style="transition: stroke-dasharray 0.6s ease"
              />
            </svg>
            <view class="absolute inset-0 flex items-center justify-center">
              <text class="text-xs text-teal-600 font-bold dark:text-teal-400">
                {{ loading ? '-' : `${healthScore}%` }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- ── 雷达图卡片 ── -->
      <view class="border border-[var(--border-color)] rounded-2xl bg-[var(--card-bg)] p-4 shadow-sm">
        <text class="mb-3 block text-sm text-[var(--text-main)] font-bold">
          营养摄入分布
        </text>

        <!-- loading 态 -->
        <view v-if="loading" class="flex items-center justify-center py-10">
          <wd-loading color="#0d9488" size="32px" />
        </view>

        <!-- SVG 雷达图 -->
        <view v-else class="flex items-center justify-center">
          <svg class="h-auto max-w-[280px] w-full" viewBox="0 0 280 280">

            <!-- 网格背景多边形 -->
            <polygon
              v-for="level in LEVELS"
              :key="level"
              :points="polyPoints(R * level / 100)"
              fill="none"
              stroke="#0d9488"
              stroke-width="0.5"
              :opacity="level === 100 ? 0.25 : 0.12"
            />

            <!-- 轴线 -->
            <line
              v-for="(ax, i) in axisPoints"
              :key="i"
              :x1="CX" :y1="CY"
              :x2="ax.inner.x" :y2="ax.inner.y"
              stroke="#0d9488"
              stroke-width="0.5"
              opacity="0.2"
            />

            <!-- DRI 参考线（100%） -->
            <polygon
              :points="polyPoints(R)"
              fill="#0d9488"
              fill-opacity="0.04"
              stroke="#0d9488"
              stroke-width="1"
              stroke-dasharray="4 3"
              opacity="0.5"
            />

            <!-- 实际数据面 -->
            <polygon
              :points="dataPoints"
              fill="#0d9488"
              fill-opacity="0.18"
              stroke="#0d9488"
              stroke-width="2"
              stroke-linejoin="round"
            />

            <!-- 数据顶点圆点 -->
            <circle
              v-for="(d, i) in dimensions"
              :key="d.key"
              :cx="polarXY(angle(i), Math.min((statsData[d.key] ?? 0) / d.dri, 1.2) * R).x"
              :cy="polarXY(angle(i), Math.min((statsData[d.key] ?? 0) / d.dri, 1.2) * R).y"
              r="4"
              fill="#0d9488"
              stroke="white"
              stroke-width="1.5"
            />

            <!-- 轴标签 -->
            <text
              v-for="(ax, i) in axisPoints"
              :key="`label-${i}`"
              :x="ax.tip.x"
              :y="ax.tip.y"
              text-anchor="middle"
              dominant-baseline="central"
              font-size="10"
              font-weight="500"
              fill="#0d9488"
              opacity="0.85"
            >
              {{ ax.label }}
            </text>

            <!-- 中心点 -->
            <circle :cx="CX" :cy="CY" r="3" fill="#0d9488" opacity="0.4" />
          </svg>
        </view>

        <!-- 图例 -->
        <view class="mt-1 flex justify-center gap-5">
          <view class="flex items-center gap-1.5">
            <view class="h-0.5 w-5 rounded-full bg-teal-400/50" style="border-top: 1px dashed #0d9488" />
            <text class="text-[10px] text-[var(--text-sub)]">
              DRI 参考值
            </text>
          </view>
          <view class="flex items-center gap-1.5">
            <view class="h-3 w-5 border border-teal-500/50 rounded-sm bg-teal-500/25" />
            <text class="text-[10px] text-[var(--text-sub)]">
              实际摄入
            </text>
          </view>
        </view>
      </view>

      <!-- ── 营养维度明细卡片 ── -->
      <view class="border border-[var(--border-color)] rounded-2xl bg-[var(--card-bg)] p-4 shadow-sm">
        <text class="mb-3 block text-sm text-[var(--text-main)] font-bold">
          各项详情
        </text>

        <view v-if="loading" class="space-y-4">
          <view v-for="i in 6" :key="i" class="rounded-xl bg-[var(--page-bg)] p-3">
            <wd-skeleton :row="1" loading />
          </view>
        </view>

        <view v-else class="space-y-2.5">
          <view
            v-for="card in summaryCards"
            :key="card.key"
            class="flex items-center gap-3 rounded-xl p-3"
            :class="card.over
              ? 'bg-amber-50/60 dark:bg-amber-900/10'
              : card.under
                ? 'bg-sky-50/50 dark:bg-sky-900/10'
                : 'bg-teal-50/40 dark:bg-teal-900/10'"
          >
            <!-- 维度标签 -->
            <view class="w-12 flex-shrink-0">
              <text class="text-xs text-[var(--text-main)] font-bold">
                {{ card.label }}
              </text>
              <text class="block text-[9px] text-[var(--text-sub)]">
                {{ card.unit }}
              </text>
            </view>

            <!-- 进度条 -->
            <view class="flex-1">
              <view class="h-2 w-full overflow-hidden rounded-full bg-[var(--border-color)]">
                <view
                  class="h-full rounded-full transition-all duration-500"
                  :class="card.over ? 'bg-amber-400' : card.under ? 'bg-sky-400' : 'bg-teal-500'"
                  :style="{ width: `${Math.min(card.pct, 100)}%` }"
                />
              </view>
            </view>

            <!-- 数值 + 百分比 -->
            <view class="w-20 flex-shrink-0 text-right">
              <text class="block text-xs text-[var(--text-main)] font-bold">
                {{ card.value }}<text class="text-[9px] text-[var(--text-sub)] font-normal">
                  {{ card.unit }}
                </text>
              </text>
              <text
                class="text-[10px] font-medium"
                :class="card.over ? 'text-amber-500' : card.under ? 'text-sky-500' : 'text-teal-500'"
              >
                {{ card.pct }}%
                <text v-if="card.over" class="text-[9px]">
                  ↑超标
                </text>
                <text v-else-if="card.under" class="text-[9px]">
                  ↓不足
                </text>
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- ── 底部说明 ── -->
      <view class="pb-4 text-center">
        <text class="text-[10px] text-[var(--text-sub)] opacity-60">
          数据基于中国居民膳食营养素参考摄入量（DRI）
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-container {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
