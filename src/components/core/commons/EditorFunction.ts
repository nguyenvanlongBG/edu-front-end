import commonFunction from './CommonFunction'

class EditorFunction {
  getContent(data: object[] | object) {
    if (typeof data == 'object' && !Array.isArray(data)) {
      return commonFunction.convertToString('ops' in data ? data.ops : [])
    }
    return commonFunction.convertToString(data)
  }
}
const editorFunction = new EditorFunction()
export default editorFunction
