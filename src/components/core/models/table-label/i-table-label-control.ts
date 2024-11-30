import type { IBaseControl } from '../base/i-base-control'
import type { ItemTableLabel } from './item-table-label'

export interface ITableLabelControl extends IBaseControl {
  data: Array<ItemTableLabel> // Trạng thái ban đầu của checkbox
  value: string
  numberItemPerRow: number
  displayValue: string
}
