import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@core': fileURLToPath(new URL('./src/components/core', import.meta.url)),
      '@components': fileURLToPath(
        new URL('./src/components', import.meta.url),
      ),
      '@question': fileURLToPath(
        new URL('./src/components/question', import.meta.url),
      ),
      '@models': fileURLToPath(new URL('./src/models', import.meta.url)),
      '@enums': fileURLToPath(new URL('./src/enums', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          '@use "@core/styles/global.scss"; @use "@core/styles/variables" as *;', // Tự động import file biến SCSS
      },
    },
  },
})
