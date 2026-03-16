<script lang="ts" setup>
import { useRequest } from 'alova/client'
import useTabbar from '@/composables/useTabbar'

const route = useRoute()
const { activeTabbar, setTabbarItemActive, tabbarList, updateTabbarFromRemote } = useTabbar()

// 使用 alova 请求
const { send: getTabbar } = useRequest(Apis.option.tabbar(), {
  immediate: true,
})

onMounted(async () => {
  try {
    const tabbarRes = await getTabbar()
    updateTabbarFromRemote(tabbarRes)

    nextTick(() => {
      setTimeout(() => {
        const currentName = route.name as string
        if (currentName) {
          setTabbarItemActive(currentName)
        }
      }, 100)
    })
  }
  catch (e) {
    console.error('Tabbar 加载失败', e)
  }
})

function handleTabbarChange({ value }: { value: string }) {
  const clickedItem = setTabbarItemActive(value)

  // 2. 从数据项中直接获取 page
  const targetPath = clickedItem?.page

  if (targetPath) {
    uni.switchTab({ url: targetPath })
  }
  else {
    console.error(`未找到名称为 ${value} 的跳转路径`)
  }
}
</script>

<template>
  <slot />
  <wd-gap safe-area-bottom height="var(--wot-tabbar-height, 50px)" />
  <wd-tabbar
    :model-value="activeTabbar.name"
    bordered
    safe-area-inset-bottom
    fixed
    active-color="#10b981"
    inactive-color="#6b7280"
    @change="handleTabbarChange"
  >
    <wd-tabbar-item
      v-for="tabbar in tabbarList"
      :key="tabbar.name"
      :name="tabbar.name"
      :title="tabbar.title"
      :value="tabbar.value || ''"
      :icon="tabbar.icon"
    >
<!--      <template #icon="{ active }">
        <IconHouse v-if="tabbar.name === 'home'" :color="active ? '#10b981' : '#6b7280'" />
        <IconList v-if="tabbar.name === 'feed'" :color="active ? '#10b981' : '#6b7280'" />
        <IconUser v-if="tabbar.name === 'profile'" :color="active ? '#10b981' : '#6b7280'" />
      </template>-->
    </wd-tabbar-item>
  </wd-tabbar>
</template>
