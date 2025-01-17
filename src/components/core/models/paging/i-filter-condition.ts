import type { FilterOperator, LogicalOperator } from '../../enums/Common'
import type { FilterCondition } from './filter-condition'

export interface IFilterCondition {
  Field: string
  Operator: FilterOperator
  Value: unknown
  SubConditions?: Array<FilterCondition>
  LogicalOperator?: LogicalOperator
}
