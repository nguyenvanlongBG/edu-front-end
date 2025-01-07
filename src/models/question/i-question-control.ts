import type { IBaseControl } from '@/components/core/models/base/i-base-control'
import type { Question } from './question'
import type { ButtonControl } from '@/components/core/models/button/button-control'

export interface IQuestionControl extends IBaseControl {
  value: Question
  isShowAnswer?: boolean
  isShowResult?: boolean
  isShowLevel?: boolean
  isShowChapter?: boolean
  isShowPoint?: boolean
  isShowNote?: boolean
  isShowQuestionType?: boolean
  isShowActionToolbar?: boolean
  isShowToolEditor?: boolean
  isReadonlyResult?: boolean
  isReadonlyPoint?: boolean
  isReadonlyLevel?: boolean
  isReadonlyChapter?: boolean
  btnActions?: Array<ButtonControl>
  customAction?: (action: string, data: Question) => void
}
