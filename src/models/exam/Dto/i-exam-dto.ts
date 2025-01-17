import type { IExam } from '../i-exam'
import type { AnswerQuestion } from '@/models/answer-question/answer-question'
import type { ExamMode } from '@/enums/exam'
import type { ExamNote } from '@/models/exam-note/exam-note'

export interface IExamDto extends IExam {
  mode?: ExamMode
  answers?: AnswerQuestion[]
  notes?: ExamNote[]
}
