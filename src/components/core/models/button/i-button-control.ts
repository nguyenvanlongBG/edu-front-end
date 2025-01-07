import type { IBaseControl } from '../base/i-base-control'

export interface IButtonControl extends IBaseControl {
  label?: string
  name?: string
  iconLeft?: string
  iconRight?: string
  styleClass?: string
  style?: Record<string, string>
  classType?: string // Thêm classType
}
