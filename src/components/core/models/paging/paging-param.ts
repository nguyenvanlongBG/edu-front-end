// CheckboxControl.ts
import commonFunction from '@core/commons/CommonFunction'
import type { IPagingParam } from './i-paging-param'

export class PagingParam {
  constructor(control?: IPagingParam) {
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  take: number = 20
  page: number = 1
  get skip() {
    return (this.page >= 1 ? this.page - 1 : 1) * (this.take ?? 20)
  }
}
