import commonFunction from '@/components/core/commons/CommonFunction'
import type { IQuestionControl } from './i-question-control'
import { BaseControl } from '@/components/core/models/base/base-control'
import { Question } from './question'
import type { ButtonControl } from '@/components/core/models/button/button-control'

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
  isShowAnswer: boolean = false
  isShowResult: boolean = false
  isShowLevel: boolean = false
  isShowActionToolbar: boolean = false
  isShowNote: boolean = false
  isShowPoint: boolean = false
  isShowToolEditor: boolean = false
  isShowChapter: boolean = false
  isShowQuestionType: boolean = false
  isReadonlyResult: boolean = false
  isReadonlyLevel: boolean = false
  isReadonlyPoint: boolean = false
  isReadonlyChapter: boolean = false
  isReadonlyToolEditor: boolean = false
  btnActions: Array<ButtonControl> = []
  customAction: ((actionName: string, data: Question) => void) | null = null
}
