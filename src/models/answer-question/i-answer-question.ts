import type { IBaseEntity } from '../base/i-base-entity'

export interface IAnswerQuestion extends IBaseEntity {
  question_id: string
  content: string
  point?: number
}
