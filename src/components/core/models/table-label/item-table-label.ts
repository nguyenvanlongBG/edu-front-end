// CheckboxControl.ts
import commonFunction from '@core/commons/CommonFunction'
import type { IItemTableLabel } from './i-item-table-label'

export class ItemTableLabel {
  constructor(control?: IItemTableLabel) {
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  value: string = ''
  data: unknown
}
