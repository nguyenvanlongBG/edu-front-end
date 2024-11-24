import { BaseControl } from '@core/models/base/base-control'
import type { IEditorControl } from './i-editor-control'
import commonFunction from '../../commons/CommonFunction'

export class EditorControl extends BaseControl {
  constructor(control?: IEditorControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  value: string = ''
}
