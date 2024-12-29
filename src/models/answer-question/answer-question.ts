import { BaseEntity } from '../base/base-entity'
import commonFunction from '@/components/core/commons/CommonFunction'
import type { IAnswerQuestion } from './i-answer-question'

export class AnswerQuestion extends BaseEntity {
  constructor(answer?: IAnswerQuestion) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      answer as unknown as Record<string, unknown>,
    )
  }
  exam_id: string = ''
  answer_id: string = ''
  question_id: string = ''
  content: string = ''
  point?: number = 0
}
