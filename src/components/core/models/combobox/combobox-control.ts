// CheckboxControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import type { IComboboxControl } from './i-combobox-control'
import { ComboboxMode } from '../../enums/Common'
import { PagingParam } from '../paging/paging-param'

export class ComboboxControl extends BaseControl {
  constructor(control?: IComboboxControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  data: Array<Record<string, unknown>> = []
  displayField: string = 'display'
  valueField: string = 'value'
  value: unknown = null
  bindingText?: string = ''
  placeholder?: string = ''
  paging?: PagingParam = new PagingParam()
  mode?: ComboboxMode = ComboboxMode.Local
  isOnlySelect: boolean = false
  isOpenSelextBox: boolean = false
}
