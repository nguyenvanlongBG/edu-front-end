// CheckboxControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import { ComboboxMode } from '../../enums/Common'
import { PagingParam } from '../paging/paging-param'
import type { IMultiComboboxControl } from './i-multi-combobox-control'

export class MultiComboboxControl extends BaseControl {
  constructor(control?: IMultiComboboxControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }
  data: Array<Record<string, unknown>> = []
  displayField: string = 'display'
  valueField: string = 'value'
  value: Array<unknown> = []
  bindingText?: string = ''
  placeholder?: string = ''
  paging?: PagingParam = new PagingParam()
  mode?: ComboboxMode = ComboboxMode.Local
  isOnlySelect: boolean = false
  isOpenSelextBox: boolean = false
}
