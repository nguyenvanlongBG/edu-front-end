import commonFunction from '@/components/core/commons/CommonFunction'
import type { IChapterGenQuestionConfig } from './i-chapter-gen-question-config'

export class ChapterGenQuestionConfig {
  constructor(param?: IChapterGenQuestionConfig) {
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      param as unknown as Record<string, unknown>,
    )
  }
  chapter_id: string = ''
  Recognition: number = 0
  Comprehension: number = 0
  Application: number = 0
  AdvancedApplication: number = 0
}
