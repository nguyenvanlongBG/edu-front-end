// CheckboxControl.ts
import commonFunction from '@core/commons/CommonFunction'
import type { ButtonControl } from '../button/button-control'
import type { IDialogControl } from './i-dialog-control'
import { PopupControl } from '../popup/popup-control'

export class DialogControl extends PopupControl {
  constructor(control?: IDialogControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  title?: string = 'EduSocial'
  buttons?: Array<ButtonControl> = []
  message: string = ''
}
