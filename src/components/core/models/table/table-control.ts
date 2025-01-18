// CheckboxControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import type { ITableControl } from './i-table-control'
import type { ColumnControl } from './column/column-control'
import type { PagingParam } from '../paging/paging-param'
import type { ButtonControl } from '../button/button-control'

export class TableControl extends BaseControl {
  constructor(control?: ITableControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  data?: Array<Record<string, unknown>> = []
  columns: Array<ColumnControl> = []
  paging?: PagingParam
  isDisplayAction: (
    btn: ButtonControl,
    data: Record<string, unknown>,
  ) => boolean = (_btn: ButtonControl, _data: Record<string, unknown>) => {
    return true
  }
}
