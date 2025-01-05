import type { IBaseEntity } from '../base/i-base-entity'
export interface IChapter extends IBaseEntity {
  chapter_id: string
  subject_id: string
  name: string
}
