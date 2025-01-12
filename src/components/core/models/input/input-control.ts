// CheckboxControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import type { IInputControl } from './i-input-control'
import { useI18n } from 'vue-i18n'

export class InputControl extends BaseControl {
  constructor(control?: IInputControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  type: string = 'text'
  value: string = '' // Trạng thái ban đầu của checkbox
  required: boolean = false
  placeholder: string = ''
  styleClass: string = ''
  maxLength: number = 255
  isHorizontal: boolean = true
  validateCustom(value: string) {
    const { t } = useI18n()
    if (this.required && !value) {
      this.messageWarning = t('i18nCommon.NotEmptyValueWarning')
      return false
    }
    if (this.maxLength && value.length > this.maxLength) {
      this.messageWarning = commonFunction.formatString(
        t('i18nCommon.OverMaxLength'),
        this.maxLength,
      )
      return false
    }
    return true
  }
}
