import type { IBaseEntity } from '../base/i-base-entity'

export interface IAnswerQuestion extends IBaseEntity {
  exam_id: string
  answer_id: string
  question_id?: string
  content?: string
  object_content?: object[]
  point?: number
}
