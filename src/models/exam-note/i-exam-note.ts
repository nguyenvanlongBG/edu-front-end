import type { IBaseEntity } from '../base/i-base-entity'

export interface IExamNote extends IBaseEntity {
  exam_note_id?: string
  exam_id?: string | null
  question_id?: string
  content?: number
  object_content?: object[]
}
