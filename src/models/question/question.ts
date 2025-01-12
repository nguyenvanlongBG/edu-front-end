import { QuestionMode, QuestionType, QuestionLevel } from '@/enums/question'
import type { IQuestion } from './i-question'
import { BaseEntity } from '../base/base-entity'
import type { OptionQuestion } from '../option-question/option-question'
import type { ResultQuestion } from '../result-question/result-question'
import commonFunction from '@/components/core/commons/CommonFunction'
import type { AnswerQuestion } from '../answer-question/answer-question'
import { GuidEmpty } from '@/constants/consstant'

export class Question extends BaseEntity {
  constructor(question?: IQuestion) {
    super()
    if (question) {
      commonFunction.assignProperties(
        this as Record<string, unknown>,
        question as unknown as Record<string, unknown>,
      )
    } else {
      this.question_id = commonFunction.generateID()
    }
  }
  question_id: string = ''
  content: string = ''
  user_id: string = ''
  subject_id: string = GuidEmpty
  lstChapterId?: string[] = []
  chapter_ids: string = ''
  object_content: object[] | object = []
  type: QuestionType = QuestionType.SingleChoice
  level: QuestionLevel = QuestionLevel.Recognition
  options?: OptionQuestion[] = []
  results?: ResultQuestion[] = []
  mode?: QuestionMode = QuestionMode.ViewCanEdit
  answer?: AnswerQuestion
}
