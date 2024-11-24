// CheckboxControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import type { ICheckboxControl } from './i-checkbox-control'

export class CheckboxControl extends BaseControl {
  constructor(control?: ICheckboxControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  checked: boolean = false // Trạng thái ban đầu của checkbox
}
