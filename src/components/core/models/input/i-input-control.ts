import type { IBaseControl } from '../base/i-base-control'

export interface IInputControl extends IBaseControl {
  value?: string
  type?: string
  required?: boolean
  placeholder?: string
  styleClass?: string
  maxLength?: number
}
