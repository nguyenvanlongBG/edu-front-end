import commonFunction from '@/components/core/commons/CommonFunction'
import type { IQuestionControl } from './i-question-control'
import { BaseControl } from '@/components/core/models/base/base-control'
import { Question } from './question'

export class QuestionControl extends BaseControl {
  constructor(control?: IQuestionControl) {
    super()
    if (control) {
      commonFunction.assignProperties(
        this as Record<string, unknown>,
        control as unknown as Record<string, unknown>,
      )
    }
  }
  value: Question = new Question()
  isShowAnswer?: boolean = false
  isShowResult?: boolean = false
}
