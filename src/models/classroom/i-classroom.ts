import type { EnrollmentStatus } from '@/enums/classroom'
import type { IBaseEntity } from '../base/i-base-entity'
export interface IClassroom extends IBaseEntity {
  classroom_id: string
  name: string
  classroom_code: string
  description?: string
  avatar?: string
  user_id?: string
  status?: EnrollmentStatus
}
