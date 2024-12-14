import type { TestMode } from '@/enums/test'
import type { ITest } from './i-test'

export interface ITestDto extends ITest {
  lastExamId?: string
  mode: TestMode
  start_time?: Date
  duration: number
  finish_time?: Date
}
