import { QuestionMode, QuestionType } from '@/enums/question'
import type { IQuestion } from './i-question'
import { BaseEntity } from '../base/base-entity'
import type { OptionQuestion } from '../option-question/option-question'
import type { ResultQuestion } from '../result-question/result-question'
import commonFunction from '@/components/core/commons/CommonFunction'
import type { AnswerQuestion } from '../answer-question/answer-question'

export class Question extends BaseEntity {
  constructor(question?: IQuestion) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      question as unknown as Record<string, unknown>,
    )
  }
  question_id: string = ''
  content: string = ''
  object_content: object[] = []
  type: QuestionType = QuestionType.SingleChoice
  options?: OptionQuestion[] = []
  results?: ResultQuestion[] = []
  mode?: QuestionMode = QuestionMode.ViewOnly
  answers?: AnswerQuestion[]
}
