import { useI18n } from 'vue-i18n'
import commonFunction from '../../commons/CommonFunction'
import type { IBaseControl } from './i-base-control'

export class BaseControl implements IBaseControl {
  constructor(control?: Record<string, unknown>) {
    if (control) {
      if ('id' in control && typeof control['id'] === 'string') {
        this.id = control.id
      }
      commonFunction.assignProperties(
        this as Record<string, unknown>,
        control as Record<string, unknown>,
      )
    } else {
      this.id = commonFunction.generateID()
    }
  }
  value: unknown
  id: string = ''
  readonly: boolean = false
  label?: string = ''
  isLoading: boolean = false
  labelWidth?: string = ''
  messageWarning: string = ''
  ruleValidate: (value: unknown) => boolean = () => true
  validate(value: unknown) {
    const { t } = useI18n()
    let isValid = this.ruleValidate(value)
    if (!isValid) {
      this.messageWarning = t('i18nCommon.NotValidValueWarning')
      return false
    }
    isValid = this.validateCustom(value)
    return isValid
  }
  validateCustom(_: unknown) {
    if (_) {
      return true
    }
    return true
  }
}
