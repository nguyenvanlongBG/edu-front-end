import type {
  QuestionMode,
  QuestionType,
  QuestionLevel,
} from '@/enums/question'
import type { IBaseEntity } from '../base/i-base-entity'
import type { OptionQuestion } from '../option-question/option-question'
import type { ResultQuestion } from '../result-question/result-question'
import type { AnswerQuestion } from '../answer-question/answer-question'

export interface IQuestion extends IBaseEntity {
  content: string
  user_id: string
  subject_id: string
  lstChapterId?: string[]
  chapter_ids?: string
  object_content: object[]
  question_id: string
  options?: OptionQuestion[]
  results?: ResultQuestion[]
  type: QuestionType
  level: QuestionLevel
  mode?: QuestionMode
  answer?: AnswerQuestion
}
