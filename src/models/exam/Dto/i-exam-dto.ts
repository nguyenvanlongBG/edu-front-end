import type { IExam } from '../i-exam'
import type { AnswerQuestion } from '@/models/answer-question/answer-question'
import type { ExamMode } from '@/enums/exam'

export interface IExamDto extends IExam {
  mode?: ExamMode
  answers?: AnswerQuestion[]
}
