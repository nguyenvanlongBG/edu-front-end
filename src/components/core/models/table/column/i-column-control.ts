import type { ColumnType } from '@/enums/enumeration'
import type { IBaseControl } from '../../base/i-base-control'

export interface IColumnControl extends IBaseControl {
  name: string
  valueKey: string
  type?: ColumnType
  customDisplay?: (_: Record<string, unknown>) => unknown
}
