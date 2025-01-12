import { BaseEntity } from '../base/base-entity'
import commonFunction from '@/components/core/commons/CommonFunction'
import type { IEnrollmentClass } from './i-enrollment-class'
import { EnrollmentStatus } from '@/enums/classroom'

export class EnrollmentClass extends BaseEntity {
  constructor(enroll?: IEnrollmentClass) {
    super()
    if (enroll) {
      commonFunction.assignProperties(
        this as Record<string, unknown>,
        enroll as unknown as Record<string, unknown>,
      )
    }
  }
  enrollmen_class_id?: string = ''
  user_id?: string = ''
  classroom_id?: string = ''
  status?: EnrollmentStatus = EnrollmentStatus.NONE
}
