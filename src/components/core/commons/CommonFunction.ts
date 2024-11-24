import { v4 as uuidv4 } from 'uuid'
import { createApp, type Component } from 'vue'
class CommonFunction {
  generateID() {
    return uuidv4()
  }
  convertInterfaceToInstance(data: Record<string, unknown>, root: unknown) {
    if (root) {
    }
  }
  assignProperties(
    target: Record<string, unknown>,
    source: Record<string, unknown>,
  ): void {
    if (source) {
      Object.keys(source).forEach(key => {
        if (key in target) {
          target[key] = source[key]
        }
      })
    }
  }
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
const commonFunction = new CommonFunction()
export default commonFunction
