import type { IBaseControl } from '../base/i-base-control'
import type { PagingParam } from '../paging/paging-param'
import type { ColumnControl } from './column/column-control'

export interface ITableControl extends IBaseControl {
  data?: Array<Record<string, unknown>>
  columns?: Array<ColumnControl>
  paging?: PagingParam
  value?: unknown
}
