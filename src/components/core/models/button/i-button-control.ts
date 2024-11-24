import type { IBaseControl } from '../base/i-base-control'

export interface IButtonControl extends IBaseControl {
  name?: string
  iconLeft?: string
  iconRight?: string
  style?: Record<string, string>
  classType?: string // Thêm classType
}
