import { BaseEntity } from '../base/base-entity'
import commonFunction from '@/components/core/commons/CommonFunction'
import type { IExam } from './i-exam'
import { ExamStatus } from '@/enums/exam'

export class Exam extends BaseEntity {
  constructor(exam?: IExam) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      exam as unknown as Record<string, unknown>,
    )
  }
  exam_id: string = ''
  user_id: string | null = null
  test_id: string = ''
  point: number = 0
  status: ExamStatus = ExamStatus.None
}
