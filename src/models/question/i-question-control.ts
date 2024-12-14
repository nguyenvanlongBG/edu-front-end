import type { IBaseControl } from '@/components/core/models/base/i-base-control'
import type { Question } from './question'

export interface IQuestionControl extends IBaseControl {
  value: Question
  isShowAnswer?: boolean
  isShowResult?: boolean
}
