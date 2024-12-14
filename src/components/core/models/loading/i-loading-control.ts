import type { LoadingType } from '../../enums/Common'
import type { IBaseControl } from '../base/i-base-control'

export interface ILoadingControl extends IBaseControl {
  value?: boolean
  type?: LoadingType
  height?: string
}
