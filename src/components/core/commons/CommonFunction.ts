import { v4 as uuidv4 } from 'uuid'
class CommonFunction {
  generateID() {
    return uuidv4()
  }
  convertToInstance<T extends object>(
    data: Record<string, unknown>,
    ctor: new () => T,
  ): T {
    const item = new ctor()
    for (const key in data) {
      if (data.hasOwnProperty(key) && item.hasOwnProperty(key)) {
        ;(item as Record<string, unknown>)[key] = data[key]
      }
    }
    return item
  }
  convertToInstances<T extends object>(
    data: Array<Record<string, unknown>>,
    ctor: new () => T,
  ): Array<T> {
    const instances: Array<T> = [] // Array to hold the instances.

    if (data && data.length) {
      for (const record of data) {
        const item = new ctor() // Create a new instance of T for each record.

        for (const key in record) {
          // Iterate over each key in the record.
          if (record.hasOwnProperty(key) && item.hasOwnProperty(key)) {
            ;(item as Record<string, unknown>)[key] = record[key]
          }
        }

        instances.push(item) // Add the configured item to the instances array.
      }
    }

    return instances
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
  convertToString(data: unknown) {
    return JSON.stringify(data)
  }
  convertToData<T>(data: string) {
    return JSON.parse(data) as T
  }
}
const commonFunction = new CommonFunction()
export default commonFunction
