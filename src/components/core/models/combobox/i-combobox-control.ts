import type { ComboboxMode } from '../../enums/Common'
import type { IBaseControl } from '../base/i-base-control'
import type { PagingParam } from '../paging/paging-param'

export interface IComboboxControl extends IBaseControl {
  data?: Array<Record<string, unknown>>
  displayField?: string
  valueField?: string
  bindingText?: string
  placeholder?: string
  paging?: PagingParam
  value?: unknown
  mode?: ComboboxMode
  isOnlySelect?: boolean
  isOpenSelextBox?: boolean
}
