import type { IBaseEntity } from '../base/i-base-entity'

export interface IPost extends IBaseEntity {
  post_id?: string
  content?: string
  user_id?: string
  group_id?: string
  object_content?: object[]
}
