import { BaseEntity } from '../base/base-entity'
import type { IOptionQuestion } from './i-option-question'
import commonFunction from '@/components/core/commons/CommonFunction'

export class OptionQuestion extends BaseEntity {
  constructor(option?: IOptionQuestion) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      option as unknown as Record<string, unknown>,
    )
  }
  option_question_id: string = ''
  content: string = ''
  object_content: object[] | object = []
  question_id: string = ''
}
