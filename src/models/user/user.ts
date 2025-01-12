import { BaseEntity } from '../base/base-entity'
import commonFunction from '@/components/core/commons/CommonFunction'
import type { IUser } from './i-user'
import { Role } from '@/enums/role'

export class User extends BaseEntity {
  constructor(test?: IUser) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      test as unknown as Record<string, unknown>,
    )
  }
  name: string = ''
  user_id: string = ''
  user_name: string = ''
  role_id?: Role = Role.Student
}
