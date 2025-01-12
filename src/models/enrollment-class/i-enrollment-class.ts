import { EnrollmentStatus } from '@/enums/classroom'
import type { IBaseEntity } from '../base/i-base-entity'
export interface IEnrollmentClass extends IBaseEntity {
  enrollmen_class_id?: string
  user_id?: string
  classroom_id?: string
  status?: EnrollmentStatus
}
