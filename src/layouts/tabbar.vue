<script lang="ts" setup>
const router = useRouter()

const route = useRoute()

const { activeTabbar, getTabbarItemValue, setTabbarItemActive, tabbarList } = useTabbar()

function handleTabbarChange({ value }: { value: string }) {
  setTabbarItemActive(value)
  const paths: Record<string, string> = {
    home: '/pages/index/index',
    feed: '/pages/feed/index',
    profile: '/pages/profile/index',
  }
  uni.switchTab({ url: paths[value] })
}

onMounted(() => {
  uni.hideTabBar()
  nextTick(() => {
    if (route.name && route.name !== activeTabbar.value.name) {
      setTabbarItemActive(route.name)
    }
  })
})
</script>

<script lang="ts">
export default {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
}
</script>

<template>
  <slot />
  <wd-gap safe-area-bottom height="var(--wot-tabbar-height, 50px)" />
  <wd-tabbar
    :model-value="activeTabbar.name" bordered safe-area-inset-bottom fixed
    @change="handleTabbarChange"
  >
    <wd-tabbar-item name="home" title="首页">
      <template #icon="{ active }">
        <IconHouse :color="active ? '#10b981' : '#6b7280'" />
      </template>
    </wd-tabbar-item>
    <wd-tabbar-item name="feed" title="动态">
      <template #icon="{ active }">
        <IconList :color="active ? '#10b981' : '#6b7280'" />
      </template>
    </wd-tabbar-item>
    <wd-tabbar-item name="profile" title="我的">
      <template #icon="{ active }">
        <IconUser :color="active ? '#10b981' : '#6b7280'" />
      </template>
    </wd-tabbar-item>
  </wd-tabbar>
</template>
