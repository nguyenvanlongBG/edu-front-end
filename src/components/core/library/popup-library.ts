import { createApp, type Component } from 'vue'

class PopupLibrary {
  showPopup(
    promiseComponent: Promise<Component>,
    props: Record<string, unknown>,
  ) {
    promiseComponent.then(componentResult => {
      const app = createApp(componentResult, { props })
      // Mount the popup component to a new div
      const container = document.createElement('div')
      document.body.appendChild(container)
      app.mount(container)
    })
    return promiseComponent
  }
}
const poupLibrary = new PopupLibrary()
export default poupLibrary
