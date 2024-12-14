// DateControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import type { IDateControl } from './i-date-control'
import { useI18n } from 'vue-i18n'

export class DateControl extends BaseControl {
  constructor(control?: IDateControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  value: string = '' // Giá trị ngày
  required: boolean = false
  placeholder: string = ''
  minDate?: string // Ngày tối thiểu (ISO format)
  maxDate?: string // Ngày tối đa (ISO format)
  styleClass: string = ''

  validateCustom(value: string) {
    const { t } = useI18n()

    if (this.required && !value) {
      this.messageWarning = t('i18nCommon.NotEmptyValueWarning')
      return false
    }

    if (this.minDate && new Date(value) < new Date(this.minDate)) {
      this.messageWarning = commonFunction.formatString(
        t('i18nCommon.DateBelowMin'),
        this.minDate,
      )
      return false
    }

    if (this.maxDate && new Date(value) > new Date(this.maxDate)) {
      this.messageWarning = commonFunction.formatString(
        t('i18nCommon.DateAboveMax'),
        this.maxDate,
      )
      return false
    }

    return true
  }
}
