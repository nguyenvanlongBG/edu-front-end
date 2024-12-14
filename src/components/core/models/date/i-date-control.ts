import type { IBaseControl } from '../base/i-base-control'

// i-date-control.ts
export interface IDateControl extends IBaseControl {
  value?: string
  required?: boolean
  placeholder?: string
  minDate?: string
  maxDate?: string
  styleClass?: string
}
