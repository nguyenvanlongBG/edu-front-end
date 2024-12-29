import type { IBaseControl } from '@/components/core/models/base/i-base-control'
import type { Question } from './question'

export interface IQuestionControl extends IBaseControl {
  value: Question
  isShowAnswer?: boolean
  isShowResult?: boolean
  isShowLevel?: boolean
  isShowChapter?: boolean
  isShowActionNote?: boolean
  isShowNote?: boolean
  isShowQuestionType?: boolean
  isShowActionToolbar?: boolean
  isShowToolEditor?: boolean
  isReadonlyResult?: boolean
  isReadonlyLevel?: boolean
  isReadonlyChapter?: boolean
  customAction?: (action: string) => void
}
