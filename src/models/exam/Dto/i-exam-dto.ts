import type { TestMode } from '@/enums/test'
import type { IExam } from '../i-exam'
import type { AnswerQuestion } from '@/models/answer-question/answer-question'

export interface IExamDto extends IExam {
  mode?: TestMode
  answers?: AnswerQuestion[]
}
