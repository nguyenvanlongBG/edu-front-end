// NumberControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import type { ITabControl } from './i-tab-control'
import type { TabItemControl } from './tab-item/tab-item-control'

export class TabControl extends BaseControl {
  constructor(control?: ITabControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  tabs: Array<TabItemControl> = []
}
