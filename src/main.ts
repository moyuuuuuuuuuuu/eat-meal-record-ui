import { createSSRApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'uno.css'

const pinia = createPinia()
pinia.use(persistPlugin)

export function createApp() {
  const app = createSSRApp(App)
  const loadingProps = ref({ color: '#08A170' })

  app.provide('globalLoadingProps', loadingProps)
  app.use(router)
  app.use(pinia)
  return {
    app,
  }
}
