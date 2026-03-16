export interface TabbarItem {
  name: string
  value: number | null
  active: boolean
  title: string
  icon: string
  page: string
}

const tabbarItems = ref<TabbarItem[]>([
  { name: 'home', value: null, active: true, title: '首页', icon: 'home', page: '/pages/index/index' },
  // { name: 'feed', value: null, active: false, title: '动态', icon: 'list' , page: '/pages/feed/index'},
  { name: 'profile', value: null, active: false, title: '我的', icon: 'user', page: '/pages/profile/index' },
])

function useTabbar() {
  const tabbarList = computed(() => tabbarItems.value)

  const activeTabbar = computed(() => {
    const item = tabbarItems.value.find(item => item.active)
    return item || tabbarItems.value[0]
  })

  const getTabbarItemValue = (name: string) => {
    const item = tabbarItems.value.find(item => item.name === name)
    return item && item.value ? item.value : null
  }

  const setTabbarItem = (name: string, value: number) => {
    const tabbarItem = tabbarItems.value.find(item => item.name === name)
    if (tabbarItem) {
      tabbarItem.value = value
    }
  }
  const updateTabbarFromRemote = (remoteData: any[]) => {
    const currentActiveName = activeTabbar.value?.name
    tabbarItems.value = remoteData.map(item => ({
      ...item,
      value: null,
      active: item.name === currentActiveName,
    }))
  }
  const setTabbarItemActive = (name: string) => {
    let activeItem: TabbarItem | undefined
    tabbarItems.value.forEach((item) => {
      item.active = item.name === name
      if (item.active)
        activeItem = item
    })
    return activeItem
  }

  return {
    tabbarList,
    activeTabbar,
    getTabbarItemValue,
    setTabbarItem,
    setTabbarItemActive,
    updateTabbarFromRemote,
  }
}

export default useTabbar
