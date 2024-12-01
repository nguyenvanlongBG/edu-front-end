// CheckboxControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import type { IPopupControl } from './i-popup-control'

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
}
