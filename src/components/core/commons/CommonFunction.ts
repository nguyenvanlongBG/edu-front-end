import { v4 as uuidv4 } from 'uuid'
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
  formatString(str: string, ...values: Array<string | number>): string {
    return str.replace(/\[(\d+)]/g, (match, index) => {
      const valueIndex = parseInt(index, 10)
      return values[valueIndex] !== undefined
        ? values[valueIndex].toString()
        : match
    })
  }
}
const commonFunction = new CommonFunction()
export default commonFunction
