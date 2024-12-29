import commonFunction from '@/components/core/commons/CommonFunction'
import { TestMode } from '@/enums/test'
import { Exam } from '../exam'
import type { IExamDto } from './i-exam-dto'
import type { AnswerQuestion } from '@/models/answer-question/answer-question'

export class ExamDto extends Exam {
  constructor(exam?: IExamDto) {
    super()
    if (exam) {
      commonFunction.assignProperties(
        this as Record<string, unknown>,
        exam as unknown as Record<string, unknown>,
      )
    }
  }
  answers: AnswerQuestion[] = []
  mode: TestMode = TestMode.None // Nếu mode View thì cần dùng
}
