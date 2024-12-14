import type { IBaseEntity } from '../base/i-base-entity'

export interface IOptionQuestion extends IBaseEntity {
  option_question_id?: string
  content?: string
  question_id?: string
  object_content?: object[]
}
