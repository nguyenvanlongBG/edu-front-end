import commonFunction from '@/components/core/commons/CommonFunction'
import type { IParamAutoGenTest } from './i-param-auto-gen-test'
import type { ChapterGenQuestionConfig } from './chapter-gen-question-config'

export class ParamAutoGenTest {
  constructor(param?: IParamAutoGenTest) {
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      param as unknown as Record<string, unknown>,
    )
  }
  chapters: Array<ChapterGenQuestionConfig> = []
}
