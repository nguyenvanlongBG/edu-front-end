import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import coreEn from '@core/i18n/en-US'
import coreVn from '@core/i18n/vi-VN'
import viVN from '@/i18n/vi-VN/index'
import enUS from '@/i18n/en-US/index'
import { MathfieldElement } from 'mathlive'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
const messages = {
  'en-US': { ...coreEn, ...enUS },
  'vi-VN': { ...coreVn, ...viVN },
}

// Khởi tạo i18n với `createI18n`
const i18n = createI18n({
  locale: 'vi-VN', // Ngôn ngữ mặc định
  fallbackLocale: 'en-US',
  messages,
})
app.use(i18n)
app.component('math-field', MathfieldElement)
app.mount('#app')
