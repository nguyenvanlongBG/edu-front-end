import type { TestMode } from '@/enums/test'
import type { ITest } from './i-test'
import type { Question } from '../question/question'
import type { ExamDto } from '../exam/Dto/exam-dto'

export interface ITestDto extends ITest {
  exam_id?: string
  mode?: TestMode
  start_time?: Date
  duration?: number
  finish_time?: Date
  questions?: Question[]
  question_ids_attention?: string
  exam?: ExamDto | null
}
