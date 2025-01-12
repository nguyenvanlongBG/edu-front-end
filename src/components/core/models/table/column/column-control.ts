// CheckboxControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import type { IColumnControl } from './i-column-control'
import { ColumnType } from '@/enums/enumeration'

export class ColumnControl extends BaseControl {
  constructor(control?: IColumnControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  name: string = ''
  type: ColumnType = ColumnType.TextBox
  valueKey: string = ''
  width: string = ''
  flex: number = 1
  toolbarItems: Array<BaseControl> = []
  customDisplay: (_: Record<string, unknown>) => unknown = (
    record: Record<string, unknown>,
  ) => {
    if (this.valueKey in record) {
      return record[this.valueKey]
    }
    return ''
  }
}
