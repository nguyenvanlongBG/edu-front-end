import type { IBaseControl } from '../base/i-base-control'

export interface IEditorControl extends IBaseControl {
  value?: string
  isHideToolbar?: boolean
}
