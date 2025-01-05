import type { IBaseControl } from '../base/i-base-control'
import type { TabItemControl } from './tab-item/tab-item-control'

export interface ITabControl extends IBaseControl {
  tabs?: Array<TabItemControl>
}
