import type { IBaseEntity } from '../base/i-base-entity'

export interface IRessultQuestion extends IBaseEntity {
  result_question_id?: string
  content?: string
  question_id: string
}
