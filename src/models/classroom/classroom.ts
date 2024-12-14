import { BaseEntity } from '../base/base-entity'
import commonFunction from '@/components/core/commons/CommonFunction'
import type { IClassroom } from './i-classroom'

export class Classroom extends BaseEntity {
  constructor(question?: IClassroom) {
    super()
    if (question) {
      commonFunction.assignProperties(
        this as Record<string, unknown>,
        question as unknown as Record<string, unknown>,
      )
    } else {
      this.classroom_id = commonFunction.generateID()
    }
  }
  classroom_id: string = ''
  name: string = ''
  description: string = ''
  avatar: string = ''
}
