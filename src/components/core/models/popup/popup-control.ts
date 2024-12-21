// CheckboxControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import type { IPopupControl } from './i-popup-control'
import i18n from '@/i18n'
import { createApp, type ComponentOptions } from 'vue'

export class PopupControl extends BaseControl {
  constructor(control?: IPopupControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  width: string = '400px'
  styleClass: string = ''
  show(
    promiseComponent: Promise<ComponentOptions>,
    props: Record<string, unknown>,
    handleEmit: (event: string, ...args: unknown[]) => void, // Callback để xử lý sự kiện emit
  ) {
    promiseComponent.then(componentResult => {
      const app = createApp(componentResult.default, props)
      app.use(i18n)

      // Mount the popup component to a new div
      const container = document.createElement('div')
      document.body.appendChild(container)

      // Mount component và lấy instance
      app.mount(container)

      // Hàm để đóng popup
      const closeFuct = () => {
        app.unmount()
        document.body.removeChild(container)
      }

      // Gắn hàm đóng popup vào globalProperties
      app.config.globalProperties.$destroyPopup = closeFuct
      this.close = closeFuct

      this.handleEmit = handleEmit
    })
  }

  close() {}

  handleEmit(eventName: string, ...args: unknown[]) {}
}
