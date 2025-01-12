import { BaseEntity } from '../base/base-entity'

export class Post extends BaseEntity {
  post_id: string = ''
  content: string = ''
  user_id: string = ''
  group_id: string = ''
  object_content: object[] = []
}
