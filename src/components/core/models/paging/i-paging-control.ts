import type { IBaseControl } from '../base/i-base-control'
import type { PagingParam } from './paging-param'

export interface IPagingControl extends IBaseControl {
  value: PagingParam
  currentPage: number
  totalPage: number
}
