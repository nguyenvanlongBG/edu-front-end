import commonFunction from '@core/commons/CommonFunction'
import { BaseControl } from '@core/models/base/base-control'
import type { IButtonControl } from './i-button-control'

// Định nghĩa class ButtonControl kế thừa BaseControl
export class ButtonControl extends BaseControl {
  label: string = '' // Thuộc tính label mặc định là chuỗi rỗng

  constructor(control?: IButtonControl) {
    super() // Gọi constructor của lớp cha (BaseControl)
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as Record<string, unknown>,
    )
  }
  iconLeft?: string
  iconRight?: string
  styleClass: string = ''
  style: Record<string, string> = {}
  classType: 'solid' | 'default' | 'outline' = 'default' // Thêm classType
}
