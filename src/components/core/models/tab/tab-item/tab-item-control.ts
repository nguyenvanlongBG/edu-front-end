// NumberControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import type { ITabItemControl } from './i-tab-item-control'

export class TabItemControl extends BaseControl {
  constructor(control?: ITabItemControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  id: string = ''
  name: string = ''
}
