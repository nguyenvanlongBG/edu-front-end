// CheckboxControl.ts
import commonFunction from '@core/commons/CommonFunction'
import { BaseControl } from '../base/base-control'
import type { IPagingControl } from './i-paging-control'
import { PagingParam } from './paging-param'
export class PagingControl extends BaseControl {
  constructor(control?: IPagingControl) {
    super()
    if (control) {
      commonFunction.assignProperties(
        this as Record<string, unknown>,
        control as unknown as Record<string, unknown>,
      )
    }
  }
  value: PagingParam = new PagingParam()
  currentPage: number = 0
  totalPage: number = 0
}
