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
  id: string = ''
  readonly: boolean = false
  label?: string = ''
  isLoading: boolean = false
  labelWidth?: string = ''
}
