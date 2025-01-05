// NumberControl.ts
import { BaseControl } from '@core/models/base/base-control'
import commonFunction from '@core/commons/CommonFunction'
import type { INoteControl } from './i-note-control'

export class NoteControl extends BaseControl {
  constructor(control?: INoteControl) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      control as unknown as Record<string, unknown>,
    )
  }

  value: string | null = null // Giá trị ban đầu
}
