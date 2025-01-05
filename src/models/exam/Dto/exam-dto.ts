import commonFunction from '@/components/core/commons/CommonFunction'
import { Exam } from '../exam'
import type { IExamDto } from './i-exam-dto'
import type { AnswerQuestion } from '@/models/answer-question/answer-question'
import { ExamMode } from '@/enums/exam'

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
  mode: ExamMode = ExamMode.None // Nếu mode View thì cần dùng
}
