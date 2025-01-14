// CheckboxControl.ts
import commonFunction from '@core/commons/CommonFunction'
import type { IPagingParam } from './i-paging-param'
import type { FilterCondition } from './filter-condition'

export class PagingParam {
  constructor(control?: IPagingParam) {
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  take: number = 20
  page: number = 1
  filters: Array<FilterCondition> = []
  get skip() {
    return (this.page >= 1 ? this.page - 1 : 1) * (this.take ?? 20)
  }
}
