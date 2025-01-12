import type { ColumnType } from '@/enums/enumeration'
import type { IBaseControl } from '../../base/i-base-control'
import type { BaseControl } from '../../base/base-control'

export interface IColumnControl extends IBaseControl {
  name: string
  valueKey?: string
  type?: ColumnType
  width?: string
  flex?: number
  toolbarItems?: Array<BaseControl>
  customDisplay?: (_: Record<string, unknown>) => unknown
}
