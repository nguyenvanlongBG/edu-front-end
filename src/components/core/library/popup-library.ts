import i18n from '@/i18n'
import { createApp, type ComponentOptions } from 'vue'
class PopupLibrary {
  showPopup(
    promiseComponent: Promise<ComponentOptions>,
    props: Record<string, unknown>,
  ) {
    promiseComponent.then(componentResult => {
      const app = createApp(componentResult.default, props)
      app.use(i18n)
      // Mount the popup component to a new div
      const container = document.createElement('div')
      container.style.zIndex = '1000'
      document.body.appendChild(container)
      app.mount(container)
      app.config.globalProperties.$destroyPopup = () => {
        app.unmount()
        document.body.removeChild(container)
      }
    })
    return promiseComponent
  }
}
const poupLibrary = new PopupLibrary()
export default poupLibrary
