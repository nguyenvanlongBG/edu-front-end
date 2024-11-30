// CheckboxControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import type { ITableLabelControl } from './i-table-label-control'
import type { ItemTableLabel } from './item-table-label'

export class TableLabelControl extends BaseControl {
  constructor(control?: ITableLabelControl) {
    super()
    if (control) {
      commonFunction.assignProperties(
        this as Record<string, unknown>,
        control as unknown as Record<string, unknown>,
      )
    }
  }
  data: Array<ItemTableLabel> = []
  value: string = ''
  numberItemPerRow: number = 5
  displayValue: string = ''
}
