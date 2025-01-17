import { BaseEntity } from '../base/base-entity'
import commonFunction from '@/components/core/commons/CommonFunction'
import type { IExamNote } from './i-exam-note'

export class ExamNote extends BaseEntity {
  constructor(exam?: IExamNote) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      exam as unknown as Record<string, unknown>,
    )
  }
  exam_note_id: string = ''
  exam_id: string = ''
  question_id: string = ''
  content: string = ''
  object_content: object[] = []
}
