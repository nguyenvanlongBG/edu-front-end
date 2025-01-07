import type { TestMode } from '@/enums/test'
import type { ITest } from './i-test'
import type { Question } from '../question/question'

export interface ITestDto extends ITest {
  exam_id?: string
  mode?: TestMode
  start_time?: Date
  duration?: number
  finish_time?: Date
  questions?: Question[]
}
