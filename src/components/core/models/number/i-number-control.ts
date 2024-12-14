import type { IBaseControl } from '../base/i-base-control'

// i-number-control.ts
export interface INumberControl extends IBaseControl {
  value?: number | null
  required?: boolean
  placeholder?: string
  min?: number
  max?: number
  step?: number
  styleClass?: string
}
