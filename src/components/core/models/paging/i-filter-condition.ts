import type { FilterOperator } from '../../enums/Common'

export interface IFilterCondition {
  Field: string
  Operator: FilterOperator
  Value: unknown
}
