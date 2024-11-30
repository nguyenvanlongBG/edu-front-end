import type { ButtonControl } from '../button/button-control'
import type { IPopupControl } from '../popup/i-popup-control'

export interface IDialogControl extends IPopupControl {
  title?: string // Header popup
  buttons?: Array<ButtonControl>
  message?: string
}
