import commonFunction from '@/components/core/commons/CommonFunction'
import { Test } from './test'
import type { ITestDto } from './i-test-dto'
import { TestMode } from '@/enums/test'
import type { Question } from '../question/question'

export class TestDto extends Test {
  constructor(test?: ITestDto) {
    super()
    if (test) {
      commonFunction.assignProperties(
        this as Record<string, unknown>,
        test as unknown as Record<string, unknown>,
      )
    }
  }
  lastExamId: string = ''
  mode: TestMode = TestMode.None // Nếu mode View thì cần dùng
  questions: Question[] = []
}
