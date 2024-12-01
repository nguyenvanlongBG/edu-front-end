import type { FilterCondition } from './filter-condition'

export interface IPagingParam {
  page: number
  take: number
  filters?: Array<FilterCondition>
}
