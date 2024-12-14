// CheckboxControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import type { ILoadingControl } from './i-loading-control'
import { LoadingType } from '../../enums/Common'

export class LoadingControl extends BaseControl {
  constructor(control?: ILoadingControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  type: LoadingType = LoadingType.Skeleton
  value: boolean = false
  height: string = '100%'
}
