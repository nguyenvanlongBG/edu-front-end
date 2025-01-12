import type { Role } from '@/enums/role'
import type { IBaseEntity } from '../base/i-base-entity'

export interface IUser extends IBaseEntity {
  user_id?: string
  name: string
  user_name?: string
  role_id?: Role
}
