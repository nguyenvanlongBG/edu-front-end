import { BaseEntity } from '../base/base-entity'
import type { IRessultQuestion } from './i-result-question'
import commonFunction from '@/components/core/commons/CommonFunction'

export class ResultQuestion extends BaseEntity {
  constructor(result?: IRessultQuestion) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      result as unknown as Record<string, unknown>,
    )
  }
  result_question_id: string = ''
  question_id: string = ''
  content: string = ''
}
