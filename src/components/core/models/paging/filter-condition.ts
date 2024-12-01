// CheckboxControl.ts
import commonFunction from '@core/commons/CommonFunction'
import { FilterOperator } from '../../enums/Common'
import type { IFilterCondition } from './i-filter-condition'

export class FilterCondition {
  constructor(control?: IFilterCondition) {
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  Field: string = ''
  Operator: FilterOperator = FilterOperator.Equal
  Value: unknown
}
