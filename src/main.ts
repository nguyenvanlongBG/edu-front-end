import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import enUS from '@/i18n/en-US/index'
import viVN from '@/i18n/vi-VN/index'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
const messages = {
  'en-US': enUS,
  'vi-VN': viVN,
}

// Khởi tạo i18n với `createI18n`
const i18n = createI18n({
  locale: 'vi-VN', // Ngôn ngữ mặc định
  fallbackLocale: 'en-US',
  messages,
})
app.use(i18n)
app.mount('#app')
