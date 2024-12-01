import i18nVn from './vi-VN'
import i18nEN from './en-US'
import { createI18n } from 'vue-i18n'

const messages = {
  'en-US': i18nEN,
  'vi-VN': i18nVn,
}

// Tạo đối tượng i18n
const i18n = createI18n({
  locale: 'vi-VN', // Ngôn ngữ mặc định
  fallbackLocale: 'en-US', // Sử dụng tiếng Anh nếu không có bản dịch
  globalInjection: true, // Cho phép sử dụng $t trực tiếp trong template
  legacy: false, // Sử dụng Composition API
  messages,
})

export default i18n
