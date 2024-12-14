// NumberControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import type { INumberControl } from './i-number-control'
import { useI18n } from 'vue-i18n'

export class NumberControl extends BaseControl {
  constructor(control?: INumberControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }

  value: number | null = null // Giá trị ban đầu
  required: boolean = false
  placeholder: string = ''
  min?: number // Giá trị nhỏ nhất
  max?: number // Giá trị lớn nhất
  step: number = 1 // Bước tăng giảm
  styleClass: string = ''

  validateCustom(value: number | null) {
    const { t } = useI18n()

    if (this.required && (value === null || value === undefined)) {
      this.messageWarning = t('i18nCommon.NotEmptyValueWarning')
      return false
    }

    if (this.min !== undefined && value !== null && value < this.min) {
      this.messageWarning = commonFunction.formatString(
        t('i18nCommon.ValueBelowMin'),
        this.min,
      )
      return false
    }

    if (this.max !== undefined && value !== null && value > this.max) {
      this.messageWarning = commonFunction.formatString(
        t('i18nCommon.ValueAboveMax'),
        this.max,
      )
      return false
    }

    return true
  }
}
