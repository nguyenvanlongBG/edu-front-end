import type { ExamStatus } from '@/enums/exam'
import type { IBaseEntity } from '../base/i-base-entity'

export interface IExam extends IBaseEntity {
  exam_id?: string
  user_id?: string | null
  test_id?: string
  point?: number
  status?: ExamStatus
}
