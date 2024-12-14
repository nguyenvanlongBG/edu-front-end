import type { IBaseEntity } from '../base/i-base-entity'
export interface IClassroom extends IBaseEntity {
  classroom_id: string
  name: string
  description: string
  avatar: string
}
